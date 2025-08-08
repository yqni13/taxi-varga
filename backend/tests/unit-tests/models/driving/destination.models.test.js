const DrivingDestinationModel = require('../../../../src/models/driving/destination.driving.model');
const googleRoutesApi = require('../../../../src/services/google-routes/google-routes.api');
const MockData_RouteMatrix = require('../../../mock-data/routeMatrix_destination.mock.json');

describe('Destination tests, priority: calcDestinationRoute', () => {

    describe('Testing valid fn calls', () => {

        describe('Testing without latency', () => {

            test('Route (1230to2345), params: <back2home> = false, withinBH, <latency> = 0', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1230-2345']);
                const mockResult = structuredClone(MockData_RouteMatrix['route1230-2345']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 59 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1230to2345), params: <back2home> = true, withinBH, <latency> = 0', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1230-2345']);
                mockParam_params['back2home'] = 'true';
                const mockResult = structuredClone(MockData_RouteMatrix['route1230-2345']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 61 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1230to2345), params: <back2home> = false, offBH, <latency> = 0', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1230-2345']);
                mockParam_params['pickupTIME'] = 15;
                const mockResult = structuredClone(MockData_RouteMatrix['route1230-2345']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 58 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1230to2345), params: <back2home> = true, offBH, <latency> = 0', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1230-2345']);
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 15;
                const mockResult = structuredClone(MockData_RouteMatrix['route1230-2345']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 68 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (2351to1300), params: <back2home> = false, withinBH, <latency> = 0', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route2351-1300']);
                mockParam_params['back2home'] = 'false';
                mockParam_params['pickupTIME'] = 7;
                const mockResult = structuredClone(MockData_RouteMatrix['route2351-1300']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 52 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (2542to2540) [before swap], params: <back2home> = false, withinBH, <latency> = 0', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route2542-2540']);
                mockParam_params['back2home'] = 'false';
                const mockResult = structuredClone(MockData_RouteMatrix['route2542-2540']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 13 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (2542to2540) [after swap], params: <back2home> = false, withinBH, <latency> = 0', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route2540-2542']);
                mockParam_params['back2home'] = 'false';
                const mockResult = structuredClone(MockData_RouteMatrix['route2540-2542']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 14 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })
        })

        describe('Test with different latency values', () => {

            test('Route (1010to2361), params: <back2home> = true, withinBH, <latency> = 60', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1010-2361']);
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 8;
                mockParam_params['latency'] = 60;
                const mockResult = structuredClone(MockData_RouteMatrix['route1010-2361']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 98 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1010to2361), params: <back2home> = true, offBH, <latency> = 60', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1010-2361']);
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 15;
                mockParam_params['latency'] = 60;
                const mockResult = structuredClone(MockData_RouteMatrix['route1010-2361']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 119 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1010to2361), params: <back2home> = true, withinBH, <latency> = 90', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1010-2361']);
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 8;
                mockParam_params['latency'] = 90;
                const mockResult = structuredClone(MockData_RouteMatrix['route1010-2361']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 104 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1010to2361), params: <back2home> = true, offBH, <latency> = 90', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1010-2361']);
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 15;
                mockParam_params['latency'] = 90;
                const mockResult = structuredClone(MockData_RouteMatrix['route1010-2361']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 125 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1010to2361), params: <back2home> = true, withinBH, <latency> = 180', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1010-2361']);
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 8;
                mockParam_params['latency'] = 180;
                const mockResult = structuredClone(MockData_RouteMatrix['route1010-2361']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 110 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1010to2361), params: <back2home> = true, offBH, <latency> = 180', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1010-2361']);
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 15;
                mockParam_params['latency'] = 180;
                const mockResult = structuredClone(MockData_RouteMatrix['route1010-2361']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 143 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (2351to1300), params: <back2home> = true, withinBH, <latency> = 20', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route2351-1300']);
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 7;
                mockParam_params['latency'] = 20;
                const mockResult = structuredClone(MockData_RouteMatrix['route2351-1300']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 79 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })
        })

        describe('Test with service distance < 20, priority: back2home & approach', () => {

            test('Route (1230to2345), params: offBH, servDist < 20, back2home = false', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1230-2345']);
                mockParam_params['pickupTIME'] = 17;
                const mockResult = structuredClone(MockData_RouteMatrix['route1230-2345']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 58 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1230to2345), params: withinBH, servDist < 20, back2home = false', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1230-2345']);
                const mockResult = structuredClone(MockData_RouteMatrix['route1230-2345']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 59 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (2542to2540), params: withinBH, servDist < 20, back2home = true', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route2542-2540']);
                const mockResult = structuredClone(MockData_RouteMatrix['route2542-2540']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 18 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (2340to2345), params: withinBH, servDist > 20, back2home = true, approach < 30', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route2340-2345']);
                const mockResult = structuredClone(MockData_RouteMatrix['route2340-2345']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 49 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (2384to1220), params: withinBH, servDist > 20, back2home = true, approach > 30', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route2384-1220']);
                const mockResult = structuredClone(MockData_RouteMatrix['route2384-1220']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 107 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (2560to1020), params: withinBH, servDist > 20, back2home = false, approach < 30', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route2560-1020']);
                const mockResult = structuredClone(MockData_RouteMatrix['route2560-1020']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 63 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1090to4020), params: withinBH, servDist > 20, back2home = false, approach > 30', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1090-4020']);
                const mockResult = structuredClone(MockData_RouteMatrix['route1090-4020']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 257 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })
        })
    })
})

describe('Destination tests, priority: _addChargeServiceDistanceBelow20Km (via spyOn)', () => {

    describe('Testing valid fn calls', () => {

        let mockParam_response, mockParam_routes;
        beforeEach(() => {
            mockParam_response = structuredClone(MockData_RouteMatrix['route2824-2700']['apiResult']);
            mockParam_routes = {
                h2o: mockParam_response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
                o2d: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
                d2o: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
                d2h: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 2}),
                o2h: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 2}),
            };
        });

        test('Route (2824to2700), params: service distance < 20, <back2home> = false, withinBH, <latency> = 0', () => {
            const mockParam_back2home = false;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const mockSpy = jest.spyOn(destinationModel, '_addChargeServiceDistanceBelow20Km');
            const testFn = mockSpy.getMockImplementation();

            expect(testFn(mockParam_routes, mockParam_back2home, 0.4)).toBeCloseTo(8, 0);
        })

        test('Route (2824to2700), params: service distance < 20, <back2home> = true, withinBH, <latency> = 0', () => {
            const mockParam_back2home = true;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const mockSpy = jest.spyOn(destinationModel, '_addChargeServiceDistanceBelow20Km');
            const testFn = mockSpy.getMockImplementation();

            expect(testFn(mockParam_routes, mockParam_back2home, 0.4)).toBeCloseTo(5, 0);
        })

        test('Route (1090to4020), params: service distance > 20', () => {
            const mockParam_response = structuredClone(MockData_RouteMatrix['route1090-4020']['apiResult']);
            const mockParam_routes = {
                h2o: mockParam_response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
                o2d: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
                d2o: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
                d2h: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 2}),
                o2h: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 2}),
            };
            const mockParam_back2home = true;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const mockSpy = jest.spyOn(destinationModel, '_addChargeServiceDistanceBelow20Km');
            const testFn = mockSpy.getMockImplementation();

            expect(testFn(mockParam_routes, mockParam_back2home, 0.4)).toBe(0);
        })
    })
})

describe('Destination tests, priority: _calcDestinationReturnCosts', () => {

    describe('Testing valid fn calls', () => {

        let mockParam_params, mockParam_routes, mockParam_latencyCosts, mockParam_isWithinBH, mockParam_response;
        beforeEach(() => {
            mockParam_params = structuredClone(MockData_RouteMatrix['route1090-4020']);
            mockParam_response = structuredClone(MockData_RouteMatrix['route1090-4020']['apiResult']);
            mockParam_routes = {
                h2o: mockParam_response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
                o2d: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
                d2o: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
                d2h: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 2}),
                o2h: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 2}),
            };
            mockParam_params['latency'] = 180;
            mockParam_isWithinBH = true;
        });

        test('Route (1090to4020), params: <back2home> = true, offBH', () => {
            mockParam_params['back2home'] = true;
            mockParam_isWithinBH = false;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcDestinationReturnCosts(
                mockParam_params,
                mockParam_routes,
                mockParam_isWithinBH
            );
            const expectResult = 23;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Route (1090to4020), params: <back2home> = false, offBH', () => {
            mockParam_params['back2home'] = false;
            mockParam_isWithinBH = false;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcDestinationReturnCosts(
                mockParam_params,
                mockParam_routes,
                mockParam_isWithinBH
            );
            const expectResult = 96.6;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Route (1090to4020), params: <back2home> = false, withinBH', () => {
            mockParam_params['back2home'] = false;
            mockParam_params['pickupTIME'] = 8;
            mockParam_isWithinBH = true;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcDestinationReturnCosts(
                mockParam_params,
                mockParam_routes,
                mockParam_isWithinBH
            );
            const expectResult = 77.3;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Route (1090to4020), params: <back2home> = true, withinBH, <latency> < 180', () => {
            mockParam_params['back2home'] = true;
            mockParam_params['latency'] = 120;
            mockParam_params['pickupTIME'] = 8;
            mockParam_isWithinBH = true;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcDestinationReturnCosts(
                mockParam_params,
                mockParam_routes,
                mockParam_isWithinBH
            );
            const expectResult = 18.4;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Route (1090to4020), params: <back2home> = true, withinBH, <latency> >= 180, o2h.distance > 30', () => {
            mockParam_params['back2home'] = true;
            mockParam_params['pickupTIME'] = 8;
            mockParam_params['latency'] = 180;
            mockParam_isWithinBH = true;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcDestinationReturnCosts(
                mockParam_params,
                mockParam_routes,
                mockParam_isWithinBH
            );
            const expectResult = 6.4;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Route(2824to2700), params: <back2home> = true, withinBH, <latency> >= 180, o2h.distance <= 30', () => {
            mockParam_params = structuredClone(MockData_RouteMatrix['route2824-2700']);
            mockParam_response = structuredClone(MockData_RouteMatrix['route2824-2700']['apiResult']);
            mockParam_routes = {
                h2o: mockParam_response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
                o2d: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
                d2o: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
                d2h: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 2}),
                o2h: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 2}),
            };
            mockParam_params['back2home'] = true;
            mockParam_params['latency'] = 180;
            mockParam_isWithinBH = true;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcDestinationReturnCosts(
                mockParam_params,
                mockParam_routes,
                mockParam_isWithinBH
            );
            const expectResult = 0;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })
    })
})

describe('Destination tests, priority: _addChargeParkFlatByBH', () => {

    let destinationModel;
    beforeEach(() => {
        destinationModel = new DrivingDestinationModel(googleRoutesApi);
    })

    describe('Testing valid fn calls', () => {

        test('Route (2824to2700), params: <back2home> = true', () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2824-2700']);
            mockParam_params['back2home'] = true;
            const testFn = destinationModel._addChargeParkFlatByBH(mockParam_params);
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Route (2824to2700), params: <back2home> = false, offBH, <origin> != Vienna | VIE', () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2824-2700']);
            mockParam_params['back2home'] = false;
            const mockParam_isWithinBH = false;
            const testFn = destinationModel._addChargeParkFlatByBH(
                mockParam_params,
                mockParam_isWithinBH
            );
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Route (1010to2361), params: <back2home> = false, offBH, <origin> == Vienna | VIE', () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route1010-2361']);
            mockParam_params['back2home'] = false;
            const mockParam_isWithinBH = false;
            const testFn = destinationModel._addChargeParkFlatByBH(
                mockParam_params,
                mockParam_isWithinBH
            );
            const expectResult = 6;

            expect(testFn).toBe(expectResult);
        })

        test('Route (1010to2361), params: <back2home> = false, withinBH, <origin> == Vienna | VIE', () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route1010-2361']);
            mockParam_params['back2home'] = false;
            const mockParam_isWithinBH = true;
            const testFn = destinationModel._addChargeParkFlatByBH(
                mockParam_params,
                mockParam_isWithinBH
            );
            const expectResult = 14;

            expect(testFn).toBe(expectResult);
        })

        test('Route (AKHto2544), params: <back2home> = false, withinBH, <origin> = AKH Vienna, no zipCode', () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['routeAKH-2544']);
            mockParam_params['back2home'] = false;
            const mockParam_isWithinBH = true;
            const testFn = destinationModel._addChargeParkFlatByBH(
                mockParam_params,
                mockParam_isWithinBH
            )
            const expectResult = 14;

            expect(testFn).toBe(expectResult);
        })
    })
})