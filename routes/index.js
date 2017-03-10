const express = require('express');
const router = express.Router();
const request = require('request-promise');
const addHeaders = require('../lib/headers').add;
const head = require('../lib/validate-request');
const NOTFOUND = require('dns').NOTFOUND;
const config = require('../config.json');
const msu = require('ms-util');

const indexVars = {
    title: 'CORS Proxy',
    allowed: config.ctypes.allow.sort(),
    denied: config.ctypes.deny.sort(),
    methods: config.headers.cors["Access-Control-Allow-Methods"],
    maxlength: config.max_content_length.toLocaleString() + ' bytes',
    head_cache_age: msu.toWords(config.cache_max_age),
    cache_size: config.cache_size.toLocaleString()
};

const handleCors = (req, res) => {
    addHeaders(res, 'cors');
    const url = req.query.url;

    const forward = () => {
        req.pipe(request(url)).pipe(res);
    };

    head.requestAndCheck(url).then(r => {
        res.header('X-HEAD-Cached', r.cache.toString());
        if (r.result.ok) {
            forward();
        } else {
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

        forward();
    });
};

router.get('/', (req, res) => {
    if ('url' in req.query) {
        handleCors(req, res);
    } else {
        res.render('index', indexVars);
    }
});

module.exports = router;
