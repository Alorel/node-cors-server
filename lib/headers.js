const headers = require('../config.json').headers;

const keys = {
    global: Object.keys(headers.global),
    cors: Object.keys(headers.cors)
};

const add = (res, type) => {
    for (let k of keys[type]) {
        res.header(k, headers[type][k]);
    }
};

module.exports = {
    add,
    headers,
    middleware: (req, res, next) => {
        add(res, 'global');
        next();
    }
};