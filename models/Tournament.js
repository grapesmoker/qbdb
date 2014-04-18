var Bookshelf = require('bookshelf').DB;

exports.model = Bookshelf.Model.extend({
  tableName: "Tournaments"
});

exports.collection = Bookshelf.Collection.extend({
  model: exports.model
});
