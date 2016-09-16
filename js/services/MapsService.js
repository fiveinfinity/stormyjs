angular
    .module('app')
    .service('MapsService', MapsService);

MapsService.$inject = ['TimeService', 'WeatherService'];

function MapsService(TimeService, WeatherService) {
    var currentMarkers = [];

    function newMarker(lat, lng, map, maps, forecast, infowindow) {
        var markerContent = getForecastContent(forecast);
        var weatherIcon = judgeForecast(forecast);
        var icon = {url: weatherIcon, scaledSize: new maps.Size(35, 35)};
        var newMarker = new maps.Marker({position: {lat, lng}, map: map, icon: icon});
        newMarker.addListener('click', function() {
            infowindow.setOptions({content: markerContent});
            infowindow.open(map, newMarker);
        });
        currentMarkers.push(newMarker);
    }

    function getWeather(lat, lng, timeFormats, map, maps, infowindow, accruedTripTime) {
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

    function judgeForecast(forecast) {
        switch (forecast['summary']) {
            case 'Cloudy':
                return 'images/cloudy.png';
            case 'Partly Cloudy':
                return 'images/partlycloudy.png';
            case 'Mostly Cloudy':
                return 'images/partlycloudy.png';
            case 'Clear':
                return 'images/sunny.png';
            case 'Sunny':
                return 'images/sunny.png';
            case 'Light Rain':
                return 'images/lightrain.png';
            case 'Mix':
                return 'images/mix.png';
            case 'Severe':
                return 'images/severe.png';
            case 'Snow':
                return 'images/snow.png';
            case 'Thunderstorm':
                return 'images/thunderstorm.png';
        }
    }

    function getForecastContent(forecast) {
        var content = '';
        content += 'Summary: ' + forecast['summary'] + '<br>';
        content += 'Temperature: ' + Math.floor(forecast['temperature']) + ' &#8457<br>';
        content += 'Wind Speed: ' + forecast['windSpeed'] + ' MPH<br>';
        content += 'Humidity: ' + forecast['humidity'] * 100 + ' %';
        return content;
    }

    function toMiles(meters) {
        return Math.floor(meters/1609);
    }

    function getCadence(miles) {
        if(miles < 100) {
            return 90;
        } else if(miles > 100 && miles < 500) {
            return 60;
        } else if(miles > 500 && miles < 1500){
            return 30;
        } else {
            return 20;
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
