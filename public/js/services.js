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
      url: '/api/makePacket/tossup',
      isArray: true
    },
    'search' : {
      method: 'GET',
      url: '/api/search/tossup',
      isArray: true
    }
  });
  return Tossup;
}).

factory('bonus', function($resource) {
  var Bonus = $resource('/api/bonus/:id', null, {
    'makePacket': {
      method: 'GET',
      url: '/api/makePacket/bonus',
      isArray: true
    }
  });
  return Bonus;
});

