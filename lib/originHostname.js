const req = require('express/lib/request');
const {URL} = require('url');

Object.defineProperty(req, 'originHostname', {
  get() {
    const value = this.origin ? new URL(this.origin).hostname : null;

    Object.defineProperty(this, 'originHostname', {value});

    return value;
  }
});
