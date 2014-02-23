var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , db = require('./models')
  , rest = require('epilogue');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);
rest.initialize({app: app});
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//routes
var tournaments = rest.resource({
  model: db.Tournament,
  endpoints: ['/api/tournament', '/api/tournament/:id']
});
var packets = rest.resource({
  model: db.Packet,
  endpoints: ['/api/packet', '/api/packet/:id']
});
app.get('/', routes.index);
app.get('/partials/:name', routes.partial);
routes.tournamentRoutes(tournaments);
routes.packetRoutes(packets);
app.get('*', routes.index);

db.sequelize.sync().complete(function(err) {
  if(err) throw err;
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
});
