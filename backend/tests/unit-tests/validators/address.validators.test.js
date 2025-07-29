const CustomValidators = require('../../../src/utils/customValidator.utils');
const MockData_places = require('../../mock-data/places.mock.json');

describe('CustomValidator tests, priority: ADDRESS', () => {

    describe('Testing valid fn calls', () => {

        test('fn: validatePlaceDetails', () => {
            const mockParam_address = MockData_places['place-1010#1']['simple'];
            const mockParam_details = MockData_places['place-1010#1']['details'];
            const testFn = CustomValidators.validatePlaceDetails(
                mockParam_address,
                mockParam_details
            );
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: validateQuickOrigin', () => {
            const mockParam_details = MockData_places['place-1220#1']['details'];
            const testFn = CustomValidators.validateQuickOrigin(mockParam_details);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: validateZipCodeExist', () => {
            const mockParam_details = MockData_places['place-1010#1']['details'];
            const testFn = CustomValidators.validateZipCodeExist(mockParam_details);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('fn: validatePlaceDetails, params: <details> = null', () => {
            const mockParam_address = 'test';
            const mockParam_details = null;
            const expectResult = 'address-invalid-place';

            expect(() => {
                CustomValidators.validatePlaceDetails(
                    mockParam_address,
                    mockParam_details
                )
            }).toThrow(expectResult);
        })

        test('fn: validateQuickOrigin', () => {
            const mockParam_details = MockData_places['place-2542#1']['details'];
            const expectResult = 'address-quick-invalid-origin';

            expect(() => {
                CustomValidators.validateQuickOrigin(mockParam_details)
            }).toThrow(expectResult);
        })

        test('fn: validateZipCodeExist', () => {
            const mockParam_details = MockData_places['place-1010#1']['details'];
            delete mockParam_details['zipCode'];
            const expectResult = 'backend-missing-zipCode';

            expect(() => {
                CustomValidators.validateZipCodeExist(mockParam_details)
            }).toThrow(expectResult);
        })
    })
})