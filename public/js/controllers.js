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
