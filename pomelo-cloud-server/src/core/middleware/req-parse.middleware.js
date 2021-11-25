'use strict';
/**
 * @date: 2021/9/10
 * @author: xubenhao
 * @desc: 请求解析中间件
 */
const path = require('path');
exports.use = function(app, express) {
    // parse static
    app.use(express.static(path.join(__dirname, 'public')));
    // parse body
    app.use(express.json({
        limit: '10mb',
        type: 'application/json',
    }));
    // parse query/params
    app.use(express.urlencoded({
        extended: false,
        parameterLimit: 100,
    }));
};
