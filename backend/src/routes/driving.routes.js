const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const drivingController = require('../controllers/driving.controller');
const { 
    drivingAirportSchema,
    drivingDestinationSchema,
    drivingFlatrateSchema,
    drivingGolfSchema
} = require('../middleware/validators/drivingValidator.middleware');

router.post('/airport', auth(), drivingAirportSchema, awaitHandlerFactory(drivingController.calcDrivingAirport));
router.post('/destination', auth(), drivingDestinationSchema, awaitHandlerFactory(drivingController.calcDrivingDestination));
router.post('/flatrate', auth(), drivingFlatrateSchema, awaitHandlerFactory(drivingController.calcDrivingFlatrate));
router.post('/golf', auth(), drivingGolfSchema, awaitHandlerFactory(drivingController.calcDrivingGolf));

module.exports = router;