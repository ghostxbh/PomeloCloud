'use strict';
/**
 * code by PomeloCloud
 * 日志中间件
 */
const querystring = require('querystring');
const uuid = require('uuid');
const logger = require('./logger.config').logger();

module.exports = ((req, res, next) => {
  const traceId = uuid.v4();
  req.traceId = traceId;
  let resBody = null;

  const parseResBody = function() {
    const _json = res.json;
    res.json = function(body) {
      resBody = body;
      _json.apply(res, arguments);
    };
  };

  const replaceIpPrefix = function(ip) {
    return ip.indexOf('::ffff:') > -1 ? ip.replace(/::ffff:/, '') : '-';
  };

  // TODO 可做权限、监控、全链路相关中间件日志过滤
  const reqStart = function() {
    const body = req.method === 'GET' ? querystring.parse(req.query) : req.method === 'POST' ? req.body : '';
    let ip = replaceIpPrefix(req.ip), url = req.originalUrl;
    req.requstTimestamp = Date.now();

    logger.info(`[${ url }] request [${ traceId }] from [${ ip }] : ${ JSON.stringify(body) }`);
  };

  const reqEnd = function() {
    const status = res.statusCode || 200;
    const url = req.originalUrl, timestamp = Date.now();
    const spendTime = timestamp - req.requstTimestamp;

    logger.info(`[${ url }] response [${ traceId }] to client use ${ spendTime } ms : [${ status }] ${ JSON.stringify(resBody) }`);
  };

  parseResBody();
  reqStart();
  res.once('finish', reqEnd);
  next();
});
