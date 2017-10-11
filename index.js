const express = require('express');
const app = express();
const request = require('request');

app.set('port', (process.env.PORT || 5000));

app.get('/', require('./handlers/set-headers'));
app.get('/', require('./handlers/filter-origin'));
app.get('/', require('./handlers/filter-querystring'));
app.get('/', require('./handlers/filter-target'));

app.get('/', (req, res) => {
  req.pipe(request(req.query.url))
      .pipe(res);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
