const {readdirSync} = require('fs');
const {join} = require('path');

readdirSync(__dirname, 'utf8')
  .filter(f => f !== 'index.js' && f !== 'redis.js')
  .map(f => join(__dirname, f))
  .forEach(f => require(f));