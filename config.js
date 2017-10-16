const {parse} = require('yamljs');
const {readFileSync} = require('fs');
const {join} = require('path');
const reduce = require('lodash/reduce');

const contents = parse(readFileSync(join(__dirname, 'config.yml'), 'utf8'));

contents.headers = reduce(contents.headers, (acc, value, key) => {
  acc.push([key, value]);
  return acc;
}, []);

if (process.env.ADDITIONAL_WHITELIST_ORIGINS) {
  contents.whitelist.origins.push(...JSON.parse(process.env.ADDITIONAL_WHITELIST_ORIGINS));
}

if (process.env.ADDITIONAL_WHITELIST_TARGETS) {
  contents.whitelist.targets.push(...JSON.parse(process.env.ADDITIONAL_WHITELIST_TARGETS));
}

module.exports = contents;