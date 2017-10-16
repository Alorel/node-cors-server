module.exports = {
  match: '/',
  handler(req, res, next) {
    if (!req.target) {
      res.endWith(400, 'Please include the url');
    } else if (typeof req.target !== 'string') {
      res.endWith(400, 'Url must be a string');
    } else {
      setImmediate(next);
    }
  }
};