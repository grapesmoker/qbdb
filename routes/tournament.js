var Tournament = require('../models/tournaments').Tournament;

exports.createRoutes = function(root, app) {
  app.get(root, function(req, res) {
    if(!req.query.id) {
      Tournament.find(function(err, tournaments) {
        if(err) res.send(500, err);
        res.send(tournaments);
      });
    } else {
      var id = req.query.id;
      Tournament.findById(id, function(err, tournament) {
        if(err) res.send(500, err);
        res.send(tournament);
      });
    }
  });

  app.delete(root + '/:id', function(req, res) {
    Tournament.findByIdAndRemove(req.params.id, function(err, tournament) {
      if(err) res.send(500, err);
      res.send(tournament);
    });
  });

  app.post(root, function(req, res) {
    var tournamentId = req.body._id;
    delete req.body._id;
    Tournament.findByIdAndUpdate(tournamentId, req.body, function(err, tournament) {
      if(err) res.send(500, err);
      res.send(tournament);
    });
  });

}

