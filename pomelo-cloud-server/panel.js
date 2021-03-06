#!/usr/bin/env node
/**
 * ##############################################################################
 * # |                              柚子云面板                                  | #
 * ##############################################################################
 * # |                                                                        | #
 * # | Copyright (c) 2020-2021 柚子云(http://pomelo.work) All rights reserved. | #
 * # |                                                                        | #
 * ##############################################################################
 * # |                           Author: ghostxbh                             | #
 * ##############################################################################
 */
var debug = require('debug')('pomelo-cloud-server:server');
var http = require('http');
var app = require('./app');
var fs = require('fs');
var logger = require('log4js').getLogger();
var PORT = fs.readFileSync('../config/server-port.pl') || 9090;
var port = normalizePort(process.env.PORT || PORT);
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.on('close', onClose);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  logger.log('Server is listening on port %f', port);
}

/**
 * Event listener for HTTP server "close" event.
 * @param req
 */
function onClose(req) {
  logger.log('Server is closed!');
  if (req) {
    req.session.destroy();
    logger.log('request session is destroies!');
  }
}
