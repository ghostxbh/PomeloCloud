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
    return res.json(_ctx.okByData(result));
  } catch (e) {
    logger.error('[FileRouter] sidebar: ', e);
    return res.json(_ctx.error('file sidebar error'));
  }
});

router.post('/list', function(req, res, next) {
  const {path, page = {pageNo: 1, pageSize: 10}, options} = req.body;
  try {
    const result = FileService.fileList(path, page, options);
    return res.json(_ctx.okByData(result));
  } catch (e) {
    logger.error('[FileRouter] list: ', e);
    return res.json(_ctx.error('file list error'));
  }
});

module.exports = router;
