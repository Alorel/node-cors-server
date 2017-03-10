module.exports = (req, res, next) => {
    if ("GET" !== req.method) {
        const err = new Error("Only GET requests are permitted");
        err.status = 400;
        next(err);
    }
    next();
};