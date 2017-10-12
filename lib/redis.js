const redis = require('redis').createClient(process.env.REDISCLOUD_URL);
const defaultExpires = require('../config').cache_time;

const get = key => new Promise((resolve, reject) => {
  redis.get(key, (err, data) => {
    if (err) {
      reject(err);
    } else if (data) {
      resolve(JSON.parse(data));
    } else {
      resolve(null);
    }
  });
});

const set = (key, data, expires = defaultExpires) => new Promise((resolve, reject) => {
  data = JSON.stringify(data);

  redis.psetex(key, expires, data, err => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});

module.exports = {get, set};