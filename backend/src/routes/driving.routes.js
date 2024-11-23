const express = require('express');
const router = express.Router();
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const drivingController = require('../controllers/driving.controller');
const { 
    drivingDestinationSchema,
    drivingFlatrateSchema,
    drivingAirportSchema
} = require('../middleware/validators/drivingValidator.middleware');

router.post('/airport', drivingAirportSchema, awaitHandlerFactory(drivingController.calcDrivingAirport));
router.post('/destination', drivingDestinationSchema, awaitHandlerFactory(drivingController.calcDrivingDestination));
router.post('/flatrate', drivingFlatrateSchema, awaitHandlerFactory(drivingController.calcDrivingFlatrate));

module.exports = router;