angular
    .module('app')
    .service('MapsService', MapsService);

MapsService.$inject = ['TimeService', 'WeatherService'];

function MapsService(TimeService, WeatherService) {
    var currentMarkers = [];

    this.directionParams = function(origin, destination, maps, date, hour) {
        return {
            origin: origin,
            destination: destination,
            travelMode: maps.TravelMode.DRIVING,
            optimizeWaypoints: true,
            drivingOptions: {
                departureTime: new Date(date + ' ' + hour + ':00:00'),
                trafficModel: maps.TrafficModel.PESSIMISTIC
            }
        }
    }

    function newMarker(lat, lng, map, maps, markers) {
        var icon = {
            url: 'images/greenmarker.png',
            scaledSize: new maps.Size(35, 45)
        };

        var weather = markers[0][5];

        var infowindow = new maps.InfoWindow({
          content: weather
        });

        var newMarker = new maps.Marker({
            position: { lat, lng },
            map: map,
            icon: icon
        });
        newMarker.addListener('click', function() {
            infowindow.open(map, newMarker);
        })
        currentMarkers.push(newMarker);
        return newMarker;
    }

    this.getMarkers = function() {
        return currentMarkers;
    }

    this.clearMarkers = function() {
        currentMarkers = [];
    }

    //creates markers based on overview_path waypoints in the Google Maps Directions response.
    this.createMarkers = function(response, maps, map) {
        var markers = {};
        var distanceInMeters = response['routes'][0]['legs'][0]['distance']['value'];
        var distanceInMiles = toMiles(distanceInMeters);
        var routePoints = response['routes'][0]['overview_path'];
        var cadence = getCadence(distanceInMiles);

        var i = 0;
        for (j = cadence; j < routePoints.length; j += cadence) {
            var lat = routePoints[j].lat();
            var lng = routePoints[j].lng();

            // var geo = WeatherService.geoLookup(lat, lng, maps);
            // var marker = newMarker(lat, lng, map, maps);
            //add 'geo' and 'marker' to the array below when app is ready.
            markers[i] = [lat, lng];
            i++;
        }
        //the next lines to the return are for testing to keep API calls to a min, use the commented line for app.
        var geo = WeatherService.geoLookup(markers[0][0], markers[0][1], maps);
        geo.then(function(data) {
            var city = data['data']['location']['city'];
            var state = data['data']['location']['state'];
            markers[0].push(city);
            markers[0].push(state);
            var weather = WeatherService.getWeather(city, state);
            weather.then(function(data) {
                markers[0].push(data['data']['hourly_forecast'][0]['condition']);
                var marker = newMarker(markers[0][0], markers[0][1], map, maps, markers)
            });
        });
        return markers;
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

}
