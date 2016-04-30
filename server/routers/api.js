
var express = require('express');
var apiRouter = express.Router();
var _ = require('lodash');
var request = require('request');
var config = require('../../resources/config');

apiRouter.get('/', function(req, res) {
  res.json({
    message: 'Welcome to the react-redux-express-less-babelify-template api.'
  })
})

module.exports = apiRouter;
