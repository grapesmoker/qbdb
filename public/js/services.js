angular.module('qbdb.services', ['ngResource']).
  factory('tournament', function($resource) {
    var Tournament = $resource('/api/tournament/:id');
    return Tournament;
  }).
  factory('packet', function($resource) {
    var Packet = $resource('/api/packet/:id');
    return Packet;
  }).
  factory('tossup', function($resource) {
    var Tossup = $resource('/api/tossup', null, {
      'count': {
        method: 'GET',
        url: '/api/tossup/count',
      },
      'makePacket': {
        method: 'GET',
        url: '/api/tossup/makePacket',
        isArray: true
      }
    });
    return Tossup;
  }).
  factory('bonus', function($resource) {
    var Bonus = $resource('/api/bonus', null, {
      'count': {
        method: 'GET',
        url: '/api/bonus/count'
      },
      'makePacket': {
        method: 'GET',
        url: '/api/bonus/makePacket',
        isArray: true
      }
    });
    return Bonus;
  });
