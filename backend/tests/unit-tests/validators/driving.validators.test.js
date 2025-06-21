const CustomValidators = require('../../../src/utils/customValidator.utils');
const { ServiceOption } = require('../../../src/utils/enums/service-option.enum');
const MockData_places = require('../mock-data/places.mock.json');
const { SupportModeOption } = require('../../../src/utils/enums/supportmode-option.enum');

describe('CustomValidator tests, priority: DRIVING', () => {

    describe.only('Testing valid fn calls', () => {

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

        test('fn: validateAirportServiceAddress, address: VIE', () => {
            const mockParam_details = null;
            const mockParam_address = MockData_places['place-1300#1']['simple'];
            const testFn = CustomValidators.validateAirportServiceAddress(
                mockParam_details,
                mockParam_address
            );
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: validateAirportServiceAddress, address: Vienna', () => {
            const mockParam_details = MockData_places['place-1220#1']['details'];
            const mockParam_address = MockData_places['place-1220#1']['simple'];
            const testFn = CustomValidators.validateAirportServiceAddress(
                mockParam_details,
                mockParam_address
            );
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })

        test('fn: validateGolfSupportMode', () => {
            const mockParam_supportMode = SupportModeOption;
            const expectResult = true;
            Object.values(mockParam_supportMode).forEach((option) => {
                expect(CustomValidators.validateGolfSupportMode(option)).toBe(expectResult);
            })
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

    describe.only('Testing invalid fn calls', () => {

        test('fn: validateDestinationServiceAddress, param: all within Vienna', () => {
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

        test('fn: validateServiceRouteVIE, param: origin VIE', () => {
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
        
        test('fn: validateServiceRouteVIE, param: destination VIE', () => {
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

        test('fn: validateAirportServiceAddress, param: missing zipCode', () => {
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

        test('fn: validateAirportServiceAddress, param: invalid zipCode', () => {
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

        test('fn: validateGolfSupportMode, param: false value', () => {
            const mockParam_supportMode = { NONE: 'all' };
            const expectResult = 'backend-invalid-supportmode';

            expect(() => {
                CustomValidators.validateGolfSupportMode(mockParam_supportMode);
            }).toThrow(expectResult);
        })

        test('fn: validateGolfSupportMode, param: false key', () => {
            const mockParam_supportMode = { ALL: 'none' };
            const expectResult = 'backend-invalid-supportmode';

            expect(() => {
                CustomValidators.validateGolfSupportMode(mockParam_supportMode);
            }).toThrow(expectResult);
        })

        test('fn: validateTravelTimeRelevance, param: service == Golf', () => {
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

        test('fn: validateTravelTimeRelevance, param: service != Golf', () => {
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
