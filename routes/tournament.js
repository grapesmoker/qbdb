var Tournament = require('../models/tournaments').Tournament;
var Packet = require('../models/packets').Packet;

exports.createRoutes = function(root, app) {
  app.get(root, function(req, res) {
    Tournament.find(function(err, tournaments) {
      if(err || !tournaments ) res.send(500, err);
      res.send(tournaments);
    });
  });

  app.get(root + '/:id', function(req, res) {
    var id = req.params.id;
    Tournament.findById(id, function(err, tournament) {
      if(err || !tournament ) res.send(500, err);
      res.send(tournament);
    });
  });

  app.delete(root + '/:id', function(req, res) {
    Tournament.findByIdAndRemove(req.params.id, function(err, tournament) {
      if(err || !tournament ) res.send(500, err);
      res.send(tournament);
    });
  });
}

