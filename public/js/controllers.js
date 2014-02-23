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
controller('progressCtrl', function($scope, $q, tossup, bonus) {
  $scope.dyn= 50;
  var all = $q.all([tossup.count().$promise, bonus.count().$promise, 
    tossup.count({subject: 'Undefined', flagged: false}).$promise, bonus.count({subject: 'Undefined', flagged: false}).$promise])
    all.then(function(result) {
      var max = result[0].count + result[1].count;
      var value = max - (result[2].count + result[3].count);
      $scope.dyn= 100* (value / max);
    });
}).
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
controller('uncategorizedCtrl', function($scope, tossup, bonus) {
  $scope.tossups = tossup.query({subject: 'Undefined', flagged: false});
  $scope.bonuses = bonus.query({subject: 'Undefined', flagged: false});
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
