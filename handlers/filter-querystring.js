module.exports = (req, res, next) => {
    if (!req.query.url) {
        res.status(400).end('Please include the url');
    } else if (typeof req.query.url !== 'string') {
        res.status(400).end('Url must be a string');
    } else {
        setImmediate(next);
    }
};