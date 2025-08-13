const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const metaController = require('../controllers/meta.controller');

router.get('/info/:key', auth(true), awaitHandlerFactory(metaController.getInfo));

module.exports = router;