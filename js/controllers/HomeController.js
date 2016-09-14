angular
    .module('app')
    .controller('HomeController', HomeController);

HomeController.$inject = ['$scope', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'MapsService', 'TimeService', 'WeatherService', 'week'];

function HomeController($scope, uiGmapGoogleMapApi, uiGmapIsReady, MapsService, TimeService, WeatherService, week) {
    var ctrl = this;
    var dayGreeting = 'What Day are you leaving?';
    var hourGreeting = '...and what time?';
    var periodGreeting = 'Morning or Evening?';
    ctrl.week = week;
    ctrl.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    ctrl.timePeriod = ['AM', 'PM']
    ctrl.day = dayGreeting;
    ctrl.hour = hourGreeting;
    ctrl.period = periodGreeting;
    ctrl.dayClick = function() {
        if(ctrl.day != dayGreeting) {
            ctrl.dayCSS = 'go';
        }
    }

    ctrl.hourClick = function() {
        if(ctrl.hour != hourGreeting) {
            ctrl.hourCSS = 'go';
        }
    }

    ctrl.periodClick = function() {
        if(ctrl.period != periodGreeting) {
            ctrl.periodCSS = 'go';
        }
    }

    ctrl.submitClick = function() {
        if(ctrl.day == dayGreeting || ctrl.hour == hourGreeting || ctrl.period == periodGreeting || ctrl.origin == undefined || ctrl.destination == undefined) {
            ctrl.well = 'well';
            ctrl.alert = 'alert';
            ctrl.alertMessage = "We aren't mind readers over here. Make all the boxes turn green!"
        } else {
            ctrl.well = undefined;
            ctrl.alert = undefined;
            ctrl.alertMessage = undefined;
            ctrl.submitCSS = 'go';
        }
    }

    $scope.map = {center: {latitude: 37.09024, longitude: -95.712891}, zoom: 4, control: {}};

    //Instantiates a new Google Maps object.
    uiGmapGoogleMapApi.then(function(maps) {
        ctrl.maps = maps;
        ctrl.directionsDisplay = new ctrl.maps.DirectionsRenderer();
        ctrl.directionsService = new ctrl.maps.DirectionsService();
    });

    //Instantiates the directions map upon form submission.
    ctrl.directions = function() {
        resetMarkers();

        uiGmapIsReady.promise(1).then(function(instances) {
            ctrl.map = instances[0].map;
            ctrl.directionsDisplay.setMap(ctrl.map);
            ctrl.createDirections(ctrl.directionsService, ctrl.maps);
        });
    }

    //Calls Google Maps API and returns directions. ctrl.weatherPoint is the object that stores the markers.
    ctrl.createDirections = function(directionsService, maps) {
        //returns a hash with UTC time, common date, military time, and unix time.
        var timeFormats = TimeService.allTimeFormats(ctrl.hour, ctrl.period, ctrl.week, ctrl.day);
        var infoWindow;

        directionsService.route(MapsService.directionParams(ctrl.origin, ctrl.destination, maps, timeFormats),
            function(response, status) {
                if (status == maps.DirectionsStatus.OK) {
                    ctrl.directionsDisplay.setDirections(response);
                    MapsService.createMarkers(response, maps, ctrl.map, timeFormats);
                    // TimeService.setWaypointTimes(response, markers, date, hour);
                    // ctrl.markers = waypointTimes;

                }
            });
    }

    var resetMarkers = function() {
        var currentMarkers = MapsService.getMarkers();
        for (var i = 0; i < currentMarkers.length; i++) {
          currentMarkers[i].setMap(null);
        }
    }

    this.status = {
        isopen1: false,
        isopen2: false,
        isopen3: false
    }
}
