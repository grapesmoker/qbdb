var qbdb = angular.module('qbdb', ['ngRoute']);

qbdb.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/welcome.html'
    })
    .when('/faq', {
      templateUrl: 'partials/faq.html'
    });

  $locationProvider.html5Mode(true);
});
