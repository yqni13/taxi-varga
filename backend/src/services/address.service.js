const { basicResponse } = require('../utils/common.utils');
const AddressModel = require('../models/address.model');
const GooglePlaces = require('../services/google-places/google-places.api');
const GoogleGeocode = require('../services/google-geocode/google-geocode.api');

class AddressService {
    async getPlaceAutocompleteByApi(params) {
        const addressModel = new AddressModel(GooglePlaces, GoogleGeocode);
        const result = await addressModel.mapPlaceAutocompleteApiResult(params);
        return basicResponse(result, 1, "Success");
    }

    async getPlaceDetailsByApi(params) {
        const addressModel = new AddressModel(GooglePlaces, GoogleGeocode);
        const result = await addressModel.mapPlaceDetailsApiResult(params);
        return basicResponse(result, 1, "Success");
    }

    async getPlaceByGeolocationByApi(params) {
        const addressModel = new AddressModel(GooglePlaces, GoogleGeocode);
        const result = await addressModel.mapPlaceDetailsByGeolocationApiResult(params);
        return basicResponse(result, 1, "Success");
    }
}

module.exports = new AddressService;