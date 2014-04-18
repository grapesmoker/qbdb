angular.module('qbdb.controllers', ['ngSanitize', 'qbdb.services']).
controller('allTournamentsCtrl', function($scope, tournament) {
  $scope.tournaments = tournament.query();
  $scope.predicate = 'year';
}).
controller('viewTournamentCtrl', function($scope, $routeParams, tournament, packet) {
  $scope.tournament = tournament.get({id: $routeParams.tid});
  $scope.packets = packet.query({TournamentId: $routeParams.tid});
}).
controller('viewQuestionsCtrl', function($scope, $routeParams, tournament, packet, tossup, bonus) {
  $scope.packet = packet.get({id: $routeParams.pid});
  $scope.packet.$promise.then(function(res) { $scope.tournament = tournament.get({id: res.TournamentId }) });
  $scope.tossups = tossup.query({PacketId: $routeParams.pid});
  $scope.bonuses = bonus.query({PacketId: $routeParams.pid});
}).
controller('searchCtrl', function($scope, tossup, bonus) {
  $scope.tossups = [];
  $scope.bonuses = [];
  $scope.search = function() {
    $scope.tossups = tossup.search({q: $scope.q});
    $scope.bonuses = bonus.search({q: $scope.q});
  }
}).
controller('makepacketCtrl', function($scope, tossup, bonus) {
  $scope.q = {
    minDiff: 1,
    maxDiff: 9,
    power: false,
    distribution: {
      'American History': 1,
      'European History': 2,
      'World History': 1,
      'Ancient History': 1,

      'American Literature': 1,
      'British Literature': 1,
      'European Literature': 2,
      'World Literature': 1,

      'Biology': 1,
      'Chemistry': 1,
      'Physics': 1,
      'Mathematics': 1,
      'Astronomy': 1,

      'Religion': 1,
      'Mythology': 1,
      'Philosophy': 1,

      'Classical Music': 1,
      'Paintings': 1,
      'Other Art': 1,

      'Psychology': 1,
      'Geography': 1,
      'TRASH': 1,
    }
  }
  $scope.showPacket = function() {
    $scope.tossups = tossup.makePacket($scope.q);
    $scope.bonuses = bonus.makePacket($scope.q);
  }
});
