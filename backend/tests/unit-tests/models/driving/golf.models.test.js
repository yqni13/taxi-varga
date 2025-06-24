const DrivingGolfModel = require('../../../../src/models/driving/golf.driving.model');
const googleRoutesApi = require('../../../../src/services/google-routes/google-routes.api');
const { SupportModeOption } = require('../../../../src/utils/enums/supportmode-option.enum');
const MockData_requestRouteMatrix = require('../../../mock-data/requestRouteMatrix.mock.json')['service-golf'];

describe('Flatrate tests, priority: calcGolfRoute', () => {

    describe('Testing valid fn calls', () => {

        test('2525 to 2551 to 2525, service distance < 30km, support mode: none', async () => {
            const mockParam_params = structuredClone(MockData_requestRouteMatrix['route2525-2551-2525']);
            mockParam_params['supportMode'] = SupportModeOption.NONE;
            const mockResult = structuredClone(MockData_requestRouteMatrix['route2525-2551-2525']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const golfModel = new DrivingGolfModel(mockAPI);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 90 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('2525 to 2551 to 2525, service distance < 30km, support mode: caddy', async () => {
            const mockParam_params = structuredClone(MockData_requestRouteMatrix['route2525-2551-2525']);
            mockParam_params['supportMode'] = SupportModeOption.CADDY;
            const mockResult = structuredClone(MockData_requestRouteMatrix['route2525-2551-2525']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const golfModel = new DrivingGolfModel(mockAPI);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 126 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('2340 to 2013 to 2340, service distance > 30km, support mode: none', async () => {
            const mockParam_params = structuredClone(MockData_requestRouteMatrix['route2340-2013-2340']);
            mockParam_params['supportMode'] = SupportModeOption.NONE;
            const mockResult = structuredClone(MockData_requestRouteMatrix['route2340-2013-2340']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const golfModel = new DrivingGolfModel(mockAPI);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 192 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('2340 to 2013 to 2340, service distance > 30km, support mode: player', async () => {
            const mockParam_params = structuredClone(MockData_requestRouteMatrix['route2340-2013-2340']);
            mockParam_params['supportMode'] = SupportModeOption.PLAYER;
            const mockResult = structuredClone(MockData_requestRouteMatrix['route2340-2013-2340']['apiResult']);
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

describe('Flatrate tests, priority: _addChargeServiceDistanceBelow30Km', () => {

    let golfModel;
    beforeEach(() => {
        golfModel = new DrivingGolfModel(googleRoutesApi);
    })

    describe('Testing valid fn calls, priority: service distance', () => {

        test('2525 to 2551 to 2525, distance < 30km', () => {
            const mockParam_response = structuredClone(MockData_requestRouteMatrix['route2525-2551-2525']['apiResult']);
            const mockParam_routes = {
                h2o: mockParam_response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
                o2g: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
                g2d: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
                d2h: mockParam_response.find(obj => {return obj.originIndex === 3 && obj.destinationIndex === 2}),
            };

            const testFn = golfModel._addChargeServiceDistanceBelow30Km(mockParam_routes);
            const expectResult = 4.2;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('2340 to 2013 to 2340, distance > 30km', () => {
            const mockParam_response = structuredClone(MockData_requestRouteMatrix['route2340-2013-2340']['apiResult']);
            const mockParam_routes = {
                h2o: mockParam_response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
                o2g: mockParam_response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
                g2d: mockParam_response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
                d2h: mockParam_response.find(obj => {return obj.originIndex === 3 && obj.destinationIndex === 2}),
            };

            const testFn = golfModel._addChargeServiceDistanceBelow30Km(mockParam_routes);
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

        test('Distance < 30', () => {
            const mockParam_distance = 11.7;
            const testFn = golfModel._calcHomeBasedRouteCosts(mockParam_distance);
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Distance == 30', () => {
            const mockParam_distance = 30;
            const testFn = golfModel._calcHomeBasedRouteCosts(mockParam_distance);
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Distance > 30', () => {
            const mockParam_distance = 47.5;
            const testFn = golfModel._calcHomeBasedRouteCosts(mockParam_distance);
            const expectResult = 7;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Distance == \'test\'', () => {
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

        test('Time < 360 min', () => {
            const mockParam_time = 359;
            const testFn = golfModel._calcStayCosts(mockParam_time);
            const expectSubObj = { hours: 6, costs: 48 };

            expect(testFn).toMatchObject(expectSubObj);
        })

        test('Time == 360 min', () => {
            const mockParam_time = 360;
            const testFn = golfModel._calcStayCosts(mockParam_time);
            const expectSubObj = { hours: 6, costs: 48 };

            expect(testFn).toMatchObject(expectSubObj);
        })

        test('Time > 360 min', () => {
            const mockParam_time = 420;
            const testFn = golfModel._calcStayCosts(mockParam_time);
            const expectSubObj = { hours: 7, costs: 60 };

            expect(testFn).toMatchObject(expectSubObj);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Time = \'test\'', () => {
            const mockParam_time = 'test';
            const testFn = golfModel._calcStayCosts(mockParam_time);
            const expectSubObj = { hours: 6, costs: 48 };

            expect(testFn).toMatchObject(expectSubObj);
        })
    })
})