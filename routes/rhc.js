const express = require('express');
const router = express.Router();
const sysInfo = require('../lib/sys-info');

router.get('/health', (req, res) => {
    res.write("1");
    res.end();
});
router.get('/info/:type', (req, res) => {
    res.header('Cache-Control', 'no-cache, no-store');
    res.json(req.params.type === 'gen' ? sysInfo.gen : sysInfo.poll());
});

module.exports = router;