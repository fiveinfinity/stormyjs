angular
    .module('app')
    .service('WeatherService', WeatherService);

WeatherService.$inject = ['$http'];

function WeatherService($http) {
    this.geoLookup = function(lat, lng, maps) {
        // var city, state
            // USING CORS.IO TO CIRCUMVENT CORS. NEED TO SET UP A PROXY. HEADERS NOT WORKING WITH WUNDERGROUND.
            return $http.get('https://crossorigin.me/http://api.wunderground.com/api/b924e5e377465063/geolookup/q/'+lat+','+lng+'.json');
            // .then(function(data) {
            //   city = data['data']['location']['city'];
            //   state = data['data']['location']['state'];
            //   return data;
            // });


        // GOOGLE MAPS REVERSE GEO LOOKUP
        // var geocoder = new maps.Geocoder();
        // var latlng = new maps.LatLng(lat, lng);
        // geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        //     console.log(results);
        // });
    }

    this.getWeather = function(city, state) {
        return $http.get('https://crossorigin.me/http://api.wunderground.com/api/b924e5e377465063/hourly10day/q/'+state+'/'+city+'.json')
    }
}
