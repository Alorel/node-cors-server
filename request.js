const request = require('request');
const Promise = require('bluebird');

module.exports = (url, options = {}) => new Promise((resolve, reject) => {
  request(url, options, (err, response, body) => {
    if (err) {
      reject(err);
    } else {
      resolve({response, body});
    }
  });
});