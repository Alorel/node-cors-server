const express = require('express');
const router = express.Router();
const sysInfo = require('../lib/sys-info');

const info = (type, res) => {
    res.header('Cache-Control', 'no-cache, no-store');
    res.json(sysInfo[type]());
};

router.get('/health', (req, res, next) => {
    res.write("1");
    res.end();
});
router.get('/info/gen', (req, res, next) => {
    info('gen', res);
});
router.get('/info/poll', (req, res, next) => {
    info('poll', res);
});

module.exports = router;