const express = require('express');
const router = express.Router();

router.get('', async (req, res) => {
    res.send('taxi-varga api active!')
});

module.exports = router;