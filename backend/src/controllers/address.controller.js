const AddressService = require('../services/address.service');
const checkValidation = require('../middleware/validation.middleware');

class AddressController {
    async getPlaceAutocomplete(req, res, next) {
        try {
            checkValidation(req);
            const response = await AddressService.getPlaceAutocompleteByApi(req.body);
            res.send(response);
        } catch(err) {
            next(err);
        }
    }

    async getPlaceDetails(req, res, next) {
        try {
            checkValidation(req);
            const response = await AddressService.getPlaceDetailsByApi(req.body);
            res.send(response);
        } catch(err) {
            next(err);
        }
    }

    async getPlaceByGeolocation(req, res, next) {
        try {
            checkValidation(req);
            const response = await AddressService.getPlaceByGeolocationByApi(req.body);
            res.send(response);
        } catch(err) {
            next(err);
        }
    }
}

module.exports = new AddressController;