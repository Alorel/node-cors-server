const whitelist = require('../config').whitelist.targets;

module.exports = (req, res, next) => {
  if (!req.target.startsWith('http://') && !req.target.startsWith('https://')) {
    return res.endWith(400, `Invalid URL - http(s) prefix missing: ${req.target}`);
  }

  try {
    if (!req.targetHostname) {
      return res.endWith(400, `Failed to parse target ${req.target}`);
    }

    if (!whitelist.includes(req.targetHostname)) {
      return res.status(403).end(`Target ${req.target} not allowed`);
    }

    setImmediate(next);
  } catch (e) {
    res.endWith(500, e);
  }
};