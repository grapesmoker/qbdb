angular.module('qbdb.filters', []).
filter('value', function() {
  return function(input) {
    return '[10] ' + input;
  }
}).
filter('answer', function() {
  return function(input) {
    return 'ANSWER: ' + input;
  }
});
