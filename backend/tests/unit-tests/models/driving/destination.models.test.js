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
                const expectSubObj = { routeData: { price: 46 } };

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
                const expectSubObj = { routeData: { price: 53 } };

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
                const expectSubObj = { routeData: { price: 51 } };

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
                const expectSubObj = { routeData: { price: 58 } };

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
                const expectSubObj = { routeData: { price: 46 } };

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
                const expectSubObj = { routeData: { price: 11 } };

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
                const expectSubObj = { routeData: { price: 11 } };

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
                const expectSubObj = { routeData: { price: 102 } };

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
                const expectSubObj = { routeData: { price: 109 } };

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
                const expectSubObj = { routeData: { price: 108 } };

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
                const expectSubObj = { routeData: { price: 115 } };

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
                const expectSubObj = { routeData: { price: 114 } };

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
                const expectSubObj = { routeData: { price: 133 } };

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
                const expectSubObj = { routeData: { price: 81 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })
        })

        describe('Test with service distance </> 15, priority: back2home & approach', () => {

            test('Route (2560to1020), params: withinBH, back2home = true, approach < 20', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route2560-1020']);
                const mockResult = structuredClone(MockData_RouteMatrix['route2560-1020']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 63 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (2384to1220), params: withinBH, back2home = true, approach > 20', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route2384-1220']);
                const mockResult = structuredClone(MockData_RouteMatrix['route2384-1220']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 111 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (2560to1020), params: offBH, back2home = false, approach < 20', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route2560-1020']);
                mockParam_params['pickupTIME'] = 14;
                const mockResult = structuredClone(MockData_RouteMatrix['route2560-1020']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 67 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })

            test('Route (1090to4020), params: offBH, back2home = false, approach > 20', async () => {
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1090-4020']);
                mockParam_params['pickupTIME'] = 14;
                const mockResult = structuredClone(MockData_RouteMatrix['route1090-4020']['apiResult']);
                const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult)};

                const destinationModel = new DrivingDestinationModel(mockAPI);
                const testFn = await destinationModel.calcDestinationRoute(mockParam_params);
                const expectSubObj = { routeData: { price: 269 } };

                expect(testFn).toMatchObject(expectSubObj);
                expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            })
        })
    })
})

describe('Destination tests, priority: _calcServCosts', () => {

    describe('Testing valid fn calls', () => {

        let destinationModel;
        beforeEach(() => {
            destinationModel = new DrivingDestinationModel(googleRoutesApi);
        })

        test('Params: <back2home> = false, <servDist> < 25', () => {
            const mockParam_back2home = false;
            const mockParam_servDist = 20;
            const mockParam_servTime = 20;

            const testFn = destinationModel._calcServCosts(
                mockParam_back2home, mockParam_servDist, mockParam_servTime
            );
            const expectResult = { dist: 12, time: 12 };

            expect(testFn).toMatchObject(expectResult);
        })

        test('Params: <back2home> = false, <servDist> > 25', () => {
            const mockParam_back2home = false;
            const mockParam_servDist = 40;
            const mockParam_servTime = 40;

            const testFn = destinationModel._calcServCosts(
                mockParam_back2home, mockParam_servDist, mockParam_servTime
            );
            const expectResult = { dist: 20, time: 20 };

            expect(testFn).toMatchObject(expectResult);
        })

        test('Params: <back2home> = true, <servDist> < 30', () => {
            const mockParam_back2home = true;
            const mockParam_servDist = 20;
            const mockParam_servTime = 20;

            const testFn = destinationModel._calcServCosts(
                mockParam_back2home, mockParam_servDist, mockParam_servTime
            );
            const expectResult = { dist: 13, time: 13 };

            expect(testFn).toMatchObject(expectResult);
        })

        test('Params: <back2home> = true, <servDist> > 30', () => {
            const mockParam_back2home = true;
            const mockParam_servDist = 40;
            const mockParam_servTime = 40;

            const testFn = destinationModel._calcServCosts(
                mockParam_back2home, mockParam_servDist, mockParam_servTime
            );
            const expectResult = { dist: 20, time: 20 };

            expect(testFn).toMatchObject(expectResult);
        })
    })
})

describe('Destination tests, priority: _calcApproachCosts', () => {

    let destinationModel;
    beforeEach(() => {
        destinationModel = new DrivingDestinationModel(googleRoutesApi);
    })

    describe('Testing valid fn calls, priority: <back2home> = true', () => {

        let mockParam_back2home;
        beforeEach(() => {
            mockParam_back2home = true;
        })

        test('Route (), params: <isWithinBH> = true, <distances> = [<20, <100]', () => {
            const mockParam_isWithinBH = true;
            const mockParam_distances = {
                approach: 15,
                service: 50
            };

            const mockResult = 4;
            const testFn = destinationModel._calcApproachCosts(
                mockParam_isWithinBH, mockParam_distances, mockParam_back2home
            );

            expect(testFn).toBe(mockResult);
        })

        test('Route (), params: <isWithinBH> = false, <distances> = [<20, <100]', () => {
            const mockParam_isWithinBH = false;
            const mockParam_distances = {
                approach: 15,
                service: 50
            };

            const mockResult = 4;
            const testFn = destinationModel._calcApproachCosts(
                mockParam_isWithinBH, mockParam_distances, mockParam_back2home
            );

            expect(testFn).toBe(mockResult);
        })

        test('Route (), params: <isWithinBH> = true, <distances> = [>20, <100]', () => {
            const mockParam_isWithinBH = true;
            const mockParam_distances = {
                approach: 30,
                service: 50
            };

            const mockResult = 8;
            const testFn = destinationModel._calcApproachCosts(
                mockParam_isWithinBH, mockParam_distances, mockParam_back2home
            );

            expect(testFn).toBe(mockResult);
        })

        test('Route (), params: <isWithinBH> = false, <distances> = [>20, <100]', () => {
            const mockParam_isWithinBH = false;
            const mockParam_distances = {
                approach: 30,
                service: 50
            };

            const mockResult = 9;
            const testFn = destinationModel._calcApproachCosts(
                mockParam_isWithinBH, mockParam_distances, mockParam_back2home
            );

            expect(testFn).toBe(mockResult);
        })

        test('Route (), params: <isWithinBH> = true, <distances> = [>20, >100]', () => {
            const mockParam_isWithinBH = true;
            const mockParam_distances = {
                approach: 30,
                service: 150
            };

            const mockResult = 8;
            const testFn = destinationModel._calcApproachCosts(
                mockParam_isWithinBH, mockParam_distances, mockParam_back2home
            );

            expect(testFn).toBe(mockResult);
        })

        test('Route (), params: <isWithinBH> = false, <distances> = [>20, >100]', () => {
            const mockParam_isWithinBH = false;
            const mockParam_distances = {
                approach: 30,
                service: 150
            };

            const mockResult = 9;
            const testFn = destinationModel._calcApproachCosts(
                mockParam_isWithinBH, mockParam_distances, mockParam_back2home
            );

            expect(testFn).toBe(mockResult);
        })

        test('Route (), params: <isWithinBH> = true, <distances> = [>20, >250]', () => {
            const mockParam_isWithinBH = true;
            const mockParam_distances = {
                approach: 30,
                service: 300
            };

            const mockResult = 8;
            const testFn = destinationModel._calcApproachCosts(
                mockParam_isWithinBH, mockParam_distances, mockParam_back2home
            );

            expect(testFn).toBe(mockResult);
        })

        test('Route (), params: <isWithinBH> = false, <distances> = [>20, >250]', () => {
            const mockParam_isWithinBH = false;
            const mockParam_distances = {
                approach: 30,
                service: 300
            };

            const mockResult = 9;
            const testFn = destinationModel._calcApproachCosts(
                mockParam_isWithinBH, mockParam_distances, mockParam_back2home
            );

            expect(testFn).toBe(mockResult);
        })
    })

    describe('Testing valid fn calls, priority: <back2home> = false', () => {

        let mockParam_back2home;
        beforeEach(() => {
            mockParam_back2home = false;
        })

        test('Route (), params: <isWithinBH> = true, <distances> = [<20, <100]', () => {
            const mockParam_isWithinBH = true;
            const mockParam_distances = {
                approach: 15,
                service: 50
            };

            const mockResult = 4;
            const testFn = destinationModel._calcApproachCosts(
                mockParam_isWithinBH, mockParam_distances, mockParam_back2home
            );

            expect(testFn).toBe(mockResult);
        })

        test('Route (), params: <isWithinBH> = false, <distances> = [<20, <100]', () => {
            const mockParam_isWithinBH = false;
            const mockParam_distances = {
                approach: 15,
                service: 50
            };

            const mockResult = 4;
            const testFn = destinationModel._calcApproachCosts(
                mockParam_isWithinBH, mockParam_distances, mockParam_back2home
            );

            expect(testFn).toBe(mockResult);
        })

        test('Route (), params: <isWithinBH> = true, <distances> = [>20, <100]', () => {
            const mockParam_isWithinBH = true;
            const mockParam_distances = {
                approach: 30,
                service: 50
            };

            const mockResult = 8;
            const testFn = destinationModel._calcApproachCosts(
                mockParam_isWithinBH, mockParam_distances, mockParam_back2home
            );

            expect(testFn).toBe(mockResult);
        })

        test('Route (), params: <isWithinBH> = false, <distances> = [>20, <100]', () => {
            const mockParam_isWithinBH = false;
            const mockParam_distances = {
                approach: 30,
                service: 50
            };

            const mockResult = 9;
            const testFn = destinationModel._calcApproachCosts(
                mockParam_isWithinBH, mockParam_distances, mockParam_back2home
            );

            expect(testFn).toBe(mockResult);
        })

        test('Route (), params: <isWithinBH> = true, <distances> = [>20, >100]', () => {
            const mockParam_isWithinBH = true;
            const mockParam_distances = {
                approach: 30,
                service: 150
            };

            const mockResult = 8.5;
            const testFn = destinationModel._calcApproachCosts(
                mockParam_isWithinBH, mockParam_distances, mockParam_back2home
            );

            expect(testFn).toBe(mockResult);
        })

        test('Route (), params: <isWithinBH> = false, <distances> = [>20, >100]', () => {
            const mockParam_isWithinBH = false;
            const mockParam_distances = {
                approach: 30,
                service: 150
            };

            const mockResult = 9;
            const testFn = destinationModel._calcApproachCosts(
                mockParam_isWithinBH, mockParam_distances, mockParam_back2home
            );

            expect(testFn).toBe(mockResult);
        })

        test('Route (), params: <isWithinBH> = true, <distances> = [>20, >250]', () => {
            const mockParam_isWithinBH = true;
            const mockParam_distances = {
                approach: 30,
                service: 300
            };

            const mockResult = 9;
            const testFn = destinationModel._calcApproachCosts(
                mockParam_isWithinBH, mockParam_distances, mockParam_back2home
            );

            expect(testFn).toBe(mockResult);
        })

        test('Route (), params: <isWithinBH> = false, <distances> = [>20, >250]', () => {
            const mockParam_isWithinBH = false;
            const mockParam_distances = {
                approach: 30,
                service: 300
            };

            const mockResult = 9;
            const testFn = destinationModel._calcApproachCosts(
                mockParam_isWithinBH, mockParam_distances, mockParam_back2home
            );

            expect(testFn).toBe(mockResult);
        })
    })
})

describe('Destination tests, priority: _calcReturnCosts', () => {

    describe('Testing valid fn calls', () => {

        let testParam_params, testParam_routes, mockParam_latencyCosts, testParam_isWithinBH, testParam_response;
        beforeEach(() => {
            testParam_params = structuredClone(MockData_RouteMatrix['route1090-4020']);
            testParam_response = structuredClone(MockData_RouteMatrix['route1090-4020']['apiResult']);
            testParam_routes = {
                h2o: testParam_response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
                o2d: testParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
                d2o: testParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
                d2h: testParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 2}),
                o2h: testParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 2}),
            };
            testParam_params['latency'] = 180;
            testParam_isWithinBH = true;
        });

        test('Route (1090to4020), params: <back2home> = true, offBH', () => {
            testParam_params['back2home'] = true;
            testParam_isWithinBH = false;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcReturnCosts(
                testParam_params,
                testParam_routes,
                testParam_isWithinBH
            );
            const expectResult = 23;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Route (1090to4020), params: <back2home> = false, offBH', () => {
            testParam_params['back2home'] = false;
            testParam_isWithinBH = false;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcReturnCosts(
                testParam_params,
                testParam_routes,
                testParam_isWithinBH
            );
            const expectResult = 96.6;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Params: <back2home> = false, <withinBH> = true, servDist < 100', () => {
            const testParam_params = { back2home: false };
            const testParam_routes = {
                o2d: { distanceMeters: 40 },
                d2h: { distanceMeters: 50 }
            };
            const testParam_isWithinBH = true;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcReturnCosts(
                testParam_params, testParam_routes, testParam_isWithinBH
            );
            const expectResult = 20;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Params: <back2home> = false, <withinBH> = true, servDist > 100', () => {
            const testParam_params = { back2home: false };
            const testParam_routes = {
                o2d: { distanceMeters: 150 },
                d2h: { distanceMeters: 200 }
            };
            const testParam_isWithinBH = true;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcReturnCosts(
                testParam_params, testParam_routes, testParam_isWithinBH
            );
            const expectResult = 90;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Params: <back2home> = false, <withinBH> = true, servDist > 250', () => {
            const testParam_params = { back2home: false };
            const testParam_routes = {
                o2d: { distanceMeters: 300 },
                d2h: { distanceMeters: 350 }
            };
            const testParam_isWithinBH = true;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcReturnCosts(
                testParam_params, testParam_routes, testParam_isWithinBH
            );
            const expectResult = 175;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Route (1090to4020), params: <back2home> = true, withinBH, <latency> < 180', () => {
            testParam_params['back2home'] = true;
            testParam_params['latency'] = 120;
            testParam_params['pickupTIME'] = 8;
            testParam_isWithinBH = true;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcReturnCosts(
                testParam_params,
                testParam_routes,
                testParam_isWithinBH
            );
            const expectResult = 18.4;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Route (1090to4020), params: <back2home> = true, withinBH, <latency> >= 180, o2h.distance > 30', () => {
            testParam_params['back2home'] = true;
            testParam_params['pickupTIME'] = 8;
            testParam_params['latency'] = 180;
            testParam_isWithinBH = true;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcReturnCosts(
                testParam_params,
                testParam_routes,
                testParam_isWithinBH
            );
            const expectResult = 6.4;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Route(2824to2700), params: <back2home> = true, withinBH, <latency> >= 180, o2h.distance <= 30', () => {
            testParam_params = structuredClone(MockData_RouteMatrix['route2824-2700']);
            testParam_response = structuredClone(MockData_RouteMatrix['route2824-2700']['apiResult']);
            testParam_routes = {
                h2o: testParam_response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
                o2d: testParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
                d2o: testParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
                d2h: testParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 2}),
                o2h: testParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 2}),
            };
            testParam_params['back2home'] = true;
            testParam_params['latency'] = 180;
            testParam_isWithinBH = true;
            const destinationModel = new DrivingDestinationModel(googleRoutesApi);
            const testFn = destinationModel._calcReturnCosts(
                testParam_params,
                testParam_routes,
                testParam_isWithinBH
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
            const mockParam_servDist = mockParam_params['a_information']['servDist'];
            const testFn = destinationModel._addChargeParkFlatByBH(mockParam_params, mockParam_servDist);
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Route (2824to2700), params: <back2home> = false, <origin> != Vienna | VIE', () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2824-2700']);
            mockParam_params['back2home'] = false;
            const mockParam_servDist = mockParam_params['a_information']['servDist'];
            const testFn = destinationModel._addChargeParkFlatByBH(mockParam_params, mockParam_servDist);
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Route (1010to2361), params: <back2home> = false, <origin> == Vienna | VIE', () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route1010-2361']);
            mockParam_params['back2home'] = false;
            const mockParam_servDist = mockParam_params['a_information']['servDist'];
            const testFn = destinationModel._addChargeParkFlatByBH(mockParam_params, mockParam_servDist);
            const expectResult = 10;

            expect(testFn).toBe(expectResult);
        })

        test('Route (AKHto2544), params: <back2home> = false, <origin> = AKH Vienna, no zipCode', () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['routeAKH-2544']);
            mockParam_params['back2home'] = false;
            const mockParam_servDist = mockParam_params['a_information']['servDist'];
            const testFn = destinationModel._addChargeParkFlatByBH(mockParam_params, mockParam_servDist);
            const expectResult = 10;

            expect(testFn).toBe(expectResult);
        })

        test('Route (1090-4020), params: <back2home> = false, <servDist> > 60', () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route1090-4020']);
            mockParam_params['back2home'] = false;
            const mockParam_servDist = mockParam_params['a_information']['servDist'];
            const testFn = destinationModel._addChargeParkFlatByBH(mockParam_params, mockParam_servDist);
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })
    })
})

describe('Destination tests, priority: _calcDiscountLaToVIA', () => {

    let destinationModel;
    beforeEach(() => {
        destinationModel = new DrivingDestinationModel(googleRoutesApi);
    })

    describe('Testing fn calls with result = 6,-', () => {

        test('Route (2351to1300), params <servDist> < 40', () => {
            const mockData = structuredClone(MockData_RouteMatrix['route2351-1300']);
            const mockParam_originDetails = mockData['originDetails'];
            const mockParam_destinationDetails = mockData['destinationDetails'];
            const mockParam_servDist = mockData['a_information']['servDist'];
            const mockParam_pickUp = '08:00';

            const testFn = destinationModel._calcDiscountLaToVIA(
                mockParam_originDetails, mockParam_destinationDetails, mockParam_servDist, mockParam_pickUp
            );
            const expectResult = 6;

            expect(testFn).toBe(expectResult);
        })

        test('Route (2525to1300), params <servDist> > 40 < 55, <pickUp> == "05:00"', () => {
            const mockData = structuredClone(MockData_RouteMatrix['route2525-1300']);
            const mockParam_originDetails = mockData['originDetails'];
            const mockParam_destinationDetails = mockData['destinationDetails'];
            const mockParam_servDist = mockData['a_information']['servDist'];
            const mockParam_pickUp = '05:00';

            const testFn = destinationModel._calcDiscountLaToVIA(
                mockParam_originDetails, mockParam_destinationDetails, mockParam_servDist, mockParam_pickUp
            );
            const expectResult = 6;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing fn calls with result = 0,-', () => {

        test('Route (2351to1300), params: <pickUp> = "11:00"', () => {
            const mockData = structuredClone(MockData_RouteMatrix['route2351-1300']);
            const mockParam_originDetails = mockData['originDetails'];
            const mockParam_destinationDetails = mockData['destinationDetails'];
            const mockParam_servDist = mockData['a_information']['servDist'];
            const mockParam_pickUp = '11:00';

            const testFn = destinationModel._calcDiscountLaToVIA(
                mockParam_originDetails, mockParam_destinationDetails, mockParam_servDist, mockParam_pickUp
            );
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Route (1010to2361), params: <originDetails> != Lower Austria', () => {
            const mockData = structuredClone(MockData_RouteMatrix['route1010-2361']);
            const mockParam_originDetails = mockData['originDetails'];
            const mockParam_destinationDetails = mockData['destinationDetails'];
            const mockParam_servDist = mockData['a_information']['servDist'];
            const mockParam_pickUp = '08:00';

            const testFn = destinationModel._calcDiscountLaToVIA(
                mockParam_originDetails, mockParam_destinationDetails, mockParam_servDist, mockParam_pickUp
            );
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Route (2824to2700), params: <destinationDetails> != Vienna International Airport', () => {
            const mockData = structuredClone(MockData_RouteMatrix['route2824-2700']);
            const mockParam_originDetails = mockData['originDetails'];
            const mockParam_destinationDetails = mockData['destinationDetails'];
            const mockParam_servDist = mockData['a_information']['servDist'];
            const mockParam_pickUp = '08:00';

            const testFn = destinationModel._calcDiscountLaToVIA(
                mockParam_originDetails, mockParam_destinationDetails, mockParam_servDist, mockParam_pickUp
            );
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Route (2525to1300), params: <servDist> > 40 < 55, <pickUp> = "09:00"', () => {
            const mockData = structuredClone(MockData_RouteMatrix['route2525-1300']);
            const mockParam_originDetails = mockData['originDetails'];
            const mockParam_destinationDetails = mockData['destinationDetails'];
            const mockParam_servDist = mockData['a_information']['servDist'];
            const mockParam_pickUp = '09:00';

            const testFn = destinationModel._calcDiscountLaToVIA(
                mockParam_originDetails, mockParam_destinationDetails, mockParam_servDist, mockParam_pickUp
            );
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Route (1090to4020), all params invalid', () => {
            const mockData = structuredClone(MockData_RouteMatrix['route1090-4020']);
            const mockParam_originDetails = mockData['originDetails'];
            const mockParam_destinationDetails = mockData['destinationDetails'];
            const mockParam_servDist = mockData['a_information']['servDist'];
            const mockParam_pickUp = '11:00';

            const testFn = destinationModel._calcDiscountLaToVIA(
                mockParam_originDetails, mockParam_destinationDetails, mockParam_servDist, mockParam_pickUp
            );
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })
    })
})