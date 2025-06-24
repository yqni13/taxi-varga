const Utils = require('../../../src/utils/common.utils');

describe('Utils tests, priority: common', () => {

    describe('Testing valid fn calls', () => {

        test('fn: basicResponse', () => {
            const mockParam_body = { result: 'success', process: 'test' };
            const mockParam_success = 1;
            const mockParam_message = 'basicResponse created correctly';
            
            const testFn = Utils.basicResponse(
                mockParam_body,
                mockParam_success,
                mockParam_message
            )
            const expectResult = {
                headers: { success: mockParam_success, message: mockParam_message },
                body: mockParam_body
            }

            expect(testFn).toMatchObject(expectResult);
        })

        test('fn: getTimeInMinutesFromRoutesMatrix', () => {
            const mockParam_value = '1578s';

            const testFn = Utils.getTimeInMinutesFromRoutesMatrix(mockParam_value);
            const expectResult = 26.3;

            expect(testFn).toBe(expectResult);
        })

        test('fn: getDistanceInKmFromRoutesMatrix', () => {
            const mockParam_value = '71253';

            const testFn = Utils.getDistanceInKmFromRoutesMatrix(mockParam_value);
            const expectResult = 71.3;

            expect(testFn).toBe(expectResult);
        })

        test('fn: formatRequestStringNoPlus', () => {
            const mockParam_value = 'Kalter+Gang-Weg+9,+2320+Schwechat,+Austria';

            const testFn = Utils.formatRequestStringNoPlus(mockParam_value);
            const expectResult = 'Kalter Gang-Weg 9, 2320 Schwechat, Austria';

            expect(testFn).toBe(expectResult);
        })

        test('fn: checkAddressInVienna, result: true', () => {
            const mockParam_zipCode = '1010';

            const testFn = Utils.checkAddressInVienna(mockParam_zipCode);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: checkAddressAtViennaAirport, result: true', () => {
            const mockParam_zipCode = '1300';

            const testFn = Utils.checkAddressAtViennaAirport(mockParam_zipCode);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: checkTimeWithinBusinessHours, result: true', () => {
            const mockParam_hour = 12;

            const testFn = Utils.checkTimeWithinBusinessHours(mockParam_hour);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('fn: checkAddressInVienna, result: false', () => {
            const mockParam_zipCode = '2000';

            const testFn = Utils.checkAddressInVienna(mockParam_zipCode);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })

        test('fn: checkAddressAtViennaAirport, result: false', () => {
            const mockParam_zipCode = '1010';

            const testFn = Utils.checkAddressAtViennaAirport(mockParam_zipCode);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })

        test('fn: checkTimeWithinBusinessHours, result: false', () => {
            const mockParam_hour = 13;

            const testFn = Utils.checkTimeWithinBusinessHours(mockParam_hour);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })
    })
})