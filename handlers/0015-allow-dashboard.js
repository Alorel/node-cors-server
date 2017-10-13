module.exports = (req, res, next) => {
  if (req.originHostname === 'alorel-http-proxy.herokuapp.com') {
    console.log('Returning HTTP 200 for dashboard request');
    return res.status(200).end();
  }

  setImmediate(next);
};