const CustomValidators = require('../../../src/utils/customValidator.utils');
const CryptoService = require('../../../src/utils/crypto.utils');

// Mock module to overwrite usage in tests (no hard coded safety blocks like encoded params).
jest.mock('../../../src/utils/crypto.utils');

describe('CustomValidator tests, priority: MAIL', () => {

    describe.only('Testing valid fn calls', () => {

        test('fn: validateEncryptedSender', () => {
            CryptoService.decryptRSA.mockReturnValue('test@test.com');

            const mockParam_encryptedSender = 'encrypted-test';
            const testFn = CustomValidators.validateEncryptedSender(mockParam_encryptedSender);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })
    })

    describe.only('Testing invalid fn calls', () => {

        test('fn: validateEncryptedSender, param: invalid email #1', () => {
            CryptoService.decryptRSA.mockReturnValue('test@test');

            const mockParam_encryptedSender = 'encrypted-test';
            const expectResult = 'backend-invalid-email';

            expect(() => {
                CustomValidators.validateEncryptedSender(mockParam_encryptedSender);
            }).toThrow(expectResult);
        })

        test('fn: validateEncryptedSender, param: invalid email #2', () => {
            CryptoService.decryptRSA.mockReturnValue('test.test.com');

            const mockParam_encryptedSender = 'encrypted-test';
            const expectResult = 'backend-invalid-email';

            expect(() => {
                CustomValidators.validateEncryptedSender(mockParam_encryptedSender);
            }).toThrow(expectResult);
        })
    })
})