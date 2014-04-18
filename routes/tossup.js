var Tossup = require('../models/Tossup').model
  , Tossups = require('../models/Tossup').collection;

exports.list = function(req, res) {
  new Tossups().query('where', req.query).fetch({
    withRelated: ['subject', 'packet', 'packet.tournament']
  }).then(function(collection) {
    res.send(collection.toJSON());
  }, function(err) {
    res.send(500, {error: err});  
  });
}

exports.get = function(req, res) {
  var tid = req.params.id;
  new Tossup({
    id: tid
  }).fetch().then(function(tup) {
    if(tup == undefined)
      res.send(404, {error: 'Tossup not found'});
    else
      res.send(200, tup);
  }, function(err) {
    res.send(500, {error: err});  
  });
}

