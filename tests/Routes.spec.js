// describe('Routes', function() {
//   var $state;
//
//   beforeEach(module('app'));
//   beforeEach(inject(function($injector) {
//     $state = $injector.get('$state');
//   }));
//
//   describe('Home', function() {
//     var state;
//
//     it('should have the correct template', function() {
//       state = $state.get('home');
//       expect(state.templateUrl).toEqual('./js/views/home.html');
//     });
//
//     it('should use the correct Controller', function() {
//       expect(state.controller).toEqual('HomeController as ctrl');
//     });
//
//     it('should have the correct URL', function() {
//       expect(state.url).toEqual('/');
//     });
//   });
//
//   describe('Profiles', function() {
//     var state;
//
//     it('should have the correct template', function() {
//       state = $state.get('home.profile');
//       expect(state.views['profile@home'].templateUrl).toEqual('./js/views/profile.html');
//     });
//
//     it('should use the correct Controller', function() {
//       expect(state.views['profile@home'].controller).toEqual('ProfileController as ctrl');
//     });
//
//     it('should have the correct URL', function() {
//       expect(state.url).toEqual('profile/:id');
//     });
//   });
// });
//
// describe('DateService', function() {
//   beforeEach(module('app'));
//   var DateService;
//
//   beforeEach(inject(function($injector) {
//     DateService = $injector.get('DateService');
//   }));
//
//   it('should should return month names', function() {
//     var parsedDate = DateService.parseDate({data:{login: "nmuth", created_at: "2013-08-24T05:53:36Z"}});
//     expect(parsedDate).toEqual('August 24, 2013');
//   });
// });
//
// describe('GithubService', function() {
//   beforeEach(module('app'));
//   var GitHubService, $httpBackend;
//
//   beforeEach(inject(function($injector) {
//     GithubService = $injector.get('GithubService');
//     $httpBackend = $injector.get('$httpBackend');
//
//     $httpBackend.when('GET', 'https://api.github.com/orgs/code42/members')
//       .respond({login: 'fiveinfinity', repos: '300'});
//     $httpBackend.when('GET', 'https://api.github.com/users/3/repos')
//       .respond({login: 'fiveinfinity', repos: 'Code42-Github'});
//     $httpBackend.when('GET', 'https://api.github.com/users/3')
//       .respond({profile: 'fiveinfinity'});
//     $httpBackend.when('GET', 'https://api.github.com/users/3/orgs')
//       .respond({orgs: 'Code42'});
//     $httpBackend.when('GET', 'https://api.github.com/repos/3/code42/stats/commit_activity')
//       .respond({stats: '100 commits!'});
//   }));
//
//   it('should get the members of Code42', function() {
//     $httpBackend.expectGET('https://api.github.com/orgs/code42/members');
//
//     GithubService.getCode42Members().then(function(response) {
//       expect(response.data.login).toEqual('fiveinfinity');
//       expect(response.data.repos).toEqual('300');
//     });
//   });
//
//   it('should get members repos', function() {
//     $httpBackend.expectGET('https://api.github.com/users/3/repos');
//
//     GithubService.getRepos().then(function(response) {
//       expect(response.data.repos).toEqual('Code42-Github');
//     });
//   });
//
//   it('should get members profile', function() {
//     $httpBackend.expectGET('https://api.github.com/users/3');
//
//     GithubService.getRepos().then(function(response) {
//       expect(response.data.profile).toEqual('fiveinfinity');
//     });
//   });
//
//   it('should get members profile organizations', function() {
//     $httpBackend.expectGET('https://api.github.com/users/3/orgs');
//
//     GithubService.getRepos().then(function(response) {
//       expect(response.data.orgs).toEqual('Code42');
//     });
//   });
//
//   it('should get members stats', function() {
//     $httpBackend.expectGET('https://api.github.com/repos/3/code42/stats/commit_activity');
//
//     GithubService.getRepos().then(function(response) {
//       expect(response.data.stats).toEqual('100 commits!');
//     });
//   });
// });
