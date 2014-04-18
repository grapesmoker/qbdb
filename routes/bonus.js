var Bonus = require('../models/Bonus').model
  , Bonuses = require('../models/Bonus').collection;

exports.list = function(req, res) {
  new Bonuses().query('where', req.query).fetch({
    withRelated: ['subject', 'packet', 'packet.tournament']
  }).then(function(collection) {
    res.send(collection.toJSON());
  }, function(err) {
    res.send(500, {error: err});  
  });
}

exports.get = function(req, res) {
  var bid = req.params.id;
  new Bonus({
    id: bid
  }).fetch().then(function(bon) {
    if(tup == undefined)
      res.send(404, {error: 'Bonus not found'});
    else
      res.send(200, bon);
  }, function(err) {
    res.send(500, {error: err});  
  });
}

