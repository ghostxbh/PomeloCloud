'use strict';
/**
 * code by PomeloCloud
 */
const express = require('express');
const router = express.Router();
const LoginService = require('../../service/login.service');
const logger = require('log4js').getLogger();

router.post('/login', function(req, res, next) {
  const {username, password, code} = req.body;
  try {
    const token = LoginService.login(username, password, req);
    _ctx.setData({token});
    _ctx.sendSuccess();
  } catch (e) {
    logger.error('[LoginRouter] login: ', e);
    _ctx.sendError(e);
  }
  return res.json(_ctx.sendResult());
});

router.post('/logout', function(req, res, next) {
  try {
    LoginService.logout(req);
    _ctx.sendSuccess();
  } catch (e) {
    logger.error('[LoginRouter] logout: ', e);
    _ctx.sendError(e);
  }
  return res.json(_ctx.sendResult());
});

module.exports = router;
