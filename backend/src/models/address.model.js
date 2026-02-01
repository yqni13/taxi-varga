class AddressModel {
    #googlePlaces;
    #googleGeocode;

    constructor(googlePlacesApi, googleGeocodeApi) {
        this.#googlePlaces = googlePlacesApi;
        this.#googleGeocode = googleGeocodeApi;
    }

    async mapPlaceAutocompleteApiResult(params) {
        const result = await this.#googlePlaces.requestPlaceAutocomplete(params);
        return { placeData: result };
    }

    async mapPlaceDetailsApiResult(params) {
        const result = await this.#googlePlaces.requestPlaceDetails(params);
        return { placeData: result };
    }

    async mapPlaceDetailsByGeolocationApiResult(params) {
        const result = await this.#googleGeocode.requestGeolocation(params);
        return { placeData: result };
    }
}

module.exports = AddressModel;