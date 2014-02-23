var subjects = [
  {
    header: 'Undefined',
    list: ['Undefined']
  }, {
    header: 'History',
    list: [
      'American History',
    'European History',
    'World History',
    'Ancient History',
    'Mixed History'
      ] 
  }, {
    header: 'Literature',
    list: [
      'American Literature',
    'British Literature',
    'European Literature',
    'World Literature',
    'Ancient Literature',
    'Mixed Literature'
      ] 
  }, {
    header: 'Science',
    list: [
      'Biology',
    'Chemistry',
    'Physics',
    'Mathematics',
    'Astronomy',
    'Earth Science',
    'Computer Science',
    'Other Science'
      ]
  }, {
    header: 'RMP',
    list: [
      'Religion',
    'Mythology',
    'Philosophy'
      ] 
  }, {
    header: 'Fine Arts',
    list: [
      'Classical Music',
    'Opera',
    'Other Music',
    'Paintings',
    'Sculpture',
    'Other Art'
      ]
  }, {
    header: 'Other',
    list: [
      'Anthropology',
    'Economics',
    'Psychology',
    'Other Social Science',
    'Geography',
    'Miscellaneous',
    'Current Events',
    'TRASH'
      ]
  }
];

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
  $scope.subjects = subjects;
}).
controller('makepacketCtrl', function($scope, tossup, bonus) {
  $scope.distribution = {
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
  $scope.tossups = tossup.makePacket($scope.distribution);
  $scope.bonuses = bonus.makePacket($scope.distribution);
  $scope.subjects = subjects;
});
