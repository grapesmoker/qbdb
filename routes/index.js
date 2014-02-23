var path = require('path')
  , views = path.join(__dirname, '..', 'views')

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
exports.allModels = function() {
  for(var i=0;i<arguments.length;i++) {
    var route = arguments[i];
    route.list.auth(function(req, res, context) {
      context.criteria = req.query || {};
      context.continue();
    });
  }
}
exports.tournamentRoutes = function(tournaments) {
}

exports.packetRoutes = function(packets) {
}

exports.tossupRoutes = function(tossups) {
}

exports.bonusRoutes = function(bonuses) {
}
