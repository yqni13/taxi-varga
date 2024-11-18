const express = require('express');
const router = express.Router();
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const calcAtoBController = require('../controllers/calcAtoB.controller');

router.get('/', awaitHandlerFactory(calcAtoBController.getCalculation));

module.exports = router;