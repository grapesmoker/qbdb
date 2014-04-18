var Packet = require('../models/Packet').model
  , Packets = require('../models/Packet').collection;

exports.list = function(req, res) {
  new Packets().query().where(req.query).select().then(function(collection) {
    res.send(collection);
  }, function(err) {
    res.send(500, {error: err});  
  });
}

exports.get = function(req, res) {
  var pid = req.params.id;
  new Packet({
    id: pid
  }).fetch().then(function(pack) {
    if(pack == undefined)
      res.send(404, {error: 'Packet not found'});
    else
      res.send(200, pack);
  }, function(err) {
    res.send(500, {error: err});  
  });
}
