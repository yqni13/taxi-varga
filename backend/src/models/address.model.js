require('dotenv').config();
const Utils = require('../utils/common.utils');

class AddressModel {
    #googlePlaces;
    #googleGeocode;

    constructor(googlePlacesApi, googleGeocodeApi) {
        this.#googlePlaces = googlePlacesApi;
        this.#googleGeocode = googleGeocodeApi;
    }

    getPlaceAutocomplete = async (params) => {
        if(Utils.isObjEmpty(params)) {
            return {error: 'no params found'};
        }

        const result = await this.#googlePlaces.requestPlaceAutocomplete(params);

        return { placeData: result };
    }

    getPlaceDetails = async (params) => {
        if(Utils.isObjEmpty(params)) {
            return {error: 'no params found'};
        }

        const result = await this.#googlePlaces.requestPlaceDetails(params);

        return { placeData: result };
    }

    getPlaceDetailsByGeolocation = async (params) => {
        if(Utils.isObjEmpty(params)) {
            return { error: 'no params found' };
        }

        const result = await this.#googleGeocode.requestGeolocation(params);

        return { placeData: result };
    }
}

module.exports = AddressModel;