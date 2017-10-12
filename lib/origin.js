const req = require('express/lib/request');

Object.defineProperty(req, 'origin', {
  get() {
    let value = this.header('origin') || this.header('referer');

    if (value) {
      value = value.toLowerCase();
    }

    Object.defineProperty(this, 'origin', {value});
    return value;
  }
});
