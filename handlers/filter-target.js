const config = require('../config');
const {URL} = require('url');

module.exports = (req, res, next) => {
    try {
        let hostname = new URL(req.query.url).hostname;

        if (!hostname) {
            return res.status(400).end(`Failed to parse target ${req.query.url}`);
        }

        hostname = hostname.toLowerCase();

        if (!config.whitelist.targets.includes(hostname)) {
            return res.status(403).end(`Target ${req.query.url} not allowed`);
        }

        setImmediate(next);
    } catch(e) {
        console.error(e);
        res.status(503).end();
    }
};