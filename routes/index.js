var path = require('path')
  , tournamentRoutes = require('./tournament')
  , packetRoutes = require('./packet')
  , tossupRoutes = require('./tossup')
  , bonusRoutes = require('./bonus')
  , views = path.join(__dirname, '..', 'views');
var index = function(req, res) {
  res.sendfile(path.join(views, 'index.html'));
};

exports.createRoutes = function(app) {
  app.get('/', index);
  app.get('/partials/:name', function(req, res) {
    var name = req.params.name;
    res.sendfile(path.join(views, 'partials', name));
  });

  tournamentRoutes.createRoutes('/api/tournament', app);
  packetRoutes.createRoutes('/api/packet', app);
  tossupRoutes.createRoutes('/api/tossup', app);
  bonusRoutes.createRoutes('/api/bonus', app);

  app.get('*', index);
}

