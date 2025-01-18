const express = require('express');
const router = express.Router();
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const addressController = require('../controllers/address.controller');
const { 
    autocompleteSchema,
    placeSchema
} = require('../middleware/validators/addressValidator.middleware');

router.post('/autocomplete', autocompleteSchema, awaitHandlerFactory(addressController.getPlaceAutocomplete));
router.post('/details', placeSchema, awaitHandlerFactory(addressController.getPlaceDetails));

module.exports = router;