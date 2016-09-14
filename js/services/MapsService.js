angular
    .module('app')
    .service('MapsService', MapsService);

MapsService.$inject = ['TimeService', 'WeatherService'];

function MapsService(TimeService, WeatherService) {
    var currentMarkers = [];

    function newMarker(lat, lng, map, maps, forecast, infowindow) {
        var weatherIcon = judgeForecast(forecast);
        var icon = {url: weatherIcon, scaledSize: new maps.Size(35, 45)};
        var newMarker = new maps.Marker({position: {lat, lng}, map: map, icon: icon});
        newMarker.addListener('click', function() {
            infowindow.setOptions({content: forecast['summary']});
            infowindow.open(map, newMarker);
        });
        currentMarkers.push(newMarker);
    }

    this.createMarkers = function(response, maps, map, timeFormats) {
        var markers;
        var infowindow = new maps.InfoWindow();
        var distanceInMeters = response['routes'][0]['legs'][0]['distance']['value'];
        var distanceInMiles = toMiles(distanceInMeters);
        var routePoints = response['routes'][0]['overview_path'];
        var cadence = getCadence(distanceInMiles);

        for (j = cadence; j < routePoints.length; j += cadence) {
            lat = routePoints[j].lat();
            lng = routePoints[j].lng();
            getWeather(lat, lng, timeFormats, map, maps, infowindow);
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

    function getWeather(lat, lng, timeFormats, map, maps, infowindow) {
        var forecast;

        WeatherService.getWeather(lat, lng)
          .then(function(data) {
            if(timeFormats['dayOfWeek'] === 'Today') {
                forecast = data['data']['hourly']['data'][hoursIntoFutureFromToday(timeFormats)];
                newMarker(lat, lng, map, maps, forecast, infowindow)
            } else if(timeFormats['dayOfWeek'] === 'Tomorrow') {
                forecast = data['data']['hourly']['data'][hoursIntoFutureFromTomorrow(timeFormats)];
                newMarker(lat, lng, map, maps, forecast, infowindow)
            } else {
                forecast = data['data']['daily']['data'][timeFormats['dayInt']];
                newMarker(lat, lng, map, maps, forecast, infowindow)
            }
        });
    }

    function judgeForecast(forecast) {
        if(forecast['summary'] === 'Thunderstorm') {
            return 'images/redmarker.png';
        } else {
            return 'images/greenmarker.png';
        }
    }

    function toMiles(meters) {
        return Math.floor(meters/1609);
    }

    function getCadence(miles) {
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

    function hoursIntoFutureFromToday(timeFormats) {
        var currentHour = new Date(Date.now()).getHours();
        return (timeFormats['militaryTime'] - currentHour)-1;
    }

    function hoursIntoFutureFromTomorrow(timeFormats) {
        var currentHour = new Date(Date.now()).getHours();
        return ((timeFormats['militaryTime'] + 24) - currentHour)-1;
    }

}
