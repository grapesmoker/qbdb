var express = require('express')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , config = require('config')
  , Bookshelf = require('bookshelf');

var app = express();

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//database
Bookshelf.DB = Bookshelf.initialize(config.Database);

//ROUTES
var routes = require('./routes')
  , tournament  = require('./routes/tournament');

//main routes
app.get('/', routes.index);
app.get('/partials/:name', routes.partial);
app.get('/templates/:name', routes.template);

//tournament
app.get('/api/tournament', tournament.list);
app.get('/api/tournament/:id', tournament.get);

//everything else
app.get('*', routes.index);

//start server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
