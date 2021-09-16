'use strict';
/**
 * code by PomeloCloud
 */
const path = require('path');
const express = require('express');
const app = express();
const ejs = require('ejs');
const createError = require('http-errors');
const logger = require('./src/lib/pclogger/logger.config').logger();
const req_parse = require('./src/middleware/req-parse.middleware');
const Context = require('./src/extend/context');

// parse body
req_parse.use(app, express);

// global variables
global._ctx = Context;

// engine
app.set('views', path.join(__dirname, 'public'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// router
app.use(require('./src/router/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const error = createError();
  logger.error('[error]: ', error);
  next();
});

module.exports = app;
