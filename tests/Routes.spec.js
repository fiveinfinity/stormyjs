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

describe('TimeService', function() {
  beforeEach(module('app'));
  var today = new Date(Date.now());
  var TimeService;

  beforeEach(inject(function($injector) {
    TimeService = $injector.get('TimeService');
  }));

  it('should return the next seven days', function() {
    if (TimeService.nextSevenDays()['Today'][0] === today) {
      done();
    }
  });

  it('should return different time formats', function() {
    expect(TimeService.allTimeFormats(2, 'PM', {'Today': [today, 0]}, 'Today')['militaryTime'])
      .toEqual(14);
  });

  it('should return the correct additional hours to be added to the trip', function() {
    expect(TimeService.getAccruedTripHours(240)).toEqual(4);
  });
});

describe('MapsService', function() {
  beforeEach(module('app'));
  var MapsService;

  beforeEach(inject(function($injector) {
    MapsService = $injector.get('MapsService');
  }));

  it('should return the direction parameters for Google Maps API directions', function() {
    expect(MapsService.directionParams('Minneapolis', 'Barbados',
      {'TravelMode': {'DRIVING': 'driving, duh'}, 'TrafficModel': {'PESSIMISTIC': 'not looking good...'}},
      'formattedTimes')['destination']).toEqual('Barbados');
  });
});
