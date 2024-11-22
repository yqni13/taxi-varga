const express = require('express');
const router = express.Router();
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const drivingController = require('../controllers/driving.controller');
const { calcDrivingSchema } = require('../middleware/validators/drivingValidator.middleware');

router.post('/', calcDrivingSchema, awaitHandlerFactory(drivingController.getCalculation));

module.exports = router;