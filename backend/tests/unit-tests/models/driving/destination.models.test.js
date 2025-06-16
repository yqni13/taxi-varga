const DrivingDestinationModel = require('../../../../src/models/driving/destination.driving.model');
const googleRoutesApi = require('../../../../src/services/google-routes/google-routes.api');
const MockData_requestRouteMatrix = require('../../mock-data/requestRouteMatrix.mock.json');

describe('Destination tests, priority: calcDestinationRoute', () => {

    describe.only('Testing valid calculations', () => {

        describe.only('Testing without latency', () => {

            test('1010 to 2361, back2home = false, withinBH, latency = 0', async () => {
                const mockParam_params = MockData_requestRouteMatrix['route-1010To2361'];
                const mockResult = MockData_requestRouteMatrix['route-1010To2361']['apiResult'];
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 91 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('1010 to 2361, back2home = true, withinBH, latency = 0', async () => {
                const mockParam_params = MockData_requestRouteMatrix['route-1010To2361'];
                mockParam_params['back2home'] = 'true';
                const mockResult = MockData_requestRouteMatrix['route-1010To2361']['apiResult'];
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 74 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('1010 to 2361, back2home = false, offBH, latency = 0', async () => {
                const mockParam_params = MockData_requestRouteMatrix['route-1010To2361'];
                mockParam_params['pickupTIME'] = 15;
                const mockResult = MockData_requestRouteMatrix['route-1010To2361']['apiResult'];
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 98 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('1010 to 2361, back2home = true, offBH, latency = 0', async () => {
                const mockParam_params = MockData_requestRouteMatrix['route-1010To2361'];
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 15;
                const mockResult = MockData_requestRouteMatrix['route-1010To2361']['apiResult'];
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 90 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })
        })

        describe.only('Test with different latency values', () => {

            test('1010 to 2361, back2home = true, withinBH, latency = 60', async () => {
                const mockParam_params = MockData_requestRouteMatrix['route-1010To2361'];
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 8;
                mockParam_params['latency'] = 60;
                const mockResult = MockData_requestRouteMatrix['route-1010To2361']['apiResult'];
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 98 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('1010 to 2361, back2home = true, offBH, latency = 60', async () => {
                const mockParam_params = MockData_requestRouteMatrix['route-1010To2361'];
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 15;
                mockParam_params['latency'] = 60;
                const mockResult = MockData_requestRouteMatrix['route-1010To2361']['apiResult'];
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 114 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('1010 to 2361, back2home = true, withinBH, latency = 90', async () => {
                const mockParam_params = MockData_requestRouteMatrix['route-1010To2361'];
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 8;
                mockParam_params['latency'] = 90;
                const mockResult = MockData_requestRouteMatrix['route-1010To2361']['apiResult'];
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 104 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('1010 to 2361, back2home = true, offBH, latency = 90', async () => {
                const mockParam_params = MockData_requestRouteMatrix['route-1010To2361'];
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 15;
                mockParam_params['latency'] = 90;
                const mockResult = MockData_requestRouteMatrix['route-1010To2361']['apiResult'];
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 120 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('1010 to 2361, back2home = true, withinBH, latency = 180', async () => {
                const mockParam_params = MockData_requestRouteMatrix['route-1010To2361'];
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 8;
                mockParam_params['latency'] = 180;
                const mockResult = MockData_requestRouteMatrix['route-1010To2361']['apiResult'];
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 110 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('1010 to 2361, back2home = true, offBH, latency = 180', async () => {
                const mockParam_params = MockData_requestRouteMatrix['route-1010To2361'];
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 15;
                mockParam_params['latency'] = 180;
                const mockResult = MockData_requestRouteMatrix['route-1010To2361']['apiResult'];
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 138 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })
        })

        describe.only('Test with service distance < 30, priority: back2home & approach', () => {

            test('2824 to 2700, approach < 8, back2home = false, withinBH, latency = 0', async () => {
                const mockParam_params = MockData_requestRouteMatrix['route-2824To2700'];
                const mockResult = MockData_requestRouteMatrix['route-2824To2700']['apiResult'];
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 33 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('2824 to 2700, approach < 8, back2home = true, withinBH, latency = 0', async () => {
                const mockParam_params = MockData_requestRouteMatrix['route-2824To2700'];
                mockParam_params['back2home'] = 'true';
                const mockResult = MockData_requestRouteMatrix['route-2824To2700']['apiResult'];
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 43 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })
        })
    })
})

describe('Destination tests, priority: _addChargeServiceDistanceBelow30Km (via spyOn)', () => {

    describe.only('Testing valid calculations', () => {

        let mockParam_response, mockParam_routes;
        beforeEach(() => {
            mockParam_response = MockData_requestRouteMatrix['route-2824To2700']['apiResult'];
            mockParam_routes = {
                h2o: mockParam_response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
                o2d: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
                d2o: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
                d2h: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 2}),
                o2h: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 2}),
            };
        });

        test('2824 to 2700, back2home = false, withinBH, latency = 0', () => {
            const mockParam_back2home = false;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const mockSpy = jest.spyOn(destinationModel, '_addChargeServiceDistanceBelow30Km');
            const testFn = mockSpy.getMockImplementation();

            expect(testFn(mockParam_routes, mockParam_back2home, 0.4)).toBeCloseTo(8, 0);
        })

        test('2824 to 2700, back2home = true, withinBH, latency = 0', () => {
            const mockParam_back2home = true;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const mockSpy = jest.spyOn(destinationModel, '_addChargeServiceDistanceBelow30Km');
            const testFn = mockSpy.getMockImplementation();

            expect(testFn(mockParam_routes, mockParam_back2home, 0.4)).toBeCloseTo(5, 0);
        })

        test('1090 to 4020, service distance > 30', () => {
            const mockParam_response = MockData_requestRouteMatrix['route-1090To4020']['apiResult'];
            const mockParam_routes = {
                h2o: mockParam_response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
                o2d: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
                d2o: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
                d2h: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 2}),
                o2h: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 2}),
            };
            const mockParam_back2home = true;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const mockSpy = jest.spyOn(destinationModel, '_addChargeServiceDistanceBelow30Km');
            const testFn = mockSpy.getMockImplementation();

            expect(testFn(mockParam_routes, mockParam_back2home, 0.4)).toBe(0);
        })
    })
})

describe('Destination tests, priority: _calcDestinationReturnCosts', () => {

    describe.only('Testing valid calculations', () => {

        let mockParam_params, mockParam_routes, mockParam_latencyCosts, mockParam_response;
        beforeEach(() => {
            mockParam_params = MockData_requestRouteMatrix['route-1090To4020'];
            mockParam_response = MockData_requestRouteMatrix['route-1090To4020']['apiResult'];
            mockParam_routes = {
                h2o: mockParam_response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
                o2d: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
                d2o: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
                d2h: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 2}),
                o2h: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 2}),
            };
            mockParam_params['latency'] = 180;
            mockParam_latencyCosts = 72; // 180 min latency
        });

        test('1090 to 4020, back2home = true, offBH', () => {
            mockParam_params['back2home'] = true;
            mockParam_params['pickupTIME'] = 15;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcDestinationReturnCosts(
                mockParam_params,
                mockParam_routes,
                mockParam_latencyCosts
            );
            const expectResult = 95;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('1090 to 4020, back2home = false, offBH', () => {
            mockParam_params['back2home'] = false;
            mockParam_params['pickupTIME'] = 15;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcDestinationReturnCosts(
                mockParam_params,
                mockParam_routes,
                mockParam_latencyCosts
            );
            const expectResult = 168.6;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('1090 to 4020, back2home = false, withinBH', () => {
            mockParam_params['back2home'] = false;
            mockParam_params['pickupTIME'] = 8;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcDestinationReturnCosts(
                mockParam_params,
                mockParam_routes,
                mockParam_latencyCosts
            );
            const expectResult = 77.3;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('1090 to 4020, back2home = true, withinBH, latency < 180', () => {
            mockParam_params['back2home'] = true;
            mockParam_params['pickupTIME'] = 8;
            mockParam_params['latency'] = 90;
            mockParam_latencyCosts = 36;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcDestinationReturnCosts(
                mockParam_params,
                mockParam_routes,
                mockParam_latencyCosts
            );
            const expectResult = 54.4;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('1090 to 4020, back2home = true, withinBH, latency >= 180, o2h.distance > 30', () => {
            mockParam_params['back2home'] = true;
            mockParam_params['pickupTIME'] = 8;
            mockParam_params['latency'] = 180;
            mockParam_latencyCosts = 72;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcDestinationReturnCosts(
                mockParam_params,
                mockParam_routes,
                mockParam_latencyCosts
            );
            const expectResult = 78.4;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('2824 to 2700, back2home = true, withinBH, latency >= 180, o2h.distance <= 30', () => {
            mockParam_params = MockData_requestRouteMatrix['route-2824To2700'];
            mockParam_response = MockData_requestRouteMatrix['route-2824To2700']['apiResult'];
            mockParam_routes = {
                h2o: mockParam_response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
                o2d: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
                d2o: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
                d2h: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 2}),
                o2h: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 2}),
            };
            mockParam_params['back2home'] = true;
            mockParam_params['latency'] = 180;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcDestinationReturnCosts(
                mockParam_params,
                mockParam_routes,
                mockParam_latencyCosts
            );
            const expectResult = 72;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })
    })
})

describe('Destination tests, priority: _addChargeParkFlatByBH', () => {

    describe.only('Testing valid calculations', () => {

        test('2824 to 2700, back2home = true', () => {
            const mockParam_params = MockData_requestRouteMatrix['route-2824To2700'];
            mockParam_params['back2home'] = true;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._addChargeParkFlatByBH(
                mockParam_params
            );
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('2824 to 2700, back2home = false, offBH, origin != Vienna | VIE', () => {
            const mockParam_params = MockData_requestRouteMatrix['route-2824To2700'];
            mockParam_params['back2home'] = false;
            const mockParam_isWithinBH = false;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._addChargeParkFlatByBH(
                mockParam_params,
                mockParam_isWithinBH
            );
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('1010 to 2361, back2home = false, offBH, origin == Vienna | VIE', () => {
            const mockParam_params = MockData_requestRouteMatrix['route-1010To2361'];
            mockParam_params['back2home'] = false;
            const mockParam_isWithinBH = false;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._addChargeParkFlatByBH(
                mockParam_params,
                mockParam_isWithinBH
            );
            const expectResult = 6;

            expect(testFn).toBe(expectResult);
        })

        test('1010 to 2361, back2home = false, withinBH, origin == Vienna | VIE', () => {
            const mockParam_params = MockData_requestRouteMatrix['route-1010To2361'];
            mockParam_params['back2home'] = false;
            const mockParam_isWithinBH = true;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._addChargeParkFlatByBH(
                mockParam_params,
                mockParam_isWithinBH
            );
            const expectResult = 14;

            expect(testFn).toBe(expectResult);
        })
    })
})