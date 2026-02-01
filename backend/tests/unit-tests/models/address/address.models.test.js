const googlePlacesApi = require("../../../../src/services/google-places/google-places.api");
const googleGeocodeApi = require("../../../../src/services/google-geocode/google-geocode.api");
const AddressModel = require('../../../../src/models/address.model');
const MockData_requestPlaceAutocomplete = require('../../../mock-data/requestPlaceAutocomplete.mock.json');
const MockData_requestPlaceDetails = require('../../../mock-data/requestPlaceDetails.mock.json');
const MockData_placeDetailsByGeolocation = require('../../../mock-data/requestPlaceDetailsByGeolocation.mock.json');

describe('Address tests, priority: mapPlaceAutocompleteApiResult', () => {

    describe('Testing valid fn calls', () => {

        test('Address: gc+wien, lang: de', async () => {
            const mockParam_params = structuredClone(MockData_requestPlaceAutocomplete['gc+wien']['payload']);
            const mockResult = structuredClone(MockData_requestPlaceAutocomplete['gc+wien']['response']);
            const mockAPI = { requestPlaceAutocomplete: jest.fn().mockResolvedValue(mockResult) };

            const addressModel = new AddressModel(mockAPI, googleGeocodeApi);
            const testFn = await addressModel.mapPlaceAutocompleteApiResult(mockParam_params);
            const expectSubObj = { description: "Golf Club Wien, Freudenau, Wien, Österreich" };

            const nestedResult = testFn.placeData.predictions.find(
                response => response.description === expectSubObj.description
            );

            expect(nestedResult).toMatchObject(expectSubObj);
            expect(mockAPI.requestPlaceAutocomplete).toHaveBeenCalled();
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Invalid result by <language> (Austria !== Österreich), address: gc+wien, lang: de', async () => {
            const mockParam_params = structuredClone(MockData_requestPlaceAutocomplete['gc+wien']['payload']);
            const mockResult = structuredClone(MockData_requestPlaceAutocomplete['gc+wien']['response']);
            const mockAPI = { requestPlaceAutocomplete: jest.fn().mockResolvedValue(mockResult) };

            const addressModel = new AddressModel(mockAPI, googleGeocodeApi);
            const testFn = await addressModel.mapPlaceAutocompleteApiResult(mockParam_params);
            const expectSubObj = undefined;

            const nestedResult = testFn.placeData.predictions.find(
                response => response.description === "Golf Club Wien, Freudenau, Wien, Austria"
            );

            expect(nestedResult).toBe(expectSubObj);
            expect(mockAPI.requestPlaceAutocomplete).toHaveBeenCalled();
        })
    })
})

describe('Address tests, priority: mapPlaceDetailsApiResult', () => {

    describe('Testing valid fn calls', () => {

        test('Address: hilton+schottenring, lang: de', async () => {
            const mockParam_params = structuredClone(MockData_requestPlaceDetails['hilton+schottenring']['payload']);
            const mockResult = structuredClone(MockData_requestPlaceDetails['hilton+schottenring']['response']);
            const mockAPI = { requestPlaceDetails: jest.fn().mockResolvedValue(mockResult) };

            const addressModel = new AddressModel(mockAPI, googleGeocodeApi);
            const testFn = await addressModel.mapPlaceDetailsApiResult(mockParam_params);
            const expectSubObj = { formatted_address: 'Schottenring 11, 1010 Wien, Austria' };

            const nestedResult = [testFn.placeData.result].find(
                response => response.formatted_address === expectSubObj.formatted_address
            )

            expect(nestedResult).toMatchObject(expectSubObj);
            expect(mockAPI.requestPlaceDetails).toHaveBeenCalled();
        })
    })
})

describe('Address tests, priority: mapPlaceDetailsByGeolocationApiResult', () => {

    describe('Testing valid fn calls', () => {

        test('Address: orther+inseln, lang: de', async () => {
            const mockParam_params = structuredClone(MockData_placeDetailsByGeolocation['orther+inseln']['payload']);
            const mockResult = structuredClone(MockData_placeDetailsByGeolocation['orther+inseln']['response']);
            const mockAPI = { requestGeolocation: jest.fn().mockResolvedValue(mockResult) };

            const addressModel = new AddressModel(googlePlacesApi, mockAPI);
            const testFn = await addressModel.mapPlaceDetailsByGeolocationApiResult(mockParam_params);
            const expectSubObj = 'Uferstraße 17, 2304 Orth an der Donau, Austria';

            expect(testFn.placeData.formatted_address).toBe(expectSubObj);
            expect(mockAPI.requestGeolocation).toHaveBeenCalled();
        })
    })
})