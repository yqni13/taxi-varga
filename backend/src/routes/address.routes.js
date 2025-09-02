const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const maintain = require('../middleware/maintenance.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const addressController = require('../controllers/address.controller');
const { 
    autocompleteSchema,
    placeSchema,
    geocodeSchema
} = require('../middleware/validators/addressValidator.middleware');


router.post('/autocomplete', maintain(), auth(), autocompleteSchema, awaitHandlerFactory(addressController.getPlaceAutocomplete));
router.post('/details', maintain(), auth(), placeSchema, awaitHandlerFactory(addressController.getPlaceDetails));
router.post('/geocode', maintain(), auth(), geocodeSchema, awaitHandlerFactory(addressController.getPlaceByGeolocation));

module.exports = router;