const config = require('../config');
const each = require('async.each');

module.exports = (req, res, next) => {
  each(config.headers, (header, done) => {
    console.log(`Setting header ${header[0]} to ${header[1]}`);
    res.header(header[0], header[1]);
    setImmediate(done);
  }, next);
};