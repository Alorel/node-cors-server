module.exports = (req, res, next) => {
  try {
    if (!req.origin) {
      return res.endWith(400, 'Could not determine origin');
    }

    if (!req.originHostname) {
      return res.endWith(400, `Failed to parse origin ${req.originHostname}`);
    }

    setImmediate(next);
  } catch (e) {
    res.endWith(500, e);
  }
};