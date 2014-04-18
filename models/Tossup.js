var Bookshelf = require('bookshelf').DB;
var Packet = require('./Packet').model
  , Subject = require('./Subject').model;

exports.model = Bookshelf.Model.extend({
  tableName: "Tossups",
  packet: function() {
    return this.belongsTo(Packet, "PacketId");
  },
  subject: function() {
    return this.belongsTo(Subject, "SubjectId");
  }
});

exports.collection = Bookshelf.Collection.extend({
  model: exports.model
});

