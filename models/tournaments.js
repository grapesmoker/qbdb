var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var TournamentSchema = new mongoose.Schema({
  tournament: String,
  year: String,
  numPackets: Number,
  powers: Boolean,
  packets: [{type: ObjectId, ref: 'Packet'}]
});

var Tournament = mongoose.model('Tournament', TournamentSchema);

module.exports = {
  Tournament: Tournament
};
