const Utils = require('../../../src/utils/common.utils');
const { SortingOption } = require('../../../src/utils/enums/sorting-option.enum');

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

        test('fn: checkAddressInViennaByZipCode, result: true', () => {
            const mockParam_zipCode = '1010';

            const testFn = Utils.checkAddressInViennaByZipCode(mockParam_zipCode);
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

        test('fn: quicksort, result: sorted ascending by direct array values', () => {
            const mockParam_data = [534, 22, 7, 611, 43, 99, 0, 118];
            const mockParam_direction = SortingOption.ASC;

            const testFn = Utils.quicksort(mockParam_data, mockParam_direction);
            const expectResult = [0, 7, 22, 43, 99, 118, 534, 611];

            expect(testFn).toStrictEqual(expectResult);
        })

        test('fn: quicksort, result: sorted ascending by nested property values', () => {
            const mockParam_data = [
                { data: { k1: 15, k2: 'aa' }, info: 'testObj1' },
                { data: { k1: 77, k2: 'bb' }, info: 'testObj2' },
                { data: { k1: 22, k2: 'cc' }, info: 'testObj3' }
            ];
            const mockParam_direction = SortingOption.DESC;
            const mockParam_target = 'data.k1';

            const testFn = Utils.quicksort(mockParam_data, mockParam_direction, mockParam_target);
            const expectResult = [
                { data: { k1: 77, k2: 'bb' }, info: 'testObj2' },
                { data: { k1: 22, k2: 'cc' }, info: 'testObj3' },
                { data: { k1: 15, k2: 'aa' }, info: 'testObj1' }
            ];

            expect(testFn).toStrictEqual(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('fn: checkAddressInViennaByZipCode, result: false', () => {
            const mockParam_zipCode = '2000';

            const testFn = Utils.checkAddressInViennaByZipCode(mockParam_zipCode);
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

        test('fn: quicksort, result: unaltered data array', () => {
            const mockParam_data = ['test'];
            const mockParam_direction = SortingOption.DESC;

            const testFn = Utils.quicksort(mockParam_data, mockParam_direction);
            const expectResult = ['test'];

            expect(testFn).toStrictEqual(expectResult);
        })
    })
})