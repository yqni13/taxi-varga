const axios = require('axios');
const Secrets = require('../../utils/secrets.utils');
const Utils = require('../../utils/common.utils');

class GoogleGeocodeAPI {
    #env_GOOGLE_API_KEY;

    constructor() {
        this.#env_GOOGLE_API_KEY = Secrets.GOOGLE_API_KEY;
    }

    async requestGeolocation(params) {
        const lat = params['latitude'];
        const lng = params['longitude'];

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.#env_GOOGLE_API_KEY}`;

        let result = {};
        await axios.get(url)
            .then(response => {
                result = response.data;
            })
            .catch(error => {
                console.log("google error: ", error.message);
                return error.message;
            })
        
        if(!Utils.isObjEmpty(result)) {
            for(var i = 0; i < result.results.length; i++) {
                if(!result.results[i].formatted_address.includes('Straße Ohne Straßennamen')) {
                    return result.results[i];
                }
            }
        }

        return {};
    }
}

module.exports = new GoogleGeocodeAPI;