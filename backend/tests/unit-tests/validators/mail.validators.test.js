const CustomValidators = require('../../../src/utils/customValidator.utils');
const CryptoService = require('../../../src/utils/crypto.utils');

// Mock module to overwrite usage in tests (no hard coded safety blocks like encoded params).
jest.mock('../../../src/utils/crypto.utils');

describe('CustomValidator tests, priority: MAIL', () => {

    describe('Testing valid fn calls', () => {

        test('fn: validateEncryptedSender', () => {
            const mockParam_encryptedSender = 'encrypted-test';
            const mockResult = 'test@test.com';
            CryptoService.decryptRSA.mockReturnValue(mockResult);

            const testFn = CustomValidators.validateEncryptedSender(mockParam_encryptedSender);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('fn: validateEncryptedSender, result: invalid email by top-level-domain', () => {
            const mockParam_encryptedSender = 'encrypted-test';
            const mockResult = 'test@test';
            const expectResult = 'backend-invalid-email';

            CryptoService.decryptRSA.mockReturnValue(mockResult);

            expect(() => {
                CustomValidators.validateEncryptedSender(mockParam_encryptedSender);
            }).toThrow(expectResult);
        })

        test('fn: validateEncryptedSender, result: invalid email by @-character', () => {
            const mockParam_encryptedSender = 'encrypted-test';
            const mockResult = 'test.test.com';
            const expectResult = 'backend-invalid-email';

            CryptoService.decryptRSA.mockReturnValue(mockResult);

            expect(() => {
                CustomValidators.validateEncryptedSender(mockParam_encryptedSender);
            }).toThrow(expectResult);
        })
    })
})