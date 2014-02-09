var Bonus = require('../models/bonuses').Bonus;

exports.createRoutes = function(root, app) {
  app.get(root, function(req, res) {
    if(!req.query.id) {
      var limit = req.query.limit || 50;
      var skip = req.query.skip || 0;
      delete req.query.limit;
      delete req.query.skip;
      Bonus.find(req.query, null, {limit: limit, skip: skip}, function(err, bonuses) {
        if(err) res.send(500, err);
        res.send(bonuses);
      });
    } else {
      var id = req.query.id;
      Bonus.findById(id, function(err, bonus) {
        if(err) res.send(500, err);
        res.send(bonus);
      });
    }
  });

  app.get(root + '/packet/:pid', function(req, res) {
    var packetId = req.params.pid;
    Bonus.find({packet: packetId}, function(err, bonuses) {
      if(err) res.send(500, err);
      res.send(bonuses);
    });
  });

  app.post(root, function(req, res) {
    var bonusId = req.body._id;
    delete req.body._id;
    Bonus.findByIdAndUpdate(bonusId, req.body, function(err, bonus) {
      if(err) res.send(500, err);
      res.send(bonus);
    });
  });
};
