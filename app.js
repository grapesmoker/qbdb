
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , cons = require('consolidate')
  , fs = require('fs');

var app = express();

mongoose.connect('mongodb://localhost/qbdb');

bcrypt = require('bcrypt');
und = require('underscore');
moment = require('moment');
hb = require('handlebars');

// all environments
app.engine('html', cons.handlebars);
app.set('port', process.env.PORT || 3000);
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
app.get('/alltournaments', routes.alltournaments);
app.get('/viewtour/:id', routes.viewtour);
app.get('/viewquestions/:id', routes.viewquestions);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

hb.registerPartial('header', fs.readFileSync('./views/header.html', 'utf8'));
hb.registerPartial('sidebar', fs.readFileSync('./views/sidebar.html', 'utf8'))