var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var TossupSchema = new mongoose.Schema({
	question: String,
	answer: String,
	subject: String,
	flagged: {type: Boolean, default: false},
	tournament: {type: ObjectId, ref: 'Tournament'},
	packet: {type: ObjectId, ref: 'Packet'}
});

var Tossup = mongoose.model('Tossup', TossupSchema);

module.exports = {
	Tossup: Tossup
};
