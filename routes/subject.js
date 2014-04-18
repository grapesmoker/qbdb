var Subject = require('../models/Subject').model
  , Subjects = require('../models/Subject').collection;

exports.list = function(req, res) {
  new Subjects().fetch().then(function(collection) {
    res.send(collection.toJSON());
  }, function(err) {
    res.send(500, {error: err});  
  });
}

