module.exports = (req, res, next) => {
    if (!req.query.url) {
        console.log('Url missing');
        res.status(400).end('Please include the url');
    } else if (typeof req.query.url !== 'string') {
        console.log('URL not a string');
        res.status(400).end('Url must be a string');
    } else {
        setImmediate(next);
    }
};