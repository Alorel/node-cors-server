const config = require('../config');
const each = require('async.each');

module.exports = (req, res, next) => {
    const origin = req.header('origin') || req.header('referer');

    if (!origin) {
        res.status(400).end(`Could not determine origin`);
    } else if (!config.whitelist.origins.includes(origin)) {
        res.status(403).end(`Origin ${origin} not allowed.`);
    } else {
        each(config.headers, (header, done) => {
            res.header(header[0], header[1]);
            setImmediate(done);
        }, next);
    }
};