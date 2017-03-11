const stats = require('./stats');

module.exports = (req, res, next) => {
    if ("GET" !== req.method) {
        stats.rejected++;
        res.status(405);
        res.write("Only GET requests permitted");
        res.end();
    } else {
        setImmediate(next);
    }
};