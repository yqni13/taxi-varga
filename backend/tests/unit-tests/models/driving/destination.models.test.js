const DrivingDestinationModel = require('../../../../src/models/driving/destination.driving.model');
const googleRoutesApi = require('../../../../src/services/google-routes/google-routes.api');
const MockData_requestRouteMatrix = require('../../../mock-data/requestRouteMatrix.mock.json')['service-destination'];

describe('Destination tests, priority: calcDestinationRoute', () => {

    describe('Testing valid fn calls', () => {

        describe('Testing without latency', () => {

            test('Route (1230to2345), params: <back2home> = false, withinBH, <latency> = 0', async () => {
                const mockParam_params = structuredClone(MockData_requestRouteMatrix['route1230-2345']);
                const mockResult = structuredClone(MockData_requestRouteMatrix['route1230-2345']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 86 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1230to2345), params: <back2home> = true, withinBH, <latency> = 0', async () => {
                const mockParam_params = structuredClone(MockData_requestRouteMatrix['route1230-2345']);
                mockParam_params['back2home'] = 'true';
                const mockResult = structuredClone(MockData_requestRouteMatrix['route1230-2345']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 90 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1230to2345), params: <back2home> = false, offBH, <latency> = 0', async () => {
                const mockParam_params = structuredClone(MockData_requestRouteMatrix['route1230-2345']);
                mockParam_params['pickupTIME'] = 15;
                const mockResult = structuredClone(MockData_requestRouteMatrix['route1230-2345']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 85 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1230to2345), params: <back2home> = true, offBH, <latency> = 0', async () => {
                const mockParam_params = structuredClone(MockData_requestRouteMatrix['route1230-2345']);
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 15;
                const mockResult = structuredClone(MockData_requestRouteMatrix['route1230-2345']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 98 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })
        })

        describe('Test with different latency values', () => {

            test('Route (1010to2361), params: <back2home> = true, withinBH, <latency> = 60', async () => {
                const mockParam_params = structuredClone(MockData_requestRouteMatrix['route1010-2361']);
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 8;
                mockParam_params['latency'] = 60;
                const mockResult = structuredClone(MockData_requestRouteMatrix['route1010-2361']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 98 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1010to2361), params: <back2home> = true, offBH, <latency> = 60', async () => {
                const mockParam_params = structuredClone(MockData_requestRouteMatrix['route1010-2361']);
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 15;
                mockParam_params['latency'] = 60;
                const mockResult = structuredClone(MockData_requestRouteMatrix['route1010-2361']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 119 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1010to2361), params: <back2home> = true, withinBH, <latency> = 90', async () => {
                const mockParam_params = structuredClone(MockData_requestRouteMatrix['route1010-2361']);
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 8;
                mockParam_params['latency'] = 90;
                const mockResult = structuredClone(MockData_requestRouteMatrix['route1010-2361']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 104 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1010to2361), params: <back2home> = true, offBH, <latency> = 90', async () => {
                const mockParam_params = structuredClone(MockData_requestRouteMatrix['route1010-2361']);
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 15;
                mockParam_params['latency'] = 90;
                const mockResult = structuredClone(MockData_requestRouteMatrix['route1010-2361']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 125 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1010to2361), params: <back2home> = true, withinBH, <latency> = 180', async () => {
                const mockParam_params = structuredClone(MockData_requestRouteMatrix['route1010-2361']);
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 8;
                mockParam_params['latency'] = 180;
                const mockResult = structuredClone(MockData_requestRouteMatrix['route1010-2361']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 110 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1010to2361), params: <back2home> = true, offBH, <latency> = 180', async () => {
                const mockParam_params = structuredClone(MockData_requestRouteMatrix['route1010-2361']);
                mockParam_params['back2home'] = 'true';
                mockParam_params['pickupTIME'] = 15;
                mockParam_params['latency'] = 180;
                const mockResult = structuredClone(MockData_requestRouteMatrix['route1010-2361']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 143 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })
        })

        describe('Test with service distance < 20, priority: back2home & approach', () => {

            test('Route (1230to2345), params: offBH, servDist < 20, bach2home = false', async () => {
                const mockParam_params = structuredClone(MockData_requestRouteMatrix['route1230-2345']);
                mockParam_params['pickupTIME'] = 17;
                const mockResult = structuredClone(MockData_requestRouteMatrix['route1230-2345']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 85 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1230to2345), params: withinBH, servDist < 20, bach2home = false', async () => {
                const mockParam_params = structuredClone(MockData_requestRouteMatrix['route1230-2345']);
                const mockResult = structuredClone(MockData_requestRouteMatrix['route1230-2345']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 86 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (2542to2542), params: withinBH, servDist < 20, bach2home = true', async () => {
                const mockParam_params = structuredClone(MockData_requestRouteMatrix['route2542-2542']);
                const mockResult = structuredClone(MockData_requestRouteMatrix['route2542-2542']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 20 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (2340to2340), params: withinBH, servDist > 20, bach2home = true, approach < 30', async () => {
                const mockParam_params = structuredClone(MockData_requestRouteMatrix['route2340-2340']);
                const mockResult = structuredClone(MockData_requestRouteMatrix['route2340-2340']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 71 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (2384to2384), params: withinBH, servDist > 20, bach2home = true, approach > 30', async () => {
                const mockParam_params = structuredClone(MockData_requestRouteMatrix['route2384-2384']);
                const mockResult = structuredClone(MockData_requestRouteMatrix['route2384-2384']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 107 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (2560to1020), params: withinBH, servDist > 20, bach2home = false, approach < 30', async () => {
                const mockParam_params = structuredClone(MockData_requestRouteMatrix['route2560-1020']);
                const mockResult = structuredClone(MockData_requestRouteMatrix['route2560-1020']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 63 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1090to4020), params: withinBH, servDist > 20, bach2home = false, approach > 30', async () => {
                const mockParam_params = structuredClone(MockData_requestRouteMatrix['route1090-4020']);
                const mockResult = structuredClone(MockData_requestRouteMatrix['route1090-4020']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 257 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Empty params', async () => {
            const mockParam_params = {};

            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
            const expectResult = {error: 'no params found'};

            expect(testFn).toMatchObject(expectResult);
        })
    })
})

describe('Destination tests, priority: _addChargeServiceDistanceBelow20Km (via spyOn)', () => {

    describe('Testing valid fn calls', () => {

        let mockParam_response, mockParam_routes;
        beforeEach(() => {
            mockParam_response = structuredClone(MockData_requestRouteMatrix['route2824-2700']['apiResult']);
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
            const mockParam_response = structuredClone(MockData_requestRouteMatrix['route1090-4020']['apiResult']);
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

        let mockParam_params, mockParam_routes, mockParam_latencyCosts, mockParam_response;
        beforeEach(() => {
            mockParam_params = structuredClone(MockData_requestRouteMatrix['route1090-4020']);
            mockParam_response = structuredClone(MockData_requestRouteMatrix['route1090-4020']['apiResult']);
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

        test('Route (1090to4020), params: <back2home> = true, offBH', () => {
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

        test('Route (1090to4020), params: <back2home> = false, offBH', () => {
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

        test('Route (1090to4020), params: <back2home> = false, withinBH', () => {
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

        test('Route (1090to4020), params: <back2home> = true, withinBH, <latency> < 180', () => {
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

        test('Route (1090to4020), params: <back2home> = true, withinBH, <latency> >= 180, o2h.distance > 30', () => {
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

        test('Route(2824to2700), params: <back2home> = true, withinBH, <latency> >= 180, o2h.distance <= 30', () => {
            mockParam_params = structuredClone(MockData_requestRouteMatrix['route2824-2700']);
            mockParam_response = structuredClone(MockData_requestRouteMatrix['route2824-2700']['apiResult']);
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

    let destinationModel;
    beforeEach(() => {
        destinationModel = new DrivingDestinationModel(googleRoutesApi);
    })

    describe('Testing valid fn calls', () => {

        test('Route (2824to2700), params: <back2home> = true', () => {
            const mockParam_params = structuredClone(MockData_requestRouteMatrix['route2824-2700']);
            mockParam_params['back2home'] = true;
            const testFn = destinationModel._addChargeParkFlatByBH(mockParam_params);
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Route (2824to2700), params: <back2home> = false, offBH, <origin> != Vienna | VIE', () => {
            const mockParam_params = structuredClone(MockData_requestRouteMatrix['route2824-2700']);
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
            const mockParam_params = structuredClone(MockData_requestRouteMatrix['route1010-2361']);
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
            const mockParam_params = structuredClone(MockData_requestRouteMatrix['route1010-2361']);
            mockParam_params['back2home'] = false;
            const mockParam_isWithinBH = true;
            const testFn = destinationModel._addChargeParkFlatByBH(
                mockParam_params,
                mockParam_isWithinBH
            );
            const expectResult = 14;

            expect(testFn).toBe(expectResult);
        })
    })
})