const axios = require('axios');
const Secrets = require('../../utils/secrets.utils');
const Utils = require('../../utils/common.utils');
const { UnexpectedApiResponseException } = require('../../utils/exceptions/api.exception');

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
            .catch(err => {
                const message = 'ERROR ON API REQUEST';
                const method = 'TAVA_GoogleApi_requestGeolocation';
                Utils.logError(message, method, err);
                throw new UnexpectedApiResponseException(err);
            })
        
        if(!Utils.isObjEmpty(result)) {
            for(var i = 0; i < result.results.length; i++) {
                // Hardcoded german condition due to target group and location (Austria only).
                if(!result.results[i].formatted_address.includes('Straße Ohne Straßennamen')) {
                    return result.results[i];
                }
            }
        }

        return {};
    }
}

module.exports = new GoogleGeocodeAPI;