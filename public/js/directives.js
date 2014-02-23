angular.module('qbdb.directives', []).
directive('tossupTable', function() {
  return {
    restrict: 'EA',
    scope: {
      tossups: '='
    },
    templateUrl: '/templates/tossup-table.html'
  }
}).
directive('bonusTable', function() {
  return {
    restrict: 'EA',
    scope: {
      bonuses: '='
    },
    templateUrl: '/templates/bonus-table.html'
  }
})
