var qbdb = angular.module('qbdb', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'qbdb.controllers', 'qbdb.services', 'qbdb.directives', 'qbdb.filters']);

qbdb.config(function($routeProvider, $locationProvider, $sceProvider) {
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
    .when('/uncategorized', {
      templateUrl: 'partials/uncategorized.html',
      controller: 'uncategorizedCtrl'
    })
    .when('/makepacket', {
      templateUrl: 'partials/makepacket.html',
      controller: 'makepacketCtrl'
    });

  $locationProvider.html5Mode(true);
  $sceProvider.enabled(false);
});
