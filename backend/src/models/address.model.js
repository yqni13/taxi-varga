require('dotenv').config();
const GooglePlaces = require('../services/google-places/google-places.api');

class AddressModel {
    getPlaceAutocomplete = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const result = await GooglePlaces.requestPlaceAutocomplete(params);

        return { placeData: result };
    }

    getPlaceDetails = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }
        
        const result = await GooglePlaces.requestPlaceDetails(params);

        return { placeData: result };
    }
}

module.exports = new AddressModel;