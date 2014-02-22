var path = require('path')

exports.index = function(req, res) {
  res.sendfile(path.join(views, 'index.html'));
};

exports.partial = function(req, res) {
  var name = req.params.name;
  res.sendfile(path.join(views, 'partials', name));
}

exports.tournamentRoutes = function(tournaments) {

}
