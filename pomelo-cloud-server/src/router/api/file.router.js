'use strict';
/**
 * code by PomeloCloud
 */
const express = require('express');
const router = express.Router();
const FileService = require('../../service/file.service');
const logger = require('log4js').getLogger();
const {FILE_TYPE} = require('../../domain/constants/file.constant');

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
  const {path, page = {pageNo: 1, pageSize: 50}, options} = req.body;
  try {
    const result = FileService.fileList(path, page, options);
    return res.json(_ctx.okByData(result));
  } catch (e) {
    logger.error('[FileRouter] list: ', e);
    return res.json(_ctx.error('file list error'));
  }
});

router.post('/create', function(req, res, next) {
  const {type = FILE_TYPE.FILE} = req.query;
  const {name, path} = req.body;
  try {
    FileService.createFile(type, name, path);
    return res.json(_ctx.ok());
  } catch (e) {
    logger.error('[FileRouter] create: ', e);
    return res.json(_ctx.error('file create error'));
  }
});

router.delete('/remove', function(req, res, next) {
  const {name, path} = req.body;
  try {
    FileService.deleteFile(name, path);
    return res.json(_ctx.ok());
  } catch (e) {
    logger.error('[FileRouter] remove: ', e);
    return res.json(_ctx.error('file remove error'));
  }
});

router.post('/rename', function(req, res, next) {
  const {newName, oldName, path} = req.body;
  try {
    FileService.renameFile(newName, oldName, path);
    return res.json(_ctx.ok());
  } catch (e) {
    logger.error('[FileRouter] rename: ', e);
    return res.json(_ctx.error('file rename error'));
  }
});

router.post('/copy', function(req, res, next) {
  const {name, path} = req.body;
  try {
    const token = FileService.copyFile(name, path);
    return res.json(_ctx.okByData(token));
  } catch (e) {
    logger.error('[FileRouter] copy: ', e);
    return res.json(_ctx.error('file copy error'));
  }
});

router.post('/cut', function(req, res, next) {
  const {name, path} = req.body;
  try {
    const token = FileService.cutFile(name, path);
    return res.json(_ctx.okByData(token));
  } catch (e) {
    logger.error('[FileRouter] cut: ', e);
    return res.json(_ctx.error('file cut error'));
  }
});

router.post('/paste', function(req, res, next) {
  const {token, path} = req.body;
  try {
    FileService.pasteFile(token, path);
    return res.json(_ctx.ok());
  } catch (e) {
    logger.error('[FileRouter] paste: ', e);
    return res.json(_ctx.error('file paste error'));
  }
});
module.exports = router;
