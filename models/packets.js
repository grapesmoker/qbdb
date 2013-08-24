/**
 * New node file
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var PacketSchema = new mongoose.Schema({
	tournament_naem: String,
	year: String,
	author: String,
	tournament: {type: ObjectId, ref: 'Tournament'}
});

var Packet = mongoose.model('Packet', PacketSchema);

module.exports = {
	Packet: Packet
};