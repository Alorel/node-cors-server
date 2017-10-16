const throng = require('throng');
const numCPUs = require('os').cpus().length;
global.Promise = require('bluebird');

console.log(`Starting ${numCPUs} workers...`);

throng(numCPUs, id => {
  console.log(`Starting worker ${id}`);
  process.chdir(__dirname);
  global.Promise = require('bluebird');

  require('fs').readdir('./handlers', 'utf8', (err, files) => {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      require('./lib');
      const express = require('express');
      const app = express();
      const shrinkRay = require('shrink-ray');
      const config = require('./config');

      app.set('port', process.env.PORT || config.default_port);
      app.get('*', shrinkRay(config.shrinkray));

      files
        .filter(f => f !== 'core')
        .sort()
        .map(f => `./handlers/${f}`)
        .map(p => require(p))
        .forEach(handler => {app.get('*', handler)});

      app.get('/', require('./handlers/core/cors'));
      app.get('/github', require('./handlers/core/gh-data'));

      app.get('*', (req, res) => {
        res.status(404).end();
      });

      app.listen(app.get('port'), () => {
        console.log(`Worker ${id} listening on port ${app.get('port')}`);
      });
    }
  });
});
