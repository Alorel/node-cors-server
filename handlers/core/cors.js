const redis = require('../../lib/redis');
const request = require('request');
const htmlmin = require('htmlmin');
const config = require('../../config');

module.exports = (req, res) => {
  redis.get(req.target)
    .then(cachedData => {
      if (cachedData) {
        console.log(`Got cached data for ${req.target}`);

        res.header('content-type', cachedData.ctype)
          .status(cachedData.status)
          .end(cachedData.body);
      } else {
        console.log(`No cached data for ${req.target}. Fetching...`);

        request(req.target, (e, rsp, body) => {
          if (e) {
            return res.endWith((rsp || {}).statusCode || 500, e)
          }

          const ctype = rsp.headers['content-type'];

          res.header('content-type', ctype);

          if (ctype.includes('text/html')) {
            try {
              body = htmlmin(body, config.htmlmin);
            } catch(e) {
              return res.endWith(500, e);
            }
          }

          const status = rsp.statusCode || 200;

          redis.set(req.target, {ctype, status, body})
            .then(() => {
              console.log(`Added ${req.target} to cache.`);
            })
            .catch(e => {
              console.error(`Failed to set cache for ${req.target}`);
              console.error(e);
            });

          res.status(status).end(body);
        });
      }
    })
    .catch(e => res.endWith(500, e));
};