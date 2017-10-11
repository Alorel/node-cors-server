const config = require('../config');
const each = require('async.each');

module.exports = (req, res, next) => {
    each(config.headers, (header, done) => {
        res.header(header[0], header[1]);
        setImmediate(done);
    }, next);
};