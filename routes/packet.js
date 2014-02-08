var Packet = require('../models/packets').Packet;

exports.createRoutes = function(root, app) {
  app.get(root + '/:id', function(req, res) {
    var packetId = req.params.id;
    Packet.findById(packetId).populate('tournament').exec(function(err, packet) {
      if(err || !packet) res.send(500, err);
      res.send(packet);
    });
  });

  app.get(root + '/tournament/:tid', function(req, res) {
    var tournamentId = req.params.tid;
    Packet.find({tournament: tournamentId}).populate('tournament').exec(function(err, packets) {
      if(err || !packets) res.send(500, err);
      res.send(packets);
    });
  });
}

