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
    distribution: [
      [ 'American History' ],
      [ 'European History' ],
      [ 'World History' ],
      [ 'Ancient History', 'Mixed History' ],

      [ 'American Literature' ],
      [ 'British Literature' ],
      [ 'European Literature', 'Ancient Literature' ],
      [ 'World Literature', 'Mixed Literature' ],

      [ 'Biology' ],
      [ 'Chemistry' ],
      [ 'Physics' ],
      [ 'Astronomy', 'Earth Science', 'Mathematics', 'Computer Science', 'Other Science' ],

      [ 'Religion' ],
      [ 'Mythology' ],
      [ 'Philosophy' ],

      [ 'Classical Music', 'Opera' ],
      [ 'Paintings', 'Sculpture' ],
      [ 'Other Music', 'Other Art' ],

      [ 'Anthropology', 'Economics', 'Psychology', 'Other Social Science' ], //social science
      [ 'Geography' ],
      [ 'Miscellaneous', 'TRASH' ]
    ]
  }
  $scope.showPacket = function() {
    $scope.tossups = tossup.makePacket($scope.q);
    $scope.bonuses = bonus.makePacket($scope.q);
  }
});
