const {parse} = require('yamljs');
const {readFileSync} = require('fs');
const {join} = require('path');
const reduce = require('lodash/reduce');

const contents = parse(readFileSync(join(__dirname, 'config.yml'), 'utf8'));

contents.headers = reduce(contents.headers, (acc, value, key) => {
    acc.push([key, value]);
    return acc;
}, []);

module.exports = contents;