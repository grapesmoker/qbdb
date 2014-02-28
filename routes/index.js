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
exports.allModels = function(/*models*/) {
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

exports.tossupRoutes = function(app) {
  app.get('/api/tossup', tossup.list);
  app.get('/api/tossup/:id', tossup.read);
  app.get('/api/makePacket/tossup', tossup.makePacket);
  app.get('/api/search/tossup', tossup.search);
}

exports.bonusRoutes = function(app) {
  app.get('/api/bonus', bonus.list);
  app.get('/api/bonus/:id', bonus.read);
  app.get('/api/makePacket/bonus', bonus.makePacket);
  app.get('/api/search/bonus', bonus.search);
}
