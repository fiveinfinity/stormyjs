describe('Routes', function() {
  var $state;

  beforeEach(module('app'));
  beforeEach(inject(function($injector) {
    $state = $injector.get('$state');
  }));

  describe('Home', function() {
    var state;

    it('should have the correct template', function() {
      state = $state.get('home');
      expect(state.templateUrl).toEqual('./js/views/home.html');
    });

    it('should use the correct Controller', function() {
      expect(state.controller).toEqual('HomeController as home');
    });

    it('should have the correct URL', function() {
      expect(state.url).toEqual('/');
    });
  });
});

describe('WeatherService', function() {
  beforeEach(module('app'));
  var WeatherService;

  beforeEach(inject(function($injector) {
    WeatherService = $injector.get('WeatherService');
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.when('GET', 'https://crossorigin.me/https://api.forecast.io/forecast/a56904ad029a4da12a16be1a4dc68cbe/41.111,42.222?UNITS=us')
      .respond({weather: 'Super Cloudy'});
  }));

  it('should return the weather from Dark Sky', function() {
    $httpBackend.expectGET('https://crossorigin.me/https://api.forecast.io/forecast/a56904ad029a4da12a16be1a4dc68cbe/41.111,42.222?UNITS=us');

    WeatherService.getWeather().then(function(response) {
      expect(response.data.weather).toEqual('Super Cloudy');
    });
  });
});
