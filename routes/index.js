const express = require('express');
const router = express.Router();
const request = require('request-promise');
const addHeaders = require('../lib/headers').add;
const head = require('../lib/validate-request');
const NOTFOUND = require('dns').NOTFOUND;

router.get('/', (req, res, next) => {
    if ('url' in req.query) {
        addHeaders(res, 'cors');
        const url = req.query.url;

        const forward = () => {
            req.pipe(request(url)).pipe(res);
        };

        head.requestAndCheck(url).then(r => {
            console.log(r);
            res.header('X-HEAD-Cached', r.cache.toString());
            if (r.result.ok) {
                forward();
            } else {
                res.status(400);
                res.write(r.result.err);
                res.end();
            }
        }).catch(e => {
            console.error(e);
            if ('cause' in e) {
                if (NOTFOUND === (e.cause.code || e.cause.errno || null)) {
                    res.status(404);
                    res.end();
                    return;
                }
            }

            forward();
        });
    } else {
        res.render('index', {title: 'Cors Proxy'});
    }
});

module.exports = router;
