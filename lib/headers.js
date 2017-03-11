const Promise = require('bluebird');
const eachof = require('async.eachof');
const headers = require('../config.json').headers.global;

const add = (res, headers) => {
    return new Promise((resolve, reject) => {
        eachof(headers, (v, k, next) => {
            res.header(k, v);
            next();
        }, e => {
            e ? reject(e) : resolve();
        });
    });
};

module.exports = {
    add,
    middleware: (req, res, next) => {
        add(res, headers).then(next);
    }
};