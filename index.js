const throng = require('throng');
const numCPUs = require('os').cpus().length;

console.log(`Starting ${numCPUs} workers...`);

throng(require('os').cpus().length, id => {
  console.log(`Starting worker ${id}`);

  require('./lib');
  const express = require('express');
  const app = express();
  const request = require('request');
  const htmlmin = require('htmlmin');
  const shrinkRay = require('shrink-ray');

  const HTMLMIN_OPTIONS = {
    cssmin: true,
    jsmin: true,
    removeComments: true,
    collapseWhitespace: true
  };

  app.set('port', (process.env.PORT || 5000));

  app.use(shrinkRay({
    threshold: 1,
    zlib: {
      level: 9
    },
    brotli: {
      quality: 11
    }
  }));
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
          body = htmlmin(body, HTMLMIN_OPTIONS);
        } catch(e) {
          return res.endWith(500, e);
        }
      }

      res.endWith(rsp.statusCode || 200, body);
    });
  });

  app.listen(app.get('port'), () => {
    console.log(`Worker ${id} listening on port ${app.get('port')}`);
  });
});
