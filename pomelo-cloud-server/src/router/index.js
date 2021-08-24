'use strict';
/**
 * code by PomeloCloud
 */
const express = require('express');
const router = express.Router();
const FileRouter = require('./api/file.router');

router.use('/api/file', FileRouter);

module.exports = router;
