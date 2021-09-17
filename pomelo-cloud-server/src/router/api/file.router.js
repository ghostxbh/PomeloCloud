'use strict';
/**
 * code by PomeloCloud
 */
const express = require('express');
const router = express.Router();
const {FileService} = require('../../service/file.service');
const logger = require('log4js').getLogger();

router.post('/list', function (req, res, next) {
  const {path, options} = req.body.data;
  try {
    const fileList = FileService.fileList(path, options);
    _ctx.setData(fileList);
    _ctx.sendSuccess();
  } catch (e) {
    logger.error('[file] list: ', e);
    _ctx.sendError(e);
  }
  return res.json(_ctx.sendResult());
});

module.exports = router;
