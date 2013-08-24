/**
 * New node file
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var BonusSchema = new mongoose.Schema({
	leadin: String,
	values: [String],
	parts: [String],
	answers: [String],
	tournament: {type: ObjectId, ref: 'Tournament'},
	packet: {type: ObjectId, ref: 'Packet'}
},
	{collection: 'bonuses'});

var Bonus = mongoose.model('Bonus', BonusSchema);

module.exports = {
	Bonus: Bonus
};