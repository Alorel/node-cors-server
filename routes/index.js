const express = require('express');
const router = express.Router();
const request = require('request-promise');
const addHeaders = require('../lib/headers').add;
const head = require('../lib/validate-request');
const NOTFOUND = require('dns').NOTFOUND;
const config = require('../config.json');
const msu = require('ms-util').toWords;
const Promise = require('bluebird');
const sysinfo = require('../lib/sys-info');
const stats = require('../lib/stats');

const indexVars = {
    title: 'CORS Proxy',
    allowed: config.ctypes.allow.sort(),
    denied: config.ctypes.deny.sort(),
    methods: config.headers.cors["Access-Control-Allow-Methods"],
    maxlength: config.max_content_length.toLocaleString() + ' bytes',
    head_cache_age: msu(config.cache_max_age),
    cache_size: config.cache_size.toLocaleString(),
    cluster: require('../lib/cluster-id')
};

const handleCors = (req, res) => {
    const url = req.query.url;

    const forward = () => {
        req.pipe(request(url)).pipe(res);
    };

    Promise.join(head.requestAndCheck(url), addHeaders(res, config.headers.cors), r => {
        res.header('X-HEAD-Cached', r.cache.toString());
        if (r.result.ok) {
            stats.approved++;
            setImmediate(forward);
        } else {
            stats.rejected++;
            res.status(400);
            res.write(r.result.err);
            res.end();
        }
    }).catch(e => {
        if ('cause' in e) {
            if (NOTFOUND === (e.cause.code || e.cause.errno || null)) {
                res.status(404);
                res.end();
                return;
            }
        }

        setImmediate(forward);
    });
};

router.get('/stats', (req, res) => {
    res.json(stats.stats);
});

router.get('/', (req, res) => {
    if ('url' in req.query) {
        setImmediate(handleCors, req, res);
    } else {
        res.render('index', Object.assign({
            stats: stats.stats,
            system_uptime: msu(sysinfo.uptime * 1000),
            mem: sysinfo.freemem
        }, indexVars));
    }
});

module.exports = router;
