const config = require('../config');
const {URL} = require('url');

module.exports = (req, res, next) => {
    let origin = req.header('origin') || req.header('referer');

    if (!origin) {
        console.log('Could not determine origin');
        return res.status(400).end('Could not determine origin');
    }

    try {
        let hostname = new URL(origin).hostname;

        if (!hostname) {
            console.log(`Failed to parse origin ${origin}`);
            return res.status(400).end(`Failed to parse origin ${origin}`);
        }

        hostname = hostname.toLowerCase();

        if (!config.whitelist.origins.includes(hostname)) {
            console.log(`Origin ${origin} not allowed.`);
            return res.status(403).end(`Origin ${origin} not allowed.`);
        }

        setImmediate(next);
    } catch(e) {
        console.error(e);
        res.status(503).end();
    }
};