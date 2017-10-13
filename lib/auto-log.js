const res = require('express/lib/response');

const originalStatus = res.status;
const originalHeader = res.header;
const originalEnd = res.end;

res.end = function() {
  console.debug('Ending response handling');
  return originalEnd.apply(this, arguments);
};

res.status = function (status) {
  console.debug(`Set HTTP status to ${status}`);
  return originalStatus.apply(this, arguments);
};

res.header = function (k, v) {
  console.debug(`Set HTTP header "${k}" to "${v}"`);
  return originalHeader.apply(this, arguments);
};
