const Utils = require('../../../../src/utils/common.utils');
const Crypt = require('../../../../src/utils/crypto.utils');
const { mapMockDecryptResult } = require('../../../common.test-utils');
const { UnexpectedException } = require('../../../../src/utils/exceptions/common.exception');
const mailingModel = require('../../../../src/models/mailing.model');

const expectExceptionResult = UnexpectedException;
const mockBoolean = false;

describe('Mailing tests, priority: sendMail', () => {

    describe('Testing invalid fn calls', () => {

        test('Throw UnexpectedException by catch-block', async () => {
            const mockParam_params = null;
            const mockResult = null;
            const mockErrorMsg = 'ERROR ON MODEL PROCESSING + API';

            const mockError = mapMockDecryptResult(mockResult, mockBoolean, mockErrorMsg);
            jest.spyOn(Crypt, 'decryptAES').mockResolvedValue(mockError); // First task that can fail.
            jest.spyOn(Utils, 'logError').mockReturnValue();

            await expect(() => mailingModel.sendMail(mockParam_params))
                .rejects.toThrow(expectExceptionResult);
        })
    })
})