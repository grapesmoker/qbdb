var Promise = require('bluebird')
  , _ = require('lodash')
  , knex = require('bookshelf').DB.knex;
var Bonus = require('../models/Bonus').model
  , Bonuses = require('../models/Bonus').collection;

exports.list = function(req, res) {
  new Bonuses().query('where', req.query).fetch({
    withRelated: ['subject', 'packet', 'packet.tournament']
  }).then(function(collection) {
    res.send(collection.toJSON());
  }, function(err) {
    res.send(500, {error: err});  
  });
}

exports.get = function(req, res) {
  var bid = req.params.id;
  new Bonus({
    id: bid
  }).fetch().then(function(bon) {
    if(tup == undefined)
      res.send(404, {error: 'Bonus not found'});
    else
      res.send(200, bon);
  }, function(err) {
    res.send(500, {error: err});  
  });
}

exports.makePacket = function(req, res) {
  var minDiff = req.query.minDiff || 1
    , maxDiff = req.query.maxDiff || 9
    , distribution = req.query.distribution.map(JSON.parse);
  var promises = [];
  distribution.forEach(function(subjects) {
    var ind = Math.floor(Math.random() * subjects.length);
    var subj = subjects[ind];
    promises.push(new Bonuses().query(function(qb) {
      qb.join('Subjects', 'Bonus.SubjectId', '=', 'Subjects.id')
      .join('Packets', 'Bonus.PacketId', '=', 'Packets.id')
      .join('Tournaments', 'Packets.TournamentId', '=', 'Tournaments.id')
      .whereBetween('Tournaments.difficulty', [minDiff, maxDiff])
      .andWhere('Subjects.subject', '=', subj)
      .orderBy(knex.raw('random()'))
      .limit(1);

    }).fetchOne({
      withRelated: ['subject', 'packet', 'packet.tournament']
    }).then(function(tup) {
      return tup;
    }));
  });

  Promise.map(promises, function(tup) {
    return tup;
  }).then(function(tups) {
    res.send(200, _.shuffle(tups));
  });
}
