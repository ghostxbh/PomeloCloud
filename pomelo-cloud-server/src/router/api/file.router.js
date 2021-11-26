'use strict';
/**
 * code by PomeloCloud
 */
const express = require('express');
const router = express.Router();
const FileService = require('../../service/file.service');
const logger = require('log4js').getLogger();

router.get('/sidebar', function(req, res, next) {
  try {
    const result = FileService.fileSidebar();
    _ctx.setData(result);
    _ctx.sendSuccess();
  } catch (e) {
    logger.error('[FileRouter] sidebar: ', e);
    _ctx.sendError(e);
  }
  return res.json(_ctx.sendResult());
});

router.post('/list', function(req, res, next) {
  const {path, page = {pageNo: 1, pageSize: 10}, options} = req.body;
  try {
    const result = FileService.fileList(path, page, options);
    _ctx.setData(result);
    _ctx.sendSuccess();
  } catch (e) {
    logger.error('[FileRouter] list: ', e);
    _ctx.sendError(e);
  }
  return res.json(_ctx.sendResult());
});

module.exports = router;
