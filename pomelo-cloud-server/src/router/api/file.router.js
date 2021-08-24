'use strict';
/**
 * code by PomeloCloud
 */
const express = require('express');
const router = express.Router();
const {FileService} = require('../../service/file.service');

router.post('/list', function (req, res, next) {
  const {path, options} = req.body.data;
  try {
    const fileList = FileService.fileList(path, options);
    return res.json(fileList);
  } catch (e) {
    console.error('file list: ', e);
    next();
  }
});

module.exports = router;
