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
    this.getWeather = function(city, state) {
        return $http.get('https://crossorigin.me/http://api.wunderground.com/api/b924e5e377465063/hourly10day/q/'+state+'/'+city+'.json')
    }
}
