angular
    .module('app')
    .service('MapsService', MapsService);

MapsService.$inject = ['TimeService', 'WeatherService'];

function MapsService(TimeService, WeatherService) {
    var currentMarkers = [];

    var newMarker = function(lat, lng, map, maps, forecast, infowindow) {
        var weatherIcon = judgeForecast(forecast);
        var icon = {url: weatherIcon, scaledSize: new maps.Size(35, 45)};
        var newMarker = new maps.Marker({position: {lat, lng}, map: map, icon: icon});
        newMarker.addListener('click', function() {
            infowindow.setOptions({content: forecast['summary']});
            infowindow.open(map, newMarker);
        });
        currentMarkers.push(newMarker);
    }

    var getWeather = function(lat, lng, timeFormats, map, maps, infowindow, accruedTripTime) {
        var forecast;
        var additionalHours = TimeService.getAccruedTripHours(accruedTripTime);
        var todayStartTime = hoursIntoFutureFromToday(timeFormats);
        var tomorrowStartTime = hoursIntoFutureFromTomorrow(timeFormats);

        WeatherService.getWeather(lat, lng)
          .then(function(data) {
            if(timeFormats['dayOfWeek'] === 'Today') {
                forecast = data['data']['hourly']['data'][todayStartTime + additionalHours];
                newMarker(lat, lng, map, maps, forecast, infowindow)
            } else if(timeFormats['dayOfWeek'] === 'Tomorrow') {
                forecast = data['data']['hourly']['data'][tomorrowStartTime + additionalHours];
                newMarker(lat, lng, map, maps, forecast, infowindow)
            } else {
                forecast = data['data']['daily']['data'][timeFormats['dayInt']];
                newMarker(lat, lng, map, maps, forecast, infowindow)
            }
        });
    }

    var judgeForecast = function(forecast) {
        if(forecast['summary'] === 'Thunderstorm') {
            return 'images/redmarker.png';
        } else {
            return 'images/greenmarker.png';
        }
    }

    var toMiles = function(meters) {
        return Math.floor(meters/1609);
    }

    var getCadence = function(miles) {
        if(miles < 100) {
            return 60;
        } else if(miles > 100 && miles < 500) {
            return 40;
        } else if(miles > 500 && miles < 1500){
            return 20;
        } else {
            return 10;
        }
    }

    var hoursIntoFutureFromToday = function(timeFormats) {
        var currentHour = new Date(Date.now()).getHours();
        return (timeFormats['militaryTime'] - currentHour)-1;
    }

    var hoursIntoFutureFromTomorrow = function(timeFormats) {
        var currentHour = new Date(Date.now()).getHours();
        return ((timeFormats['militaryTime'] + 24) - currentHour)-1;
    }

    this.createMarkers = function(response, maps, map, timeFormats) {
        var accruedTripTime = 0;
        var infowindow = new maps.InfoWindow();
        var distanceInMeters = response['routes'][0]['legs'][0]['distance']['value'];
        var cadence = getCadence(toMiles(distanceInMeters));
        var durationInMinutes = Math.floor(response['routes'][0]['legs'][0]['duration']['value'] / 60);
        var routePoints = response['routes'][0]['overview_path'];
        var markerCount = Math.floor(routePoints.length / cadence);
        var timeBetweenMarkers = durationInMinutes / markerCount;

        for (j = cadence; j < routePoints.length; j += cadence) {
            lat = routePoints[j].lat();
            lng = routePoints[j].lng();

            accruedTripTime += timeBetweenMarkers;
            getWeather(lat, lng, timeFormats, map, maps, infowindow, accruedTripTime);
        }
    }

    this.directionParams = function(origin, destination, maps, timeFormats) {
        return {
            origin: origin,
            destination: destination,
            travelMode: maps.TravelMode.DRIVING,
            optimizeWaypoints: true,
            drivingOptions: {
                departureTime: new Date(timeFormats['commonDate'] + ' ' + timeFormats['militaryTime'] + ':00:00'),
                trafficModel: maps.TrafficModel.PESSIMISTIC
            }
        }
    }

    this.getMarkers = function() {
        return currentMarkers;
    }

}
