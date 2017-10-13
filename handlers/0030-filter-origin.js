const whitelist = require('../config').whitelist.origins;

module.exports = (req, res, next) => {
  if (!whitelist.includes(req.originHostname)) {
    return res.endWith(403, `Origin ${req.origin} not allowed.`);
  }

  console.log(`Origin filter passed for ${req.origin}`);
  res.header('Access-Control-Allow-Origin', '*');
  setImmediate(next);
};