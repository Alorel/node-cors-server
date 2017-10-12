const req = require('express/lib/request');
const {URL} = require('url');

Object.defineProperty(req, 'targetHostname', {
  get() {
    const value = this.target ? new URL(this.target).hostname : null;

    Object.defineProperty(this, 'targetHostname', {value});

    return value;
  }
});
