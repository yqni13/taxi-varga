const { basicResponse } = require('../utils/common.utils');
const AddressModel = require('../models/address.model');

class AddressService {
    getList = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const result = await AddressModel.getPlaceAutocomplete(hasParams ? params : {});
        return basicResponse(result, 1, "Success");
    }

    getDetails = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const result = await AddressModel.getPlaceDetails(hasParams ? params : {});
        return basicResponse(result, 1, "Success");
    }
}

module.exports = new AddressService;