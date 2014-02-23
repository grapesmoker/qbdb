var path = require('path')
  , views = path.join(__dirname, '..', 'views')

exports.index = function(req, res) {
  res.sendfile(path.join(views, 'index.html'));
};

exports.partial = function(req, res) {
  var name = req.params.name;
  res.sendfile(path.join(views, 'partials', name));
}

exports.tournamentRoutes = function(tournaments) {

}

exports.packetRoutes = function(packets) {
  packets.list.start(function(req, res, context) {
    context.criteria = req.query;
    context.continue();
  });
  packets.list.data(function(req, res, context) {
    context.continue();
  });
}
