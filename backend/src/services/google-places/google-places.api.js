require('dotenv').config();
const axios = require('axios');
const Utils = require('../../utils/common.utils');

class GooglePlacesAPI {
    requestPlaceAutocomplete = async (params) => {
        const searchText = Utils.formatRequestStringNoPlus(params['address']);
        const lang = params['language'];
        const token = params['sessiontoken'];

        // Vienna center
        const centerLatitude = '48.208775';
        const centerLongitude = '16.372540';
        const location = `${centerLatitude}$2C${centerLongitude}`;

        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchText}&language=${lang}&location=${location}&sessiontoken=${token}&radius=50000&key=${process.env.GOOGLE_API_KEY}`;

        let result;
        await axios.get(url)
            .then(response => {
                result = response.data;
            })
            .catch(error => {
                console.log('google place autocomplete error: ', error.message);
                result = error;
            })

        return result;
    }

    requestPlaceDetails = async (params) => {
        const id = params['placeId'];
        const lang = params['language'];
        const token = params['sessiontoken'];

        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&language=${lang}&sessiontoken=${token}&key=${process.env.GOOGLE_API_KEY}`;

        let result;
        await axios.get(url)
            .then(response => {
                result = response.data;
            })
            .catch(error => {
                console.log('google place details error: ', error.message);
                result = error;
            })

        return result;
    }
}

module.exports = new GooglePlacesAPI;