require('dotenv').config();
const Utils = require('../utils/common.utils');

class AddressModel {
    #googlePlaces;
    #googleGeocode;

    constructor(googlePlacesApi, googleGeocodeApi) {
        this.#googlePlaces = googlePlacesApi;
        this.#googleGeocode = googleGeocodeApi;
    }

    async getPlaceAutocomplete(params) {

        const result = await this.#googlePlaces.requestPlaceAutocomplete(params);

        return { placeData: result };
    }

    async getPlaceDetails(params) {

        const result = await this.#googlePlaces.requestPlaceDetails(params);

        return { placeData: result };
    }

    async getPlaceDetailsByGeolocation(params) {

        const result = await this.#googleGeocode.requestGeolocation(params);

        return { placeData: result };
    }
}

module.exports = AddressModel;