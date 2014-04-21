var Bookshelf = require('bookshelf').DB;
var Tournament = require('./Tournament').model;

exports.model = Bookshelf.Model.extend({
  tableName: "Packets",
  tournament: function() {
    return this.belongsTo(Tournament, "TournamentId");
  }
});

exports.collection = Bookshelf.Collection.extend({
  model: exports.model
});

