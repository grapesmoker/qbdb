var _ = require('lodash');
var db = require('../models')
  , Tossup = db.Tossup
  , Subject = db.Subject
  , Packet = db.Packet
  , Tournament = db.Tournament;

exports.read = function(req, res) {
  var id = req.params.id;
  Tossup.find(id).success(function(tossup) {
    res.json(tossup);
  }).error(function(err) {
    res.send(500, err);
  });
}

exports.list = function(req, res) {
  var limit = req.query.limit || 100;
  var offset = req.query.offset || 0;
  delete req.query.limit;
  delete req.query.offset;
  
  var query = req.query || {};
  Tossup.findAll({include: [{model: Subject}, {model: Packet, include: [Tournament]}], where: query, offset: offset, limit: limit}).success(function(tossups) {
    res.json(tossups);
  }).error(function(err) {
    res.send(500, err);
  });
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
    chainer.add(Tossup.findAll({
      where: {
        'Subject.subject': subj,
        'flagged': false
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

exports.search = function(req, res) {
  Tossup.search(req.query.q).success(function(tups) {
    res.send(tups);
  }).error(function(err) {
    res.send(500, err);    
  });
}
