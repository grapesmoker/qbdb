angular.module('qbdb.controllers', ['qbdb.services']).
  controller('allTournamentsCtrl', function($scope, tournament) {
    $scope.tournaments = tournament.query();
  }).
  controller('viewTournamentCtrl', function($scope, $routeParams, packet) {
    $scope.packets = packet.withTournament({tid: $routeParams.tid});
  }).
  controller('viewQuestionsCtrl', function($scope) {
  });
