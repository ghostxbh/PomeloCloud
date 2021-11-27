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

var {run} = require('runjs');
var chalk = require('chalk');
var config = require('../vue.config.js');
var rawArgv = process.argv.slice(2);
var args = rawArgv.join(' ');
var fs = require('fs');
const PORT = fs.readFileSync('../../config/client-port.pl') || 9080;
const P = normalizePort(PORT);

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

if (process.env.npm_config_preview || rawArgv.includes('--preview')) {
  var report = rawArgv.includes('--report');

  run(`vue-cli-service build ${ args }`);

  var port = P;
  var publicPath = config.publicPath;

  var connect = require('connect');
  var serveStatic = require('serve-static');
  var app = connect();

  app.use(
    publicPath,
    serveStatic('./dist', {
      index: ['index.html', '/'],
    }),
  );

  app.listen(port, function() {
    console.log(chalk.green(`> Preview at  http://localhost:${ port }${ publicPath }`));
    if (report) {
      console.log(chalk.green(`> Report at  http://localhost:${ port }${ publicPath }report.html`));
    }
  });
} else {
  run(`vue-cli-service build ${ args }`);
}
