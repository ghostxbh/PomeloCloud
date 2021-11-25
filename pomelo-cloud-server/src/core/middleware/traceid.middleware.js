'use strict';
/**
 * @date: 2021/9/10
 * @author: xubenhao
 * @desc: 追踪id中间件
 */
const rTracer = require('cls-rtracer');
exports.use = function(app) {
    app.use(rTracer.expressMiddleware({useHeader: true, headerName: 'traceId'}));
};
