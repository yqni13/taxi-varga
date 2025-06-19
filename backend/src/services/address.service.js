const { basicResponse } = require('../utils/common.utils');
const AddressModel = require('../models/address.model');
const GooglePlaces = require('../services/google-places/google-places.api');

class AddressService {
    getList = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const model = new AddressModel(GooglePlaces);
        const result = await model.getPlaceAutocomplete(hasParams ? params : {});
        return basicResponse(result, 1, "Success");
    }

    getDetails = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const model = new AddressModel(GooglePlaces);
        const result = await model.getPlaceDetails(hasParams ? params : {});
        return basicResponse(result, 1, "Success");
    }
}

module.exports = new AddressService;