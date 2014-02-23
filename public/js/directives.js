angular.module('qbdb.directives', []).
directive('tossupTable', function() {
  return {
    restrict: 'EA',
    scope: {
      tossups: '='
    },
    templateUrl: '/templates/tossup.html'
  }
});
