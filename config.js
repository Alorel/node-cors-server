const {parse} = require('yamljs');
const {readFileSync} = require('fs');
const {join} = require('path');
const reduce = require('lodash/reduce');
const get = require('lodash/get');
const merge = require('lodash/merge');

const defaults = {
  whitelist: {
    origins: [],
    targets: []
  },
  blank_response_origins: [],
  headers: {}
};

const contents = merge(defaults, parse(readFileSync(join(__dirname, 'config.yml'), 'utf8')));
let key;

contents.headers = reduce(contents.headers, (acc, value, key) => {
  acc.push([key, value]);
  return acc;
}, []);

if ((key = get(contents, 'env.whitelist.origins')) && process.env[key]) {
  contents.whitelist.origins.push(...JSON.parse(process.env[key]));
}

if ((key = get(contents, 'env.whitelist.targets')) && process.env[key]) {
  contents.whitelist.targets.push(...JSON.parse(process.env[key]));
}

delete contents.hidden_env;

module.exports = Object.freeze(contents);