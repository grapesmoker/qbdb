var _ = require('lodash');
var db = require('../models')
  , Bonus = db.Bonus
  , Subject = db.Subject
  , Packet = db.Packet
  , Tournament = db.Tournament;

exports.count = function(req, res) {
}

exports.makePacket = function(req, res) {
  if(!req.query) res.send(400, new Error("No query!"));
  if(!req.query.distribution) res.send(400, new Error("No distribution!"));
  var distribution = req.query.distribution;
  delete req.query.distribution;
  var chainer = new db.Sequelize.Utils.QueryChainer;
  if(typeof distribution === "string") distribution = JSON.parse(distribution);
  Object.keys(distribution).forEach(function(subj) {
    var count = distribution[subj];
    chainer.add(Bonus.findAll({
      where: {
        'Subject.subject': subj
      },
      include: [
        {model: Subject},
        {model: Packet, include: [ Tournament ]}
      ],
      order: db.sequelize.fn('RANDOM'),
      limit: count
    }));
  });
  chainer.run().success(function(results) {
    res.send(_.shuffle(_.flatten(results)));
  }).error(function(err) {
    res.send(500, err);
  });
}
