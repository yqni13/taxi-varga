const CustomValidators = require('../../../src/utils/customValidator.utils');
const { AddressFilterOption } = require("../../../src/utils/enums/addressfilter-option.enum");
const { LanguageOption } = require('../../../src/utils/enums/lang-option.enum');
const { ServiceOption } = require('../../../src/utils/enums/service-option.enum');
const { SupportModeOption } = require('../../../src/utils/enums/supportmode-option.enum');

describe('Custom validators test, priority: no model specification', () => {

    describe('Testing valid fn calls', () => {

        test('fn: validateEnum, params: <enumObj> = AddressFilterOption', () => {
            const mockParam_enumObj = AddressFilterOption;
            const mockParam_enumName = 'addressFilter';
            const expectResult = true;

            Object.values(mockParam_enumObj).forEach((value) => {                
                expect(CustomValidators.validateEnum(
                    value,
                    mockParam_enumObj,
                    mockParam_enumName
                )).toBe(expectResult);
            })
        })

        test('fn: validateEnum, params: <enumObj> = ServiceOption', () => {
            const mockParam_enumObj = ServiceOption;
            const mockParam_enumName = 'service';
            const expectResult = true;

            Object.values(mockParam_enumObj).forEach((value) => {                
                expect(CustomValidators.validateEnum(
                    value,
                    mockParam_enumObj,
                    mockParam_enumName
                )).toBe(expectResult);
            })
        })

        test('fn: validateEnum, params: <enumObj> = LanguageOption', () => {
            const mockParam_enumObj = LanguageOption;
            const mockParam_enumName = 'language';
            const expectResult = true;

            Object.values(mockParam_enumObj).forEach((value) => {                
                expect(CustomValidators.validateEnum(
                    value,
                    mockParam_enumObj,
                    mockParam_enumName
                )).toBe(expectResult);
            })
        })

        test('fn: validateEnum, params: <enumObj> = SupportModeOption', () => {
            const mockParam_enumObj = SupportModeOption;
            const mockParam_enumName = 'supportMode';
            const expectResult = true;

            Object.values(mockParam_enumObj).forEach((value) => {                
                expect(CustomValidators.validateEnum(
                    value,
                    mockParam_enumObj,
                    mockParam_enumName
                )).toBe(expectResult);
            })
        })
    })

    describe('Testing invalid fn calls', () => {

        test('fn: validateEnum, params: invalid <value> by value', () => {
            const mockParam_value = 'invalid-value';
            const mockParam_enumObj = AddressFilterOption;
            const mockParam_enumName = 'addressFilter';
            const expectResult = `backend-invalid-entry#${mockParam_enumName}`;

            expect(() => {
                CustomValidators.validateEnum(
                    mockParam_value,
                    mockParam_enumObj,
                    mockParam_enumName
                );
            }).toThrow(expectResult);
        })

        test('fn: validateEnum, params: invalid <language> by key', () => {
            const mockParam_value = { INVALID: AddressFilterOption.NOSPEC };
            const mockParam_enumObj = AddressFilterOption;
            const mockParam_enumName = 'addressFilter';
            const expectResult = `backend-invalid-entry#${mockParam_enumName}`;
            
            expect(() => {
                CustomValidators.validateEnum(
                    mockParam_value,
                    mockParam_enumObj,
                    mockParam_enumName
                );
            }).toThrow(expectResult);
        })
    })
})