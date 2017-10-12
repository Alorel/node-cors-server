const req = require('express/lib/request');

Object.defineProperty(req, 'target', {
  get() {
    let value = this.query.url;

    if (typeof value === 'string') {
      value = value.toLowerCase();
    }

    Object.defineProperty(this, 'target', {value});

    return value;
  }
});
