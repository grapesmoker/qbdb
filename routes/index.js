var Tournament = require('../models/tournaments').Tournament;
var Packet = require('../models/packets').Packet;
var Tossup = require('../models/tossups').Tossup;
var Bonus = require('../models/bonuses').Bonus;
var und = require('underscore');

var wrapTournament = function(filename) {
  var count, total;
  Tossup.count({}, function(err, tossupCount) {
    Bonus.count({}, function(err, bonusCount) {
      total = tossupCount + bonusCount;
      Tossup.count({subject: 'Undefined'}, function(err, unseenTossupCount) {
        Bonus.count({subject: 'Undefined'}, function(err, unseenBonusCount) {
          count = total - unseenTossupCount - unseenBonusCount;
       });
      });
    });
  });
  return function(req, res) {
    Tournament.find({}, function(err, tournaments) {
      if (err || !tournaments) {
        console.log(err);
        res.render(filename, {state: 'error', message: 'Failed to retrieve tournaments!'});
      }
      else {
        res.render(filename, {state: 'success', tournaments: tournaments, total: total, count: count, progress: Math.floor((count / total)*100)});
      }
    });
  }
}

exports.index = wrapTournament('index.html');
exports.faq = wrapTournament('faq.html');
exports.alltournaments = wrapTournament('alltournaments.html');

exports.viewtour = function(req, res) {
	Tournament.find({}, function(err, tournaments) {
		if (err || !tournaments) {
			console.log(err);
			res.render('viewtour.html', {state: 'error', message: 'Failed to retrieve tournaments!'});
		}
		else {
			var tourId = req.params.id;
			Packet.find({tournament: tourId})
			.populate('tournament').exec(function(err, packets) {
				if (err || !packets) {
					console.log(err);
					res.render('viewtour.html', {state: 'error', message: 'Failed to retrieve packets!'});
				}
				else {
					res.render('viewtour.html', {state: 'success', tournaments: tournaments, packets: packets});
				}
			});
		}
	});
};

var subjects = [
  {
    header: 'Undefined',
    list: ['Undefined']
  }, {
    header: 'History',
    list: [
      'American History',
      'European History',
      'World History',
      'Ancient History',
      'Mixed History'
    ] 
  }, {
    header: 'Literature',
    list: [
      'American Literature',
      'British Literature',
      'European Literature',
      'World Literature',
      'Ancient Literature',
      'Mixed Literature'
    ] 
  }, {
    header: 'Science',
    list: [
      'Biology',
      'Chemistry',
      'Physics',
      'Mathematics',
      'Astronomy',
      'Earth Science',
      'Computer Science',
      'Other Science'
    ]
  }, {
    header: 'RMP',
    list: [
      'Religion',
      'Mythology',
      'Philosophy'
    ] 
  }, {
    header: 'Fine Arts',
    list: [
      'Classical Music',
      'Opera',
      'Other Music',
      'Paintings',
      'Sculpture',
      'Other Art'
    ]
  }, {
    header: 'Other',
    list: [
      'Anthropology',
      'Economics',
      'Psychology',
      'Other Social Science',
      'Geography',
      'Miscellaneous',
      'Current Events',
      'TRASH'
    ]
  }
];

exports.viewquestions = function(req, res) {
	Tournament.find({}, function(err, tournaments) {
		if (err || !tournaments) {
			console.log(err);
			res.render('viewquestions.html', {state: 'error', message: 'Failed to retrieve tournaments!'});
		}
		else {
			var packetId = req.params.id;
			Packet.findOne({_id: packetId})
			.populate('tournament').exec(function(err, packet) {
				if (err || !packet) {
					console.log(err);
					res.render('viewquestions.html', {state: 'error', message: 'Failed to retrieve packet!'});
				}
				else {
					Tossup.find({packet: packetId}, function(err, tossups) {
						if (err || !tossups) {
							console.log(err);
							res.render('viewquestions.html', {state: 'error', message: 'Failed to retrieve tossups!'});
						}
						else {
							Bonus.find({packet: packetId}, function(err, bonuses) {
								if (err || !bonuses) {
									console.log(err);
									res.render('viewquestions.html', {state: 'error', message: 'Failed to retrieve bonuses!'});
								}
								else {
                  var zipmebabyonemoretime = new Array(bonuses.length);
                  for(var i=0; i<bonuses.length; i++) {
                      //zipmebabyonemoretime[i] = bonuses[i];
                      zipmebabyonemoretime[i] = {_id: bonuses[i]._id, leadin: bonuses[i].leadin, parts: und.zip(bonuses[i].value, bonuses[i].part, bonuses[i].answer), subject: bonuses[i].subject};
                  }
									res.render('viewquestions.html', 
                    { state: 'success', 
                      tournaments: tournaments, 
                      packet: packet,
                      tossups: tossups,
                      bonuses: zipmebabyonemoretime,
                      subjects: subjects
                    });
								}
							});
						}
					});
				}
			});
		}
	});
}

exports.deletetour = function(req, res) {
  var tourId = req.params.id;
  Tournament.remove({_id: tourId}, function(terr) {
    Packet.remove({tournament: tourId}, function(perr) {
      Tossup.remove({tournament: tourId}, function(tuperr) {
        Bonus.remove({tournament: tourId}, function(bperr) {
          if(terr || perr || tuperr || bperr) {
            console.log(terr, perr, tuperr, bperr);
            res.redirect('/alltournaments.html');
          }
        });
      });
    });
  });
}

exports.update = function(req, res) {
  var id = req.body.id,
      newSubject = req.body.newSubject;
  Tossup.findById(id, function(err, tossup) {
    if(err) {
      throw err;  
    }
    if(tossup === null) {
      Bonus.findByIdAndUpdate(id, {subject: newSubject}, function(err, bonus) {
        if(err) throw err;
        res.send(200);
      });
    } else {
      tossup.subject = newSubject;
      tossup.save(function(err) {
        if(err) throw err;
        res.send(200);
      });
    }
  });
}

exports.report = function(req, res) {
  var id = req.body.id,
      type = req.body.type,
      model = type === 'tossup' ? Tossup : Bonus;
  model.findByIdAndUpdate(id, {flagged: true}, function(err, question) {
    if(err) throw err;
    res.send(200);
  });
}
