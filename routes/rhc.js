const express = require('express');
const router = express.Router();
const sysInfo = require('../lib/sys-info');
const config = require('../config.json');

router.get('/health', (req, res) => {
    res.write("1");
    res.end();
});

const applyHeader = res => {
    res.header('Cache-Control', 'no-cache, no-store');
};

if (config.endpoints.poll) {
    router.get('/info/poll', (req, res) => {
        applyHeader(res);
        res.json(sysInfo.poll());
    });
}

if (config.endpoints.gen) {
    router.get('/info/gen', (req, res) => {
        applyHeader(res);
        res.json(sysInfo.gen);
    });
}

module.exports = router;