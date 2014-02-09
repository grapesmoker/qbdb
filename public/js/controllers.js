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
  $scope.packets = packet.fromTournament({tid: $routeParams.tid});
}).
controller('viewQuestionsCtrl', function($scope, $routeParams, packet, tossup, bonus) {
  $scope.packet = packet.get({id: $routeParams.pid});
  $scope.tossups = tossup.fromPacket({pid: $routeParams.pid});
  $scope.bonuses = bonus.fromPacket({pid: $routeParams.pid});
  $scope.subjects = subjects;
}).
controller('uncategorizedCtrl', function($scope, tossup, bonus) {
  $scope.tossups = tossup.query({subject: 'Undefined', flagged: false});
  $scope.bonuses = bonus.query({subject: 'Undefined', flagged: false});
  $scope.subjects = subjects;
});
