var models = require('./index')
  , Sequelize = require('sequelize')
  , async  = require('async')
  , fs  = require('fs')
  , path = require('path');

var Tournament = models.Tournament
  , Packet = models.Packet
  , Tossup = models.Tossup
  , Bonus = models.Bonus
  , Subject = models.Subject;

var importTournament = function(cb) {
  var tjson = require('./tournaments.json');
  var chain = new Sequelize.Utils.QueryChainer;
  tjson.forEach(function(e) {
    var cur = {};
    cur.name = e.tournament;
    cur.difficulty = e.diff;
    cur.power = e.power;
    cur.year = e.year;
    cur.tournament_mongo = e['_id']['$oid'];
    chain.add(Tournament.create(cur));
  });
  chain.run().success(function(out) { cb(null, out); }).error(function(err) { cb(err, null); });
}

var importPacket = function(cb) {
  var pjson = require('./packets.json');
  var chain = new Sequelize.Utils.QueryChainer;
  pjson.forEach(function(e, i) {
    var cur = {};
    cur.name = e.author;
    cur.packet_mongo = e['_id']['$oid'];
    Tournament.find({where: {tournament_mongo: e['tournament']['$oid']}}).success(function(tou) {
      chain.add(Packet.create(cur).success(function(p) {
        p.setTournament(tou);
      }));
    });
  });
  chain.run().success(function(out) { cb(null, out); }).error(function(err) { cb(err, null); });
}

var linkPacketTournament = function(cb) {
  var pjson = require('./packets.json');
  var chain = new Sequelize.Utils.QueryChainer;
  pjson.forEach(function(e, i) {
    Tournament.find({where: {tournament_mongo: e['tournament']['$oid']}}).success(function(tou) {
      chain.add(Packet.find({where: {packet_mongo: e['_id']['$oid']}}).success(function(p) {
        p.setTournament(tou);
      }));
    });
  });
  chain.run().success(function(out) { cb(null, out); }).error(function(err) { cb(err, null); });
}

var importSubject = function(cb) {
  fs.readFile('subjects.csv', {encoding: 'utf-8'}, function(err, data) {
    if(err) cb(err);
    var lines = data.split('\n');
    lines.pop();
    var chain = new Sequelize.Utils.QueryChainer;
    lines.forEach(function(e) {
      var arr = e.split(',');
      cur = {id: parseInt(arr[0], 10), subject: arr[1]};
      chain.add(Subject.create(cur));
    });
    chain.run().success(function(out) { cb(null, out); }).error(function(err) { cb(err, null); });
  });
}

var importTossup = function(file, cb) {
  var tjson = require('./'+file);
  var chain = new Sequelize.Utils.QueryChainer;
  tjson.forEach(function(e) {
    var cur = {};
    cur.question = e.question;
    cur.answer = e.answer;
    cur.flagged = e.flagged;
    Packet.find({where: {packet_mongo: e['packet']['$oid']}}).success(function(pack) {
      Subject.find({where: {subject: e['subject']}}).success(function(s) {
        chain.add(Tossup.create(cur).success(function(t) {
          t.setPacket(pack);
          t.setSubject(s);
        }));
      });
    });
  });

  chain.run().success(function(out) { cb(null, out); }).error(function(err) { cb(err, null); });
}

var importBonus = function(file, cb) {
  var bjson = require('./'+file);
  var chain = new Sequelize.Utils.QueryChainer;
  bjson.forEach(function(e) {
    var cur = {};
    cur.leadin  = e.leadin;
    cur.part1  = e.part[0];
    cur.answer1  = e.answer[0];
    cur.part2  = e.part[1];
    cur.answer2  = e.answer[1];
    cur.part3  = e.part[2];
    cur.answer3  = e.answer[2];
    cur.flagged = e.flagged;

    Packet.find({where: {packet_mongo: e['packet']['$oid']}}).success(function(pack) {
      Subject.find({where: {subject: e['subject']}}).success(function(s) {
        chain.add(Bonus.create(cur).success(function(t) {
          t.setPacket(pack);
          t.setSubject(s);
        }));
      });
    });
  });

  chain.run().success(function(out) { cb(null, out); }).error(function(err) { cb(err, null); });
}

  /*
async.series([
  function(cb) { Tournament.sync({force: true}).success(function() {cb(null, 0)}); },
  function(cb) { importTournament(cb); },
  function(cb) { Packet.sync({force: true}).success(function() { cb(null, 0)}); },
  function(cb) { importPacket(cb); },
  function(cb) { Subject.sync({force: true}).success(function() { cb(null, 0)}).error(function(e) { cb(e); }); },
  function(cb) { importSubject(cb); },
  function(cb) { Tossup.sync({force: true}).success(function() { cb(null, 0)}).error(function(e) { cb(e); }); },
  function(cb) { 
      for(var i=75;i<80;i++) {
        var filename = 'tossups.'+i+'.json';
        importTossup(path.join('tossups', filename), cb);
      }
  }
  function(cb) { Bonus.sync({force: true}).success(function() { cb(null, 0)}).error(function(e) { cb(e); }); },
  function(cb) { 
    for(var i=70;i<73;i++) {
      var filename = 'bonuses.'+i+'.json';
      importBonus(path.join('bonuses', filename), cb);
    }
  }
]);
  */

linkPacketTournament(function(){});
