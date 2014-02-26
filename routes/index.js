var path = require('path')
  , views = path.join(__dirname, '..', 'views')
  , tossup = require('./tossup')
  , bonus = require('./bonus');

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

exports.tournamentRoutes = function(app) {

}
exports.packetRoutes = function(app) {

}

exports.tossupRoutes = function(app, tossups) {
  app.get('/api/makePacket/tossup', tossup.makePacket);
  app.get('/api/search/tossup', tossup.search);
}

exports.bonusRoutes = function(app, bonuses) {
  app.get('/api/makePacket/bonus', bonus.makePacket);
}
