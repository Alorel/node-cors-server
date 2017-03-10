module.exports = (req, res, next) => {
    if ("GET" !== req.method) {
        res.status(400);
        res.end();
    } else {
        next();
    }
};