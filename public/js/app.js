var qbdb = angular.module('qbdb', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'qbdb.controllers', 'qbdb.services', 'qbdb.directives', 'qbdb.filters'])
.run(function($rootScope, $http) {
  $http.get('/api/subjects').success(function(data) {
    $rootScope.subjects = {};
    data.forEach(function(e) {
      $rootScope.subjects[e.id] = e.subject;
    });
  });
});

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
    /*
    .when('/search', {
      templateUrl: 'partials/search.html',
      controller: 'searchCtrl'
    })
    */
    .when('/makepacket', {
      templateUrl: 'partials/makepacket.html',
      controller: 'makepacketCtrl'
    });

  $locationProvider.html5Mode(true);
  $sceProvider.enabled(false);
});
