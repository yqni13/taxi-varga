const DrivingFlatrateModel = require('../../../../src/models/driving/flatrate.driving.model');
const googleRoutesApi = require('../../../../src/services/google-routes/google-routes.api');
const MockData_RouteMatrix = require('../../../mock-data/routeMatrix_flatrate.mock.json');

describe('Flatrate tests, priority: calcFlatrateRoute', () => {

    describe('Testing valid fn calls, tenancy: 180', () => {

        test('Route (2525to2551), params: approach < 20, return < 20', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2525-2551']);
            const mockResult = structuredClone(MockData_RouteMatrix['route2525-2551']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const flatrateModel = new DrivingFlatrateModel(mockAPI);
            const testFn = await flatrateModel.calcFlatrateRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 105 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('Route (2700to2651), params: approach < 20, return > 20', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2700-2651']);
            const mockResult = structuredClone(MockData_RouteMatrix['route2700-2651']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const flatrateModel = new DrivingFlatrateModel(mockAPI);
            const testFn = await flatrateModel.calcFlatrateRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 122 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('Route (1220to2514), params: approach > 20, return < 20', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route1220-2514']);
            const mockResult = structuredClone(MockData_RouteMatrix['route1220-2514']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const flatrateModel = new DrivingFlatrateModel(mockAPI);
            const testFn = await flatrateModel.calcFlatrateRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 117 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('Route (2320to1020), params: approach > 20, return > 20', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2320-1020']);
            const mockResult = structuredClone(MockData_RouteMatrix['route2320-1020']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const flatrateModel = new DrivingFlatrateModel(mockAPI);
            const testFn = await flatrateModel.calcFlatrateRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 123 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('Route (2491to2491), params: <origin> == <destination>', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2491-2491']);
            const mockResult = structuredClone(MockData_RouteMatrix['route2491-2491']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const flatrateModel = new DrivingFlatrateModel(mockAPI);
            const testFn = await flatrateModel.calcFlatrateRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 105 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Empty params', async () => {
            const mockParam_params = {};

            const flatrateModel = new DrivingFlatrateModel(googleRoutesApi);
            const testFn = await flatrateModel.calcFlatrateRoute(mockParam_params);
            const expectResult = { error: 'no params found' };

            expect(testFn).toMatchObject(expectResult);
        })
    })
})

describe('Flatrate tests, priority: _calcChargeByTenancyDiscount', () => {

    let flatrateModel;
    beforeEach(() => {
        flatrateModel = new DrivingFlatrateModel(googleRoutesApi);
    })

    describe('Testing valid fn calls', () => {

        test('Discount, params: service distance == 75, <tenancyTime> == 180', () => {
            const mockParam_distance = 75;
            const mockParam_tenancyTime = 180;
            const testFn = flatrateModel._calcChargeByTenancyDiscount(
                mockParam_distance,
                mockParam_tenancyTime
            );
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Discount, params: service distance == 75, <tenancyTime> > 180', () => {
            const mockParam_distance = 75;
            const mockParam_tenancyTime = 300;
            const testFn = flatrateModel._calcChargeByTenancyDiscount(
                mockParam_distance,
                mockParam_tenancyTime
            );
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Discount, params: service distance > 75, <tenancyTime> == 180', () => {
            const mockParam_distance = 97.3;
            const mockParam_tenancyTime = 180;
            const testFn = flatrateModel._calcChargeByTenancyDiscount(
                mockParam_distance,
                mockParam_tenancyTime
            );
            const expectResult = 11.1;

            expect(testFn).toBe(expectResult);
        })

        test('Discount, params: service distance > 75, <tenancyTime> > 180', () => {
            const mockParam_distance = 149.6;
            const mockParam_tenancyTime = 240;
            const testFn = flatrateModel._calcChargeByTenancyDiscount(
                mockParam_distance,
                mockParam_tenancyTime
            );
            const expectResult = 24.8;

            expect(testFn).toBe(expectResult);
        })
    })
})

describe('Flatrate tests, priority: _calcTenancyValues', () => {

    let flatrateModel;
    beforeEach(() => {
        flatrateModel = new DrivingFlatrateModel(googleRoutesApi);
    })

    describe('Testing valid fn calls', () => {

        test('Params: <time> < 180', () => {
            const mockParam_time = 90;
            const testFn = flatrateModel._calcTenancyValues(mockParam_time);
            const expectSubObj = { time: 180, costs: 105 };

            expect(testFn).toMatchObject(expectSubObj);
        })

        test('Params: <time> == 180, time % 30 == 0', () => {
            const mockParam_time = 180;
            const testFn = flatrateModel._calcTenancyValues(mockParam_time);
            const expectSubObj = { time: 180, costs: 105 };

            expect(testFn).toMatchObject(expectSubObj);
        })

        test('Params: <time> > 180, time % 30 == 0', () => {
            const mockParam_time = 210;
            const testFn = flatrateModel._calcTenancyValues(mockParam_time);
            const expectSubObj = { time: 210, costs: 122.5 };

            expect(testFn).toMatchObject(expectSubObj);
        })

        test('Params: <time> < 180, time % 30 != 0', () => {
            const mockParam_time = 211;
            const testFn = flatrateModel._calcTenancyValues(mockParam_time);
            const expectSubObj = { time: 240, costs: 140 };

            expect(testFn).toMatchObject(expectSubObj);
        })
    })
})