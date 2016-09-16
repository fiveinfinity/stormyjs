angular
    .module('app', ['ui.router', 'uiGmapgoogle-maps', 'ui.bootstrap'])
    .config(function($stateProvider, $locationProvider) {
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
        $locationProvider.html5Mode(true);
    });
