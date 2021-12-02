'use strict';
/**
 * code by PomeloCloud
 */
const path = require('path');
const express = require('express');
const session = require('express-session');
const app = express();
const ejs = require('ejs');
const createError = require('http-errors');
var logger = require('log4js').getLogger();
const {init} = require('./src/components/pclogger/logger.config');
const req_parse = require('./src/core/middleware/req-parse.middleware');
const network = require('./src/components/pcnetwork/network.middleware');
const Context = require('./src/core/extend/context');
const multerConfig = require('./src/core/config/multer.config');
const upload = require('multer')({storage: multerConfig.storage});
const cors = require('cors');

// parse body
req_parse.use(app, express);
network.use(app);
init('logs/app_log.log');

// global variables
global._ctx = Context;

// engine
app.set('views', path.join(__dirname, 'public'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// upload file
app.use(upload.any());
app.use(express.static(path.join(__dirname, 'tmp')));

// session
app.use(session({resave: true, saveUninitialized: true, secret: 'pcsession'}));

// Access-Control-Allow-Origin
app.use(cors());

// router
app.use(require('./src/router'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const error = createError();
  logger.error('[error]: ', error);
  next();
});

// unkown error, to exit process
process.on('uncaughtException', function(err) {
  logger.error('[process] error: ', err);
  // 可使用cluster，进行进程退出重启
  // process.exit(1);
});

module.exports = app;
