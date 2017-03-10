const LRU = require('lru-cache');
const request = require('request-promise');
const cfg = require('../config.json');
const Promise = require('bluebird');

const cache = LRU({
    max: cfg.cache_size,
    maxAge: cfg.cache_max_age
});

const ctypeAllowed = ctype => {
    ctype = ctype.toLowerCase();

    for (let allow of cfg.ctypes.allow) {
        if (ctype.indexOf(allow) !== -1) {
            for (let deny of cfg.ctypes.deny) {
                if (ctype.indexOf(deny) !== -1) {
                    return false;
                }
            }

            return true;
        }
    }
    return false;
};

const checkHeaders = r => {
    let ok = false;
    let err = null;
    if (r.length > cfg.max_content_length) {
        err = `Content length of ${r.length.toLocaleString()} is above the allowed ${cfg.max_content_length.toLocaleString()}`
    } else if (r.ctype && !ctypeAllowed(r.ctype)) {
        err = `Content type ${r.ctype} is not allowed`;
    } else {
        ok = true;
    }

    return {ok, err};
};

const checkHeadersWithCache = (url, headers) => {
    let cached;
    if (!(cached = cache.get(url))) {
        cached = checkHeaders({
            length: headers['content-length'] || 0,
            ctype: headers['content-type'] || null
        });

        cache.set(url, cached);
    }

    return cached;
};

const requestAndCheck = url => {
    return new Promise((resolve, reject) => {
        let cached;
        if ((cached = cache.get(url))) {
            resolve({
                result: cached,
                cache: true
            });
        } else {
            request.head(url).then(r => {
                resolve({
                    result: checkHeadersWithCache(url, r),
                    cache: false
                });
            }).catch(reject);
        }
    });
};

module.exports = {
    checkHeaders: checkHeadersWithCache,
    requestAndCheck
};