var Tournament = require('../models/Tournament').model
  , Tournaments = require('../models/Tournament').collection;

exports.list = function(req, res) {
  new Tournaments().fetch().then(function(collection) {
    res.send(collection.toJSON());
  }, function(err) {
    res.send(500, {error: err});  
  });
}

exports.get = function(req, res) {
  var tid = req.params.id;
  new Tournament({
    id: tid
  }).fetch().then(function(tourn) {
    console.log(tourn);
    if(tourn == undefined)
      res.send(404, {error: 'Tournament not found'});
    else
      res.send(200, tourn);
  }, function(err) {
    res.send(500, {error: err});  
  });
}
