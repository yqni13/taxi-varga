require('dotenv').config();
const axios = require('axios');
const Utils = require('../../utils/common.utils');
const Secrets = require('../../utils/secrets.utils');
const { AddressFilterOption } = require('../../utils/enums/addressfilter-option.enum');

class GooglePlacesAPI {
    #env_GOOGLE_API_KEY;

    constructor() {
        this.#env_GOOGLE_API_KEY = Secrets.GOOGLE_API_KEY;
    }

    _getAutocompleteRequestHeader() {
        return {
            'Content-Type': 'application/json',
            'X-Goog-FieldMask': 'suggestions.placePrediction',
            'X-Goog-Api-Key': this.#env_GOOGLE_API_KEY
        }
    }

    _getDetailsRequestHeader() {
        return {
            'Content-Type': 'application/json',
            'X-Goog-FieldMask': 'id,addressComponents,formattedAddress,postalAddress',  
            'X-Goog-Api-Key': this.#env_GOOGLE_API_KEY
        }
    }

    _getAutocompleteRequestURL() {
        return 'https://places.googleapis.com/v1/places:autocomplete';
    }

    _getDetailsRequestURL() {
        return 'https://places.googleapis.com/v1/places/';
    }

    async requestPlaceDetails(params) {
        const id = params['placeId'];
        const lang = params['language'];
        const token = params['sessionToken'] ? params['sessionToken'] : null;

        const headers = this._getDetailsRequestHeader();
        let url = this._getDetailsRequestURL() + `${id}?languageCode=${lang}`;
        url += token ? `&sessionToken=${token}` : '';

        let result;
        await axios.get(url, { headers })
            .then(response => {
                result = response.data;
            })
            .catch(error => {
                console.log("google place details error: ", error.message);
                result = error;
            })

        return result;
    }

    async requestPlaceAutocomplete(params) {
        const headers = this._getAutocompleteRequestHeader();
        const url = this._getAutocompleteRequestURL();

        const searchText = Utils.formatRequestStringNoPlus(params['address']);
        const lang = params['language'];
        const token = params['sessionToken'];

        // Vienna as central search factor.
        const centerLatitude = 48.208775;
        const centerLongitude = 16.372540;

        let payload = {
            "sessionToken": token,
            "languageCode": lang,
            "locationBias": {
                "circle": {
                    "center": {
                        "latitude": centerLatitude,
                        "longitude": centerLongitude
                    },
                    "radius": 500.0
                }
            },
            "input": searchText
        };

        payload = this._transformAutocompletePayload(payload, params);

        let result;
        await axios.post(url, payload, { headers })
            .then(response => {
                result = response.data;
            })
            .catch(error => {
                console.log("google place autocomplete error: ", error.message);
                result = error;
            })

        return result;
    }

    _transformAutocompletePayload(result, params) {
        if(params['filter'] === AddressFilterOption.GOLF) {
            Object.assign(result, { "includedPrimaryTypes": ["golf_course", "sports_club", "hotel", "athletic_field"]});
        }

        return result;
    }
}

module.exports = new GooglePlacesAPI;