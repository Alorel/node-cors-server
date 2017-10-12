global.Promise = require('bluebird');
const throng = require('throng');
const numCPUs = require('os').cpus().length;

console.log(`Starting ${numCPUs} workers...`);

throng(numCPUs, id => {
  console.log(`Starting worker ${id}`);

  require('./lib');
  const express = require('express');
  const app = express();
  const request = require('request');
  const htmlmin = require('htmlmin');
  const shrinkRay = require('shrink-ray');
  const config = require('./config');
  const redis = require('./lib/redis');

  app.set('port', process.env.PORT || config.default_port);

  app.use(shrinkRay(config.shrinkray));
  app.get('/', require('./handlers/set-headers'));
  app.get('/', require('./handlers/filter-origin'));
  app.get('/', require('./handlers/filter-querystring'));
  app.get('/', require('./handlers/filter-target'));

  app.get('/', (req, res) => {
    redis.get(req.target)
      .then(cachedData => {
        if (cachedData) {
          res.header('content-type', cachedData.ctype)
            .status(cachedData.status)
            .end(cachedData.body);
        } else {
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
              .catch(e => {
                console.error(`Failed to set cache for ${req.target}`);
                console.error(e);
              });

            res.status(status).end(body);
          });
        }
      })
      .catch(e => res.endWith(500, e));
  });

  app.listen(app.get('port'), () => {
    console.log(`Worker ${id} listening on port ${app.get('port')}`);
  });
});
