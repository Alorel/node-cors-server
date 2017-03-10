const express = require('express');
const router = express.Router();
const request = require('request');

const addHeaders = (res,headers) => {
  const keys = Object.keys(headers);
  for (let k of keys) {
    res.header(k,headers[k]);
  }
};
const headers = {
  html: {
    'Content-Security-Policy': "frame-ancestors 'none'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'deny',
    'Access-Control-Allow-Credentials': false,
    'X-XSS-Protection': '1; mode=block'
  },
  cors: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET'
  }
};

router.get('/', (req, res, next) => {
  addHeaders(res, headers.html);
  if ('url' in req.query) {
    addHeaders(res, headers.cors);
    req.pipe(request(req.query.url)).pipe(res);
  } else {
    res.render('index', { title: 'Cors Proxy' });
  }
});

module.exports = router;
