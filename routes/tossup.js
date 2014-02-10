var async = require('async')
  , _ = require('lodash');
var Tossup = require('../models/tossups').Tossup;

exports.createRoutes = function(root, app) {
  app.get(root, function(req, res) {
    if(!req.query.id) {
      var limit = req.query.limit || 50;
      var skip = req.query.skip || 0;
      delete req.query.limit;
      delete req.query.skip;
      Tossup.find(req.query, null, {limit: limit, skip: skip}, function(err, tossups) {
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

  app.get(root + '/count', function(req, res) {
    Tossup.count(req.query, function(err, count) {
      if(err) res.send(500, err);
      res.json({count: count});
    });
  });

  app.get(root + '/makePacket', function(req, res) {
    if(!req.query) res.send(400, new Error("No query!"));
    var queryList = {};
    _.forOwn(req.query, function(num, key) {
      queryList[key] = (function(callback) {
        Tossup.find({subject: key}, function(err, tossups) {
          if(err) callback(err);
          callback(null, tossups);
        });
      });
    });

    async.parallel(queryList, function(err, results) {
      var realResults = [];
      //THIS IS HORRIBLE AUGH HELP
      for(var key in req.query) {
        var cur = _.sample(results[key], req.query[key]);
        realResults.push(cur);
      }
      realResults = _.flatten(realResults);
      realResults = _.shuffle(realResults);
      res.send(realResults);
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
