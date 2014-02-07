var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , fs = require('fs');

var app = express();

mongoose.connect('mongodb://localhost/qbdb');

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/faq', routes.faq);
app.get('/alltournaments', routes.alltournaments);
app.delete('/alltournaments/:id', routes.deletetour);
app.get('/viewtour/:id', routes.viewtour);
app.get('/viewquestions/:id', routes.viewquestions);
app.put('/update', routes.update);
app.put('/report', routes.report);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

