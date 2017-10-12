require('express/lib/response').endWith = function (code, message) {
  const method = code >= 500 ? 'error' : 'log';

  this.status(code);

  if (message instanceof Error) {
    console[method](message);
    this.end(message.message);
  } else {
    console[method](`[${code}] ${message}`);
    this.end(message);
  }
};
