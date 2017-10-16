const blankResponseOrigins = require('../config').blank_response_origins;

module.exports = {
  match: '*',
  handler(req, res, next) {
    if (blankResponseOrigins.includes(req.originHostname)) {
      console.info(`Returning blank 204 response for origin ${req.origin}`);
      return res.status(204).end();
    }

    setImmediate(next);
  }
};