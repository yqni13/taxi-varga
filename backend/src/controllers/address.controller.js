const AddressService = require('../services/address.service');
const checkValidation = require('../middleware/validation.middleware');

class AddressController {
    async getPlaceAutocomplete(req, res, next) {
        checkValidation(req);
        const response = await AddressService.getPlaceAutocomplete(req.body);
        res.send(response);
    }

    async getPlaceDetails(req, res, next) {
        checkValidation(req);
        const response = await AddressService.getPlaceDetails(req.body);
        res.send(response);
    }

    async getPlaceByGeolocation(req, res, next) {
        checkValidation(req);
        const response = await AddressService.getPlaceByGeolocation(req.body);
        res.send(response);
    }
}

module.exports = new AddressController;