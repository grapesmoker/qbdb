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
  var Tossup = $resource('/api/tossup/:id', {id: '@id'}, {
    'makePacket' : {
      method: 'GET',
      url: '/api/tossup/makePacket',
      isArray: true
    },
    'search' : {
      method: 'GET',
      url: '/api/tossup/search',
      isArray: true
    }
  });
  return Tossup;
}).

factory('bonus', function($resource) {
  var Bonus = $resource('/api/bonus/:id', null, {
    'makePacket': {
      method: 'GET',
      url: '/api/bonus/makePacket',
      isArray: true
    },
    'search' : {
      method: 'GET',
      url: '/api/bonus/search',
      isArray: true
    }
  });
  return Bonus;
});

