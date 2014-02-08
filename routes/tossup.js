var Tossup = require('../models/tossups').Tossup;

exports.createRoutes = function(root, app) {
  app.get(root, function(req, res) {
    if(!req.query.id) {
      Tossup.find(function(err, tossups) {
        if(err) res.send(500, err);
        res.send(tossups);
      });
    } else {
      var id = req.query.id;
      Tossup.findById(id, function(err, tossup) {
        if(err) res.send(500, err);
        res.send(tossup);
      });
    }
  });

  app.get(root + '/packet/:pid', function(req, res) {
    var packetId = req.params.pid;
    Tossup.find({packet: packetId}, function(err, tossups) {
      if(err) res.send(500, err);
      res.send(tossups);
    });
  });

  app.post(root, function(req, res) {
    var tossupId = req.body._id;
    delete req.body._id;
    Tossup.findByIdAndUpdate(tossupId, req.body, function(err, tossup) {
      if(err) res.send(500, err);
      res.send(tossup);
    });
  });
};
