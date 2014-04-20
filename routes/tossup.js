var Promise = require('bluebird')
  , _ = require('lodash')
  , knex = require('bookshelf').DB.knex;
var Tossup = require('../models/Tossup').model
  , Tossups = require('../models/Tossup').collection;

exports.list = function(req, res) {
  new Tossups().query('where', req.query).fetch({
    withRelated: ['subject', 'packet', 'packet.tournament']
  }).then(function(collection) {
    res.send(collection.toJSON());
  }, function(err) {
    res.send(500, {error: err});  
  });
}

exports.get = function(req, res) {
  var tid = req.params.id;
  new Tossup({
    id: tid
  }).fetch().then(function(tup) {
    if(tup == undefined)
      res.send(404, {error: 'Tossup not found'});
    else
      res.send(200, tup);
  }, function(err) {
    res.send(500, {error: err});  
  });
}

exports.makePacket = function(req, res) {
  var minDiff = req.query.minDiff || 1
    , maxDiff = req.query.maxDiff || 9
    , power = JSON.parse(req.query.power) || false
    , distribution = req.query.distribution.map(JSON.parse);
  var promises = [];
  distribution.forEach(function(subjects) {
    var ind = Math.floor(Math.random() * subjects.length);
    var subj = subjects[ind];
    promises.push(new Tossups().query(function(qb) {
      qb.join('Subjects', 'Tossups.SubjectId', '=', 'Subjects.id')
      .join('Packets', 'Tossups.PacketId', '=', 'Packets.id')
      .join('Tournaments', 'Packets.TournamentId', '=', 'Tournaments.id')
      .whereBetween('Tournaments.difficulty', [minDiff, maxDiff])
      .andWhere('Subjects.subject', '=', subj)
      .orderBy(knex.raw('random()'))
      .limit(1);

      if(power) {
        qb.andWhere('power', '=', 't');
      }

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
