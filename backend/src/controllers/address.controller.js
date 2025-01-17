const AddressService = require('../services/address.service');
const { checkValidation } = require('../middleware/validation.middleware');

class AddressController {
    getAutocompletePlaces = async (req, res, next) => {
        checkValidation(req);
        const response = await AddressService.getAutocompletePlaces(req.body);
        res.send(response);
    }

    getPlace = async (req, res, next) => {
        checkValidation(req);
        const response = await AddressService.getPlace(req.body);
        res.send(response);
    }
}

module.exports = new AddressController;