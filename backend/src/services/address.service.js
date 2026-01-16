const { basicResponse } = require('../utils/common.utils');
const AddressModel = require('../models/address.model');
const GooglePlaces = require('../services/google-places/google-places.api');
const GoogleGeocode = require('../services/google-geocode/google-geocode.api');

class AddressService {
    async getPlaceAutocomplete(params) {
        const addressModel = new AddressModel(GooglePlaces, GoogleGeocode);
        return basicResponse(result, 1, "Success");
    }

    async getPlaceDetails(params) {
        const addressModel = new AddressModel(GooglePlaces, GoogleGeocode);
        return basicResponse(result, 1, "Success");
    }

    async getPlaceByGeolocation(params) {
        const addressModel = new AddressModel(GooglePlaces, GoogleGeocode);
        return basicResponse(result, 1, "Success");
    }
}

module.exports = new AddressService;