module.exports = (req, res, next) => {
    if ("GET" !== req.method) {
        res.status(405);
        res.write("Only GET requests permitted");
        res.end();
    } else {
        setImmediate(next);
    }
};