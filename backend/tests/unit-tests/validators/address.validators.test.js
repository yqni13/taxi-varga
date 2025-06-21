const CustomValidators = require('../../../src/utils/customValidator.utils');
const { LanguageOption } = require('../../../src/utils/enums/lang-option.enum');
const MockData_places = require('../mock-data/places.mock.json');

describe('CustomValidator tests, priority: ADDRESS', () => {

    describe.only('Testing valid fn calls', () => {

        test('fn: validateLanguageCompatible', () => {
            const mockParam_language = LanguageOption;
            const expectResult = true;
            Object.values(mockParam_language).forEach((option) => {
                expect(CustomValidators.validateLanguageCompatible(option)).toBe(expectResult);
            })
        })

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
    })

    describe.only('Testing invalid fn calls', () => {

        test('fn: validateLanguageCompatible, param: false value', () => {
            const mockParam_language = { DE: 'fr' };
            const expectResult = 'backend-invalid-language';

            expect(() => {
                CustomValidators.validateLanguageCompatible(mockParam_language);
            }).toThrow(expectResult);
        })

        test('fn: validateLanguageCompatible, param: false key', () => {
            const mockParam_language = { FR: 'fr' };
            const expectResult = 'backend-invalid-language';
            
            expect(() => {
                CustomValidators.validateLanguageCompatible(mockParam_language);
            }).toThrow(expectResult);
        })

        test('fn: validatePlaceDetails; param details == null', () => {
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
    })
})