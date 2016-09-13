angular
    .module('app')
    .controller('HomeController', HomeController);

HomeController.$inject = ['$scope', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'MapsService', 'TimeService', 'WeatherService', 'week'];

function HomeController($scope, uiGmapGoogleMapApi, uiGmapIsReady, MapsService, TimeService, WeatherService, week) {
    var ctrl = this;
    ctrl.week = week;
    ctrl.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    ctrl.timePeriod = ['AM', 'PM']
    $scope.map = {center: {latitude: 37.09024, longitude: -95.712891}, zoom: 4, control: {}};

    //Instantiates a new Google Maps object.
    uiGmapGoogleMapApi.then(function(maps) {
        ctrl.maps = maps;
        ctrl.directionsDisplay = new ctrl.maps.DirectionsRenderer();
        ctrl.directionsService = new ctrl.maps.DirectionsService();
    });

    //Instantiates the directions map upon form submission.
    ctrl.directions = function() {
        //resets markers
        var currentMarkers = MapsService.getMarkers();
        for (var i = 0; i < currentMarkers.length; i++) {
          currentMarkers[i].setMap(null);
        }

        MapsService.clearMarkers();
        uiGmapIsReady.promise(1).then(function(instances) {
            ctrl.map = instances[0].map;
            ctrl.directionsDisplay.setMap(ctrl.map);
            ctrl.createDirections(ctrl.directionsService, ctrl.maps);
        });
    }

    //Calls Google Maps API and returns directions. ctrl.weatherPoint is the object that stores the markers.
    ctrl.createDirections = function(directionsService, maps) {
        var hour = TimeService.militaryTime(ctrl.hour, ctrl.period); //16
        var UTCDate = ctrl.week[ctrl.day]; //UTC date
        var date = TimeService.dateParser(UTCDate); //2016-7-10

        directionsService.route(MapsService.directionParams(ctrl.origin, ctrl.destination, maps, date, hour),
            function(response, status) {
                if (status == maps.DirectionsStatus.OK) {
                    ctrl.directionsDisplay.setDirections(response);

                    //a hash of all the markers for the route
                    var markers = MapsService.createMarkers(response, maps, ctrl.map);
                    var waypointTimes = TimeService.setWaypointTimes(response, markers, date, hour);
                    ctrl.markers = waypointTimes;
                }
            });
    }
}
