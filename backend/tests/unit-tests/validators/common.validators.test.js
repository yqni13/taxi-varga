const CustomValidators = require('../../../src/utils/customValidator.utils');
const { AddressFilterOption } = require("../../../src/utils/enums/addressfilter-option.enum");

describe('Custom validators test, priority: no model specification', () => {

    describe('Testing valid fn calls', () => {

        test('fn: validateEnum', () => {
            const mockParam_value = AddressFilterOption.NOSPEC;
            const mockParam_enumObj = AddressFilterOption;
            const mockParam_enumName = 'addressFilter';

            const testFn = CustomValidators.validateEnum(
                mockParam_value,
                mockParam_enumObj,
                mockParam_enumName
            );
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('fn: validateEnum, params: invalid <value> by value', () => {
            const mockParam_value = 'invalid_value';
            const mockParam_enumObj = AddressFilterOption;
            const mockParam_enumName = 'addressFilter';
            const expectResult = `data-invalid-entry#${mockParam_enumName}`;

            expect(() => {
                CustomValidators.validateEnum(
                    mockParam_value,
                    mockParam_enumObj,
                    mockParam_enumName
                );
            }).toThrow(expectResult);
        })

        test('fn: validateEnum, params: invalid <language> by key', () => {
            const mockParam_value = { INVALID: 'non_specific' };
            const mockParam_enumObj = AddressFilterOption;
            const mockParam_enumName = 'addressFilter';
            const expectResult = `data-invalid-entry#${mockParam_enumName}`;
            
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