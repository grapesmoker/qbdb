var path = require('path')
  , views = path.join(__dirname, '..', 'views');

exports.index = function(req, res) {
  res.sendfile(path.join(views, 'index.html'));
};

exports.partial = function(req, res) {
  var name = req.params.name;
  res.sendfile(path.join(views, 'partials', name));
}

exports.template = function(req, res) {
  var name = req.params.name;
  res.sendfile(path.join(views, 'templates', name));
}
