var Tournament = require('../models/tournaments').Tournament;
var Packet = require('../models/packets').Packet;
var Tossup = require('../models/tossups').Tossup;
var Bonus = require('../models/bonuses').Bonus;

exports.index = function(req, res){
	Tournament.distinct('year', function(err, tournaments) {
		if (err || !tournaments) {
			console.log(err);
			res.render('index.html', {state: 'error', message: 'Failed to retrieve tournaments!'});
		}
		else {
			console.log(tournaments);
			res.render('index.html', {state: 'success', tournaments: tournaments});
		}
	});
};

exports.faq = function(req, res){
	Tournament.distinct('year', function(err, tournaments) {
		if (err || !tournaments) {
			console.log(err);
			res.render('faq.html', {state: 'error', message: 'Failed to retrieve tournaments!'});
		}
		else {
			console.log(tournaments);
			res.render('faq.html', {state: 'success', tournaments: tournaments});
		}
	});
};

exports.alltournaments = function(req, res) {
	Tournament.find({}).populate('packets').exec(function(err, tournaments) {
		if (err || !tournaments) {
			console.log(err);
			res.render('alltournaments.html', {state: 'error', message: 'Failed to retrieve tournaments!'});
		}
		else {
			console.log(tournaments);
			res.render('alltournaments.html', {state: 'success', tournaments: tournaments});
		}
	});
};

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
					console.log(packets);
					res.render('viewtour.html', {state: 'success', tournaments: tournaments, packets: packets});
				}
			});
		}
	});
};

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
							//console.log(packetId);
							
							Bonus.find({packet: packetId}, function(err, bonuses) {
								if (err || !bonuses) {
									console.log(err);
									res.render('viewquestions.html', {state: 'error', message: 'Failed to retrieve bonuses!'});
								}
								else {
                  var zipmebabyonemoretime = new Array(bonuses.length);
                  for(var i=0; i<bonuses.length; i++) {
                      //zipmebabyonemoretime[i] = bonuses[i];
                      zipmebabyonemoretime[i] = {leadin: bonuses[i].leadin, parts: und.zip(bonuses[i].value, bonuses[i].part, bonuses[i].answer)};
                  }
									//console.log(packet);
									console.log(zipmebabyonemoretime);
									//console.log(packetId);
									res.render('viewquestions.html', 
                    { state: 'success', 
                      tournaments: tournaments, 
                      packet: packet,
                      tossups: tossups,
                      bonuses: zipmebabyonemoretime
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
