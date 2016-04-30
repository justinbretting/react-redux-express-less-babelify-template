/**

 */

var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var hbs = require('hbs');
var _ = require('lodash');
var express = require('express');
var config = require('./resources/config');
var apiRouter = require('./server/routers/api');

var app = express();
app.use(logger(process.env['LOG_FORMAT'] || 'combined'));
app.set('view engine', 'hbs');

app.get('/config.js', function (req, res, next) {
  res.header({ 'Cache-Control': 'public, max-age=3600' });
  res.render('config.hbs', config);
});

app.get('/', function(req, res) {
  var is_production = (config.NODE_ENV === 'production');
  res.header({ 'Cache-Control': 'public, max-age=3600' });
  res.render('index.hbs', _.assign({}, config, {
    is_production: is_production,
    react_version: '0.14.7.' + (is_production ? 'min.' : '') + 'js'
  }));
})

app.get(['/img/*', '/fonts/*'], function(req, res, next) {
  res.header({ 'Cache-Control': 'public, max-age=86400' });
  next();
});

app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 3600000 }));
app.use('/api', apiRouter)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
