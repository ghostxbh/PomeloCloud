'use strict';
/**
 * code by PomeloCloud
 */
const path = require('path');
const express = require('express');
const app = express();
const ejs = require('ejs');

// parse body
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// router
app.use(require('./src/router/index'));

module.exports = app;
