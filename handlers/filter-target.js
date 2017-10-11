const config = require('../config');
const {URL} = require('url');

module.exports = (req, res, next) => {
    const url = req.query.url.toLowerCase();

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        console.log(`Invalid URL - http(s) prefix missing: ${url}`);
        return res.status(400).end(`Invalid URL - http(s) prefix missing: ${url}`);
    }

    try {
        let hostname = new URL(url).hostname;

        if (!hostname) {
            console.log(`Failed to parse target ${url}`);
            return res.status(400).end(`Failed to parse target ${url}`);
        }

        if (!config.whitelist.targets.includes(hostname)) {
            console.log(`Target ${url} not allowed`);
            return res.status(403).end(`Target ${url} not allowed`);
        }

        setImmediate(next);
    } catch(e) {
        console.error(e);
        res.status(503).end();
    }
};