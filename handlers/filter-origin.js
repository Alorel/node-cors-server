const config = require('../config');
const {URL} = require('url');

module.exports = (req, res, next) => {
    let origin = req.header('origin') || req.header('referer');

    if (!origin) {
        return res.status(400).end(`Could not determine origin`);
    }

    try {
        let hostname = new URL(origin).hostname;

        if (!hostname) {
            return res.status(400).end(`Failed to parse origin ${origin}`);
        }

        hostname = hostname.toLowerCase();

        if (!config.whitelist.origins.includes(hostname)) {
            return res.status(403).end(`Origin ${origin} not allowed.`);
        }

        setImmediate(next);
    } catch(e) {
        console.error(e);
        res.status(503).end();
    }
};