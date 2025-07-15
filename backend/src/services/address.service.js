const { basicResponse } = require('../utils/common.utils');
const AddressModel = require('../models/address.model');
const GooglePlaces = require('../services/google-places/google-places.api');
const GoogleGeocode = require('../services/google-geocode/google-geocode.api');
const Utils = require('../utils/common.utils');

class AddressService {
    getPlaceAutocomplete = async (params) => {
        const hasParams = Utils.isObjEmpty(params)
        const addressModel = new AddressModel(GooglePlaces, GoogleGeocode);
        const result = await addressModel.getPlaceAutocomplete(hasParams ? {} : params);
        return basicResponse(result, 1, "Success");
    }

    getPlaceDetails = async (params) => {
        const hasParams = Utils.isObjEmpty(params)
        const addressModel = new AddressModel(GooglePlaces, GoogleGeocode);
        const result = await addressModel.getPlaceDetails(hasParams ? {} : params);
        return basicResponse(result, 1, "Success");
    }

    getPlaceByGeolocation = async (params) => {
        const hasParams = Utils.isObjEmpty(params);
        const addressModel = new AddressModel(GooglePlaces, GoogleGeocode);
        const result = await addressModel.getPlaceDetailsByGeolocation(hasParams ? {} : params);
        return basicResponse(result, 1, "Success");
    }
}

module.exports = new AddressService;