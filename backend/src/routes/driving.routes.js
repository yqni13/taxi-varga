const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const maintain = require('../middleware/maintenance.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const drivingController = require('../controllers/driving.controller');
const { 
    drivingAirportSchema,
    drivingDestinationSchema,
    drivingFlatrateSchema,
    drivingGolfSchema,
    drivingQuickSchema
} = require('../middleware/validators/drivingValidator.middleware');

router.post('/airport', maintain(), auth(), drivingAirportSchema, awaitHandlerFactory(drivingController.calcDrivingAirport));
router.post('/destination', maintain(), auth(), drivingDestinationSchema, awaitHandlerFactory(drivingController.calcDrivingDestination));
router.post('/flatrate', maintain(), auth(), drivingFlatrateSchema, awaitHandlerFactory(drivingController.calcDrivingFlatrate));
router.post('/golf', maintain(), auth(), drivingGolfSchema, awaitHandlerFactory(drivingController.calcDrivingGolf));
router.post('/quick', maintain(), auth(), drivingQuickSchema, awaitHandlerFactory(drivingController.calcDrivingQuick));

module.exports = router;