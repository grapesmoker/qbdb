var qbdb = angular.module('qbdb', ['ngRoute', 'qbdb.controllers', 'qbdb.services']);

qbdb.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/welcome.html'
    })
    .when('/faq', {
      templateUrl: 'partials/faq.html'
    })
    .when('/alltournaments', {
      templateUrl: 'partials/alltournaments.html',
      controller: 'allTournamentsCtrl'
    })
    .when('/viewtour/:tid', {
      templateUrl: 'partials/viewtour.html',
      controller: 'viewTournamentCtrl'
    })
    .when('/viewquestions/:pid', {
      templateUrl: 'partials/viewquestions.html',
      controller: 'viewQuestionsCtrl'
    })

  $locationProvider.html5Mode(true);
});
