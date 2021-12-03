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
    return res.json(_ctx.okByData({token}));
  } catch (e) {
    logger.error('[LoginRouter] login: ', e);
    return res.json(_ctx.error('login error'));
  }
});

router.post('/logout', function(req, res, next) {
  try {
    LoginService.logout(req);
    return res.json(_ctx.ok());
  } catch (e) {
    logger.error('[LoginRouter] logout: ', e);
    return res.json(_ctx.error('logout error'));
  }
});

module.exports = router;
