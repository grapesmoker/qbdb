var Bookshelf = require('bookshelf').DB;

exports.model = Bookshelf.Model.extend({
  tableName: "Subjects",
});

exports.collection = Bookshelf.Collection.extend({
  model: exports.model
});
