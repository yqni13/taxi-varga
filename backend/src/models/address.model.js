require('dotenv').config();

class AddressModel {
    #googlePlaces;

    constructor(googlePlacesApi) {
        this.#googlePlaces = googlePlacesApi;
    }

    getPlaceAutocomplete = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const result = await this.#googlePlaces.requestPlaceAutocomplete(params);

        return { placeData: result };
    }

    getPlaceDetails = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const result = await this.#googlePlaces.requestPlaceDetails(params);

        return { placeData: result };
    }
}

module.exports = AddressModel;