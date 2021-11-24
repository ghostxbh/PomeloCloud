'use strict';
/**
 * code by PomeloCloud
 */
const express = require('express');
const ApiRouter = express.Router();
const AllRouter = express.Router();
const FileRouter = require('./api/file.router');
const AuthRouter = require('./api/auth.router');
const LoggerMiddleware = require('../components/pclogger/logger.middleware');

AllRouter.all('/', function(req, res, next) {
  return res.send('please visit PomeloCloud panel: https://pomelo.work');
});

ApiRouter.use('/file', FileRouter);
ApiRouter.use('/auth', AuthRouter);

AllRouter.use('/api', LoggerMiddleware, ApiRouter);

module.exports = AllRouter;
