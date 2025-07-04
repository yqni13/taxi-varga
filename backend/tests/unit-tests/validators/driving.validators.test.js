const CustomValidators = require('../../../src/utils/customValidator.utils');
const { ServiceOption } = require('../../../src/utils/enums/service-option.enum');
const MockData_places = require('../../mock-data/places.mock.json');

describe('CustomValidator tests, priority: DRIVING', () => {

    describe('Testing valid fn calls', () => {

        test('fn: validateDestinationServiceAddress', () => {
            const mockParam_address = MockData_places['place-1010#1']['simple'];
            const mockParam_addressDetails = MockData_places['place-1010#1']['details'];
            const mockParam_compareDetails = MockData_places['place-2361#1']['details'];
            const testFn = CustomValidators.validateDestinationServiceAddress(
                mockParam_address,
                mockParam_addressDetails,
                mockParam_compareDetails
            );
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: validateServiceRouteVIE', () => {
            const mockParam_req = {
                body: {
                    originDetails: { zipCode: MockData_places['place-1220#1']['details']['zipCode'] },
                    destinationDetails: { zipCode: MockData_places['place-2522#1']['details']['zipCode'] }
                }
            };
            const testFn = CustomValidators.validateServiceRouteVIE(mockParam_req);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: validateAirportServiceAddress, params: <address> = VIE', () => {
            const mockParam_details = null;
            const mockParam_address = MockData_places['place-1300#1']['simple'];
            const testFn = CustomValidators.validateAirportServiceAddress(
                mockParam_details,
                mockParam_address
            );
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: validateAirportServiceAddress, params: <address> = Vienna', () => {
            const mockParam_details = MockData_places['place-1220#1']['details'];
            const mockParam_address = MockData_places['place-1220#1']['simple'];
            const testFn = CustomValidators.validateAirportServiceAddress(
                mockParam_details,
                mockParam_address
            );
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: validateTravelTimeRelevance', () => {
            const mockParam_compareTime = 180;
            const mockParam_travelTime = 60;
            const mockParam_serviceOption = ServiceOption.FLATRATE;
            const testFn = CustomValidators.validateTravelTimeRelevance(
                mockParam_compareTime,
                mockParam_travelTime,
                mockParam_serviceOption
            )
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('fn: validateDestinationServiceAddress, params: all within Vienna', () => {
            const mockParam_address = MockData_places['place-1090#1']['simple'];
            const mockParam_addressDetails = MockData_places['place-1090#1']['details'];
            const mockParam_compareDetails = MockData_places['place-1010#1']['details'];
            const expectResult = 'backend-destination-vienna';

            expect(() => {
                CustomValidators.validateDestinationServiceAddress(
                    mockParam_address,
                    mockParam_addressDetails,
                    mockParam_compareDetails
                );
            }).toThrow(expectResult);
        })

        test('fn: validateServiceRouteVIE, params: invalid <origin> by VIE', () => {
            const mockParam_req = {
                body: {
                    originDetails: { zipCode: MockData_places['place-1300#2']['details']['zipCode'] },
                    destinationDetails: { zipCode: MockData_places['place-1010#1']['details']['zipCode'] }
                }
            };
            const expectResult = 'navigate-destination-airport/service';

            expect(() => {
                CustomValidators.validateServiceRouteVIE(mockParam_req);
            }).toThrow(expectResult);
        })
        
        test('fn: validateServiceRouteVIE, params: invalid <destination> by VIE', () => {
            const mockParam_req = {
                body: {
                    originDetails: { zipCode: MockData_places['place-1010#1']['details']['zipCode'] },
                    destinationDetails: { zipCode: MockData_places['place-1300#2']['details']['zipCode'] }
                }
            };
            const expectResult = 'navigate-destination-airport/service';

            expect(() => {
                CustomValidators.validateServiceRouteVIE(mockParam_req);
            }).toThrow(expectResult);
        })

        test('fn: validateAirportServiceAddress, params: invalid <zipCode> by null', () => {
            const mockParam_details = { address: 'test', zipCode: null };
            const mockParam_address = 'test';
            const expectResult = 'backend-missing-zipCode';

            expect(() => {
                CustomValidators.validateAirportServiceAddress(
                    mockParam_details,
                    mockParam_address
                )
            }).toThrow(expectResult);
        })

        test('fn: validateAirportServiceAddress, params: invalid <zipCode>', () => {
            const mockParam_details = { address: 'test', zipCode: '2361' };
            const mockParam_address = 'test';
            const expectResult = 'airport-invalid-place';

            expect(() => {
                CustomValidators.validateAirportServiceAddress(
                    mockParam_details,
                    mockParam_address
                )
            }).toThrow(expectResult);
        })

        test('fn: validateTravelTimeRelevance, params: <serviceOption> = Golf', () => {
            const mockParam_compareTime = 180;
            const mockParam_travelTime = 200;
            const mockParam_serviceOption = ServiceOption.GOLF;
            const expectResult = 'backend-invalid-relevance-stay';

            expect(() => {
                CustomValidators.validateTravelTimeRelevance(
                    mockParam_compareTime,
                    mockParam_travelTime,
                    mockParam_serviceOption
                )
            }).toThrow(expectResult);
        })

        test('fn: validateTravelTimeRelevance, params: <serviceOption> != Golf', () => {
            const mockParam_compareTime = 180;
            const mockParam_travelTime = 200;
            const mockParam_serviceOption = ServiceOption.DESTINATION;
            const expectResult = 'backend-invalid-relevance-travel';

            expect(() => {
                CustomValidators.validateTravelTimeRelevance(
                    mockParam_compareTime,
                    mockParam_travelTime,
                    mockParam_serviceOption
                )
            }).toThrow(expectResult);
        })
    })
})
