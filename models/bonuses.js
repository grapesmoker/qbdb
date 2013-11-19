var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var BonusSchema = new mongoose.Schema({
	leadin: String,
	part: Array,
	value: Array,
	answer: Array,
	tournament: {type: ObjectId, ref: 'Tournament'},
	packet: {type: ObjectId, ref: 'Packet'}
},
	{collection: 'bonuses'});

var Bonus = mongoose.model('Bonus', BonusSchema);

module.exports = {
	Bonus: Bonus
};
