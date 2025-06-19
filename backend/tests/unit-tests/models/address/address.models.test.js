const googlePlacesApi = require("../../../../src/services/google-places/google-places.api");
const AddressModel = require('../../../../src/models/address.model');
const MockData_requestPlaceAutocomplete = require('../../mock-data/requestPlaceAutocomplete.mock.json');
const MockData_requestPlaceDetails = require('../../mock-data/requestPlaceDetails.mock.json');

describe('Flatrate tests, priority: getPlaceAutocomplete', () => {

    describe.only('Testing valid fn calls', () => {

        test('Address: gc+wien, lang: de', async () => {
            const mockParam_params = structuredClone(MockData_requestPlaceAutocomplete['gc+wien']['payload']);
            const mockResult = structuredClone(MockData_requestPlaceAutocomplete['gc+wien']['response']);
            const mockAPI = { requestPlaceAutocomplete: jest.fn().mockResolvedValue(mockResult) };

            const model = new AddressModel(mockAPI);
            const testFn = await model.getPlaceAutocomplete(mockParam_params);
            const expectSubObj = { description: "Golf Club Wien, Freudenau, Wien, Österreich" };

            const nestedResult = testFn.placeData.predictions.find(
                response => response.description === expectSubObj.description
            );

            expect(nestedResult).toMatchObject(expectSubObj);
            expect(mockAPI.requestPlaceAutocomplete).toHaveBeenCalled();
        })
    })

    describe.only('Testing invalid fn calls', () => {

        test('Empty params', async () => {
            const mockParam_params = {};

            const model = new AddressModel(googlePlacesApi);
            const testFn = await model.getPlaceAutocomplete(mockParam_params);
            const expectResult = { error: 'no params found' };

            expect(testFn).toMatchObject(expectResult);
        })

        test('Invalid result by language (Austria !== Österreich), address: gc+wien, lang: de', async () => {
            const mockParam_params = structuredClone(MockData_requestPlaceAutocomplete['gc+wien']['payload']);
            const mockResult = structuredClone(MockData_requestPlaceAutocomplete['gc+wien']['response']);
            const mockAPI = { requestPlaceAutocomplete: jest.fn().mockResolvedValue(mockResult) };

            const model = new AddressModel(mockAPI);
            const testFn = await model.getPlaceAutocomplete(mockParam_params);
            const expectSubObj = undefined;

            // TODO(yqni13): no result on response.description === expectSubObj.description
            const nestedResult = testFn.placeData.predictions.find(
                response => response.description.includes("Golf Club Wien, Freudenau, Wien, Austria")
            );

            expect(nestedResult).toBe(expectSubObj);
            expect(mockAPI.requestPlaceAutocomplete).toHaveBeenCalled();
        })
    })
})

describe('Flatrate tests, priority: getPlaceDetails', () => {

    describe.only('Testing valid fn calls', () => {

        test('Address: hilton+schottenring, lang: de', async () => {
            const mockParam_params = structuredClone(MockData_requestPlaceDetails['hilton+schottenring']['payload']);
            const mockResult = structuredClone(MockData_requestPlaceDetails['hilton+schottenring']['response']);
            const mockAPI = { requestPlaceDetails: jest.fn().mockResolvedValue(mockResult) };

            const model = new AddressModel(mockAPI);
            const testFn = await model.getPlaceDetails(mockParam_params);
            const expectSubObj = { formatted_address: 'Schottenring 11, 1010 Wien, Austria' };

            const nestedResult = [testFn.placeData.result].find(
                response => response.formatted_address === expectSubObj.formatted_address
            )

            expect(nestedResult).toMatchObject(expectSubObj);
            expect(mockAPI.requestPlaceDetails).toHaveBeenCalled();
        })
    })

    describe.only('Testing invalid fn calls', () => {

        test('Empty params', async () => {
            const mockParam_params = {};

            const model = new AddressModel(googlePlacesApi);
            const testFn = await model.getPlaceDetails(mockParam_params);
            const expectResult = { error: 'no params found' };

            expect(testFn).toMatchObject(expectResult);
        })
    })
})