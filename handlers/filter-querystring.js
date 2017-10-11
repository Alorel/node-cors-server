module.exports = (req, res, next) => {
    if (!req.query.url) {
        res.status(400).end(`Please include the url`);
    } else {
        setImmediate(next);
    }
};