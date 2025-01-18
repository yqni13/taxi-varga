const AddressService = require('../services/address.service');
const { checkValidation } = require('../middleware/validation.middleware');

class AddressController {
    getPlaceAutocomplete = async (req, res, next) => {
        checkValidation(req);
        const response = await AddressService.getList(req.body);
        res.send(response);
    }

    getPlaceDetails = async (req, res, next) => {
        checkValidation(req);
        const response = await AddressService.getDetails(req.body);
        res.send(response);
    }
}

module.exports = new AddressController;