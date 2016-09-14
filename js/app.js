angular
    .module('app', ['ui.router', 'uiGmapgoogle-maps', 'ui.bootstrap'])
    .config(function($stateProvider) {
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
    });
