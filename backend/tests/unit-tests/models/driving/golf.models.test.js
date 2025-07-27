const DrivingGolfModel = require('../../../../src/models/driving/golf.driving.model');
const googleRoutesApi = require('../../../../src/services/google-routes/google-routes.api');
const { SupportModeOption } = require('../../../../src/utils/enums/supportmode-option.enum');
const MockData_RouteMatrix = require('../../../mock-data/routeMatrix_golf.mock.json');

describe('Flatrate tests, priority: calcGolfRoute', () => {

    describe('Testing valid fn calls', () => {

        test('Route (2542to2551to2542), params: service distance < 20, <supportMode> = none', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2542-2551-2542']);
            mockParam_params['supportMode'] = SupportModeOption.NONE;
            const mockResult = structuredClone(MockData_RouteMatrix['route2542-2551-2542']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const golfModel = new DrivingGolfModel(mockAPI);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 77 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('Route (2542to2551to2542), params: service distance < 20, <supportMode> = caddy', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2542-2551-2542']);
            mockParam_params['supportMode'] = SupportModeOption.CADDY;
            const mockResult = structuredClone(MockData_RouteMatrix['route2542-2551-2542']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const golfModel = new DrivingGolfModel(mockAPI);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 113 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('Route (2340to2013to2340), params: service distance > 20, <supportMode> = none', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2340-2013-2340']);
            mockParam_params['supportMode'] = SupportModeOption.NONE;
            const mockResult = structuredClone(MockData_RouteMatrix['route2340-2013-2340']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const golfModel = new DrivingGolfModel(mockAPI);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 192 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('Route (2340to2013to2340), params: service distance > 20, <supportMode> = player', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2340-2013-2340']);
            mockParam_params['supportMode'] = SupportModeOption.PLAYER;
            const mockResult = structuredClone(MockData_RouteMatrix['route2340-2013-2340']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const golfModel = new DrivingGolfModel(mockAPI);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 228 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Empty params', async () => {
            const mockParam_params = {};

            const golfModel = new DrivingGolfModel(googleRoutesApi);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectResult = { error: 'no params found' };

            expect(testFn).toMatchObject(expectResult);
        })
    })
})

describe('Flatrate tests, priority: _addChargeServiceDistanceBelow20Km', () => {

    let golfModel;
    beforeEach(() => {
        golfModel = new DrivingGolfModel(googleRoutesApi);
    })

    describe('Testing valid fn calls, priority: service distance', () => {

        test('Route (2542to2551to2542), params: <distance> < 20', () => {
            const mockParam_response = structuredClone(MockData_RouteMatrix['route2542-2551-2542']['apiResult']);
            const mockParam_routes = {
                h2o: mockParam_response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
                o2g: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
                g2d: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
                d2h: mockParam_response.find(obj => {return obj.originIndex === 3 && obj.destinationIndex === 2}),
            };

            const testFn = golfModel._addChargeServiceDistanceBelow20Km(mockParam_routes);
            const expectResult = 1.6;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Route (2340to2013to2340), params: <distance> > 20', () => {
            const mockParam_response = structuredClone(MockData_RouteMatrix['route2340-2013-2340']['apiResult']);
            const mockParam_routes = {
                h2o: mockParam_response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
                o2g: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
                g2d: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
                d2h: mockParam_response.find(obj => {return obj.originIndex === 3 && obj.destinationIndex === 2}),
            };

            const testFn = golfModel._addChargeServiceDistanceBelow20Km(mockParam_routes);
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })
    })
})

describe('Flatrate tests, priority: _calcHomeBasedRouteCosts', () => {

    let golfModel;
    beforeEach(() => {
        golfModel = new DrivingGolfModel(googleRoutesApi);
    })

    describe('Testing valid fn calls, priority: h2o/d2h distance', () => {

        test('Params: <distance> < 30', () => {
            const mockParam_distance = 11.7;
            const testFn = golfModel._calcHomeBasedRouteCosts(mockParam_distance);
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <distance> == 30', () => {
            const mockParam_distance = 30;
            const testFn = golfModel._calcHomeBasedRouteCosts(mockParam_distance);
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <distance> > 30', () => {
            const mockParam_distance = 47.5;
            const testFn = golfModel._calcHomeBasedRouteCosts(mockParam_distance);
            const expectResult = 7;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Params: <distance> == \'test\'', () => {
            const mockParam_distance = 'test';
            const testFn = golfModel._calcHomeBasedRouteCosts(mockParam_distance);
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })
    })
})

describe('Flatrate tests, priority: _calcStayCosts', () => {

    let golfModel;
    beforeEach(() => {
        golfModel = new DrivingGolfModel(googleRoutesApi);
    })

    describe('Testing valid fn calls, priority: time of stay', () => {

        test('Params: <time> < 360', () => {
            const mockParam_time = 359;
            const testFn = golfModel._calcStayCosts(mockParam_time);
            const expectSubObj = { hours: 6, costs: 48 };

            expect(testFn).toMatchObject(expectSubObj);
        })

        test('Params: <time> == 360', () => {
            const mockParam_time = 360;
            const testFn = golfModel._calcStayCosts(mockParam_time);
            const expectSubObj = { hours: 6, costs: 48 };

            expect(testFn).toMatchObject(expectSubObj);
        })

        test('Params: <time> > 360', () => {
            const mockParam_time = 420;
            const testFn = golfModel._calcStayCosts(mockParam_time);
            const expectSubObj = { hours: 7, costs: 60 };

            expect(testFn).toMatchObject(expectSubObj);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Params: <time> = \'test\'', () => {
            const mockParam_time = 'test';
            const testFn = golfModel._calcStayCosts(mockParam_time);
            const expectSubObj = { hours: 6, costs: 48 };

            expect(testFn).toMatchObject(expectSubObj);
        })
    })
})