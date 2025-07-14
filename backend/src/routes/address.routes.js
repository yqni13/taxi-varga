const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const addressController = require('../controllers/address.controller');
const { 
    autocompleteSchema,
    placeSchema,
    geocodeSchema
} = require('../middleware/validators/addressValidator.middleware');


router.post('/autocomplete', auth(), autocompleteSchema, awaitHandlerFactory(addressController.getPlaceAutocomplete));
router.post('/details', auth(), placeSchema, awaitHandlerFactory(addressController.getPlaceDetails));
router.post('/geocode', auth(), geocodeSchema, awaitHandlerFactory(addressController.getPlaceByGeolocation));

module.exports = router;