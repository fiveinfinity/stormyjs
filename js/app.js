angular
    .module('app', ['ui.router', 'uiGmapgoogle-maps', 'ui.bootstrap'])
    .config(function($stateProvider, uiGmapGoogleMapApiProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: './js/views/home.html',
                controller: 'HomeController as home',
                resolve: {
                    week: function(TimeService) {
                        return TimeService.nextSevenDays();
                    }
                }
            });
        uiGmapGoogleMapApiProvider.configure({
            // key: 'AIzaSyDoHFpligHoNQ_2WZudFcGJqBVbWBWFqns',
            v: '3.exp',
            libraries: 'geometry, visualization, places'
        });
    });
