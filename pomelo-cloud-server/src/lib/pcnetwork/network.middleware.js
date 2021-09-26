'use strict';
/**
 * code by PomeloCloud
 * 网络中间件
 */
const logger = require('log4js').getLogger();
const NetworkService = require('./network.service');
const NetworkUtil = require('./network.util');

exports.use = function(app) {
  app.use((req, res, next) => {
    const ip = NetworkUtil.replacePrefix(req.ip);
    const blackIpList = NetworkService.getBlackIpList();
    for (let i = 0; i < blackIpList.length; i++) {
      const blackIp = blackIpList[i];
      if (blackIp === ip) {
        logger.warn('[Black IP request] %s', ip);
        return res.json(_ctx.send500());
      }
    }
    next();
  });
};
