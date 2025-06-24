const CustomValidators = require('../../../src/utils/customValidator.utils');
const { ServiceOption } = require('../../../src/utils/enums/service-option.enum');

describe('CustomValidator tests, priority: AUTH', () => {

    describe('Testing valid fn calls', () => {

        test('fn: validateServiceOption', () => {
            const mockParam_value = ServiceOption;
            const expectResult = true;
            Object.values(mockParam_value).forEach((option) => {
                expect(CustomValidators.validateServiceOption(option)).toBe(expectResult);
            })
        })
    })

    describe('Testing invalid fn calls', () => {

        test('fn: validateServiceOption, param: false value', () => {
            const mockParam_value = { GOLF: 'Tennis' };
            const expectResult = 'backend-service-option';

            expect(() => {
                CustomValidators.validateServiceOption(mockParam_value);
            }).toThrow(expectResult);
        })

        test('fn: validateServiceOption, param: false key', () => {
            const mockParam_value = { TENNIS: 'Tennis' };
            const expectResult = 'backend-service-option';
            
            expect(() => {
                CustomValidators.validateServiceOption(mockParam_value);
            }).toThrow(expectResult);
        })
    })
})