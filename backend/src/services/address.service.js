const { basicResponse } = require('../utils/common.utils');
const AddressModel = require('../models/address.model');

class AddressService {
    getAutocompletePlaces = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const result = await AddressModel.getListOfPlaces(hasParams ? params : {});
        return basicResponse(result, 1, "Success");
    }

    getPlace = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const result = await AddressModel.getSinglePlace(hasParams ? params : {});
        return basicResponse(result, 1, "Success");
    }
}

module.exports = new AddressService;