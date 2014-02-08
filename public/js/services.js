angular.module('qbdb.services', ['ngResource']).
  factory('tournament', function($resource) {
    var Tournament = $resource('/api/tournament');
    return Tournament;
  }).
  factory('packet', function($resource) {
    var Packet = $resource('/api/packet', null, {
      'withTournament': {
        method: 'GET',
        url: '/api/packet/tournament/:tid',
        isArray: true
      }
    });
    return Packet;
  });
