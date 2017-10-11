const express = require('express');
const app = express();
const whitelist = require('./whitelist.json');

app.set('port', (process.env.PORT || 5000));

app.use('*', (req, res, next) => {
  console.log(`Origin: ${req.header('origin')}`);
  console.log(`Referer: ${req.header('referer')}`);
  setImmediate(next);
});

app.get('/', (req, res) => {
  res.end('');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
