angular.module('qbdb.services', ['ngResource']).
  factory('tournament', function($resource) {
    var Tournament = $resource('/api/tournament');
    return Tournament;
  }).
  factory('packet', function($resource) {
    var Packet = $resource('/api/packet', null, {
      'fromTournament': {
        method: 'GET',
        url: '/api/packet/tournament/:tid',
        isArray: true
      }
    });
    return Packet;
  }).
  factory('tossup', function($resource) {
    var Tossup = $resource('/api/tossup', null, {
      'fromPacket': {
        method: 'GET',
        url: '/api/tossup/packet/:pid',
        isArray: true
      }
    });
    return Tossup;
  }).
  factory('bonus', function($resource) {
    var Bonus = $resource('/api/bonus', null, {
      'fromPacket': {
        method: 'GET',
        url: '/api/bonus/packet/:pid',
        isArray: true
      }
    });
    return Bonus;
  });
