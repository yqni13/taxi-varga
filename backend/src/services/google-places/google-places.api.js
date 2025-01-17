require('dotenv').config();
const axios = require('axios');
const Utils = require('../../utils/common.utils');

class GooglePlacesAPI {
    requestAutocompletePlacesOld = async (params) => {
        const searchText = params['address'];
        const lang = params['language'];

        // Vienna center
        const centerLatitude = '48.208775';
        const centerLongitude = '16.372540';
        const location = `${centerLatitude}$2C${centerLongitude}`;

        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchText}&language=${lang}&location=${location}&radius=50000&key=${process.env.GOOGLE_API_KEY}`;

        let result;
        await axios.get(url)
            .then(response => {
                result = response.data;
            })
            .catch(error => {
                console.log('google place autocomplete old error: ', error.message);
                result = error;
            })

        return result;
    }

    requestPlace = async (params) => {
        
    }
}

module.exports = new GooglePlacesAPI;