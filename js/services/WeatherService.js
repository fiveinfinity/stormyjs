angular
    .module('app')
    .service('WeatherService', WeatherService);

WeatherService.$inject = ['$http'];

function WeatherService($http) {
    //DEPRECATE THIS
    this.geoLookup = function(lat, lng, maps) {
        return $http.get('https://crossorigin.me/http://api.wunderground.com/api/b924e5e377465063/geolookup/q/'+lat+','+lng+'.json');
    }

    //SWITCH TO DARK SKY
    this.getWeather = function(lat, lng) {
        return $http.get('https://crossorigin.me/https://api.forecast.io/forecast/a56904ad029a4da12a16be1a4dc68cbe/'+ lat +','+ lng +'?UNITS=us')
    }
}
