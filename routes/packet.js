var Packet = require('../models/packets').Packet;

exports.createRoutes = function(root, app) {
  app.get(root, function(req, res) {
    var packetId = req.query.id;
    if(!packetId) {
      Packet.find(function(err, packets) {
        if(err) res.send(500, err);
        res.send(packets);
      });
    } else {
      Packet.findById(packetId).populate('tournament').exec(function(err, packet) {
        if(err) res.send(500, err);
        res.send(packet);
      });
    }
  });

  app.get(root + '/tournament/:tid', function(req, res) {
    var tournamentId = req.params.tid;
    Packet.find({tournament: tournamentId}, function(err, packets) {
      if(err) res.send(500, err);
      res.send(packets);
    });
  });
}

