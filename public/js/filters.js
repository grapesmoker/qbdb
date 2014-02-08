angular.module('qbdb.filters', []).
  filter('answer', function() {
    return function(input) {
      return 'ANSWER: ' + input;
    }
  });
