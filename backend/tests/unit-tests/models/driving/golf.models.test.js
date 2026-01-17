const DrivingGolfModel = require('../../../../src/models/driving/golf.driving.model');
const googleRoutesApi = require('../../../../src/services/google-routes/google-routes.api');
const MockData_RouteMatrix = require('../../../mock-data/routeMatrix_golf.mock.json');

describe('Flatrate tests, priority: calcGolfRoute', () => {

    describe('Testing valid fn calls', () => {

        test('Route (2542to2551to2542), params: service distance < 20, <supportMode> = false', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2542-2551-2542']);
            mockParam_params['supportMode'] = true;
            const mockResult = structuredClone(MockData_RouteMatrix['route2542-2551-2542']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const golfModel = new DrivingGolfModel(mockAPI);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 60 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('Route (2340to2013to2340), params: service distance > 20, <supportMode> = false', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2340-2013-2340']);
            mockParam_params['supportMode'] = true;
            const mockResult = structuredClone(MockData_RouteMatrix['route2340-2013-2340']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const golfModel = new DrivingGolfModel(mockAPI);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 163 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('Route (2500to7574to2500), params: service distance > 200, <supportMode> = false', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2500-7574-2500']);
            mockParam_params['supportMode'] = false;
            mockParam_params['stay'] = 780;
            const mockResult = structuredClone(MockData_RouteMatrix['route2500-7574-2500']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const golfModel = new DrivingGolfModel(mockAPI);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 290 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('Route (2340to2013to2340), params: service distance > 20, <supportMode> = true', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2340-2013-2340']);
            mockParam_params['supportMode'] = true;
            const mockResult = structuredClone(MockData_RouteMatrix['route2340-2013-2340']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const golfModel = new DrivingGolfModel(mockAPI);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 163 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })
    })
})

describe('Flatrate tests, priority: _calcApproachH2O', () => {

    let golfModel;
    beforeEach(() => {
        golfModel = new DrivingGolfModel(googleRoutesApi);
    })

    describe('Testing valid fn calls, priority: h2o/d2h distance', () => {

        test('Params: <distance> < 20', () => {
            const mockParam_distance = 11.7;
            const testFn = golfModel._calcApproachH2O(mockParam_distance);
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <distance> == 20', () => {
            const mockParam_distance = 20;
            const testFn = golfModel._calcApproachH2O(mockParam_distance);
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <distance> > 20', () => {
            const mockParam_distance = 47.5;
            const testFn = golfModel._calcApproachH2O(mockParam_distance);
            const expectResult = 11;

            expect(testFn).toBe(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Params: <distance> == \'test\'', () => {
            const mockParam_distance = 'test';
            const testFn = golfModel._calcApproachH2O(mockParam_distance);
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

describe('Flatrate tests, priority: _mapSupportDiscount', () => {

    let golfModel;
    beforeEach(() => {
        golfModel = new DrivingGolfModel(googleRoutesApi);
    })

    describe('Testing valid fn calls, priority: time of stay', () => {

        test('Params: <costs> < 48, <support> == false', () => {
            const mockParam_costs = 100;
            const mockParam_support = false;
            const testFn = golfModel._mapSupportDiscount(mockParam_costs, mockParam_support);
            const expectSubObj = 100;

            expect(testFn).toBe(expectSubObj);
        })

        test('Params: <costs> < 48, <support> == true', () => {
            const mockParam_costs = 100;
            const mockParam_support = true;
            const testFn = golfModel._mapSupportDiscount(mockParam_costs, mockParam_support);
            const expectSubObj = 75;

            expect(testFn).toBe(expectSubObj);
        })

        test('Params: <costs> == 48, <support> == true', () => {
            const mockParam_costs = 192;
            const mockParam_support = true;
            const testFn = golfModel._mapSupportDiscount(mockParam_costs, mockParam_support);
            const expectSubObj = 144;

            expect(testFn).toBe(expectSubObj);
        })

        test('Params: <costs> > 48, <support> == true', () => {
            const mockParam_costs = 300;
            const mockParam_support = true;
            const testFn = golfModel._mapSupportDiscount(mockParam_costs, mockParam_support);
            const expectSubObj = 252;

            expect(testFn).toBe(expectSubObj);
        })
    })
})

describe('Flatrate tests, priority: _mapLongDistanceDiscount', () => {

    let golfModel;
    beforeEach(() => {
        golfModel = new DrivingGolfModel(googleRoutesApi);
    })

    describe('Testing valid fn calls, priority: service distance', () => {
        // Costs of € 100,- may not be realistic in total but easy to test.

        test('Params: <servDist> < 200', () => {
            const mockParam_costs = 100;
            const mockParam_servDist = 100;
            const testFn = golfModel._mapLongDistanceDiscount(mockParam_costs, mockParam_servDist);
            const expectResult = 100;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <servDist> >= 200 < 300', () => {
            const mockParam_costs = 100;
            const mockParam_servDist = 200;
            const testFn = golfModel._mapLongDistanceDiscount(mockParam_costs, mockParam_servDist);
            const expectResult = 90;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <servDist> >= 300 < 400', () => {
            const mockParam_costs = 100;
            const mockParam_servDist = 350;
            const testFn = golfModel._mapLongDistanceDiscount(mockParam_costs, mockParam_servDist);
            const expectResult = 85;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <servDist> >= 400', () => {
            const mockParam_costs = 100;
            const mockParam_servDist = 450;
            const testFn = golfModel._mapLongDistanceDiscount(mockParam_costs, mockParam_servDist);
            const expectResult = 80;

            expect(testFn).toBe(expectResult);
        })
    })
})