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

  app.set('port', process.env.PORT || config.default_port);

  app.use(shrinkRay(config.shrinkray));
  app.get('/', require('./handlers/set-headers'));
  app.get('/', require('./handlers/filter-origin'));
  app.get('/', require('./handlers/filter-querystring'));
  app.get('/', require('./handlers/filter-target'));

  app.get('/', (req, res) => {
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

      res.status(rsp.statusCode || 200).end(body);
    });
  });

  app.listen(app.get('port'), () => {
    console.log(`Worker ${id} listening on port ${app.get('port')}`);
  });
});
