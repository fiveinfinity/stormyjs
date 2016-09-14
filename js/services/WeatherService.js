angular
    .module('app')
    .service('WeatherService', WeatherService);

WeatherService.$inject = ['$http'];

function WeatherService($http) {
    this.getWeather = function(lat, lng) {
        return $http.get('https://crossorigin.me/https://api.forecast.io/forecast/a56904ad029a4da12a16be1a4dc68cbe/'+ lat +','+ lng +'?UNITS=us')
    }
}
