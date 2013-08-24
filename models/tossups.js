/**
 * New node file
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var TossupSchema = new mongoose.Schema({
	question: String,
	answer: String,
	tournament: {type: ObjectId, ref: 'Tournament'},
	packet: {type: ObjectId, ref: 'Packet'}
});

var Tossup = mongoose.model('Tossup', TossupSchema);

module.exports = {
	Tossup: Tossup
};