const DrivingFlatrateModel = require('../../../../src/models/driving/flatrate.driving.model');
const googleRoutesApi = require('../../../../src/services/google-routes/google-routes.api');
const MockData_requestRouteMatrix = require('../../mock-data/requestRouteMatrix.mock.json')['service-flatrate'];

describe('Flatrate tests, priority: calcFlatrateRoute', () => {

    describe.only('Testing valid fn calls, tenancy: 180', () => {

        test('2525 to 2551, approach < 20 km, return < 20 km', async () => {
            const mockParam_params = structuredClone(MockData_requestRouteMatrix['route2525-2551']);
            const mockResult = structuredClone(MockData_requestRouteMatrix['route2525-2551']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const flatrateModel = new DrivingFlatrateModel(mockAPI);
            const testFn = await flatrateModel.calcFlatrateRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 105 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('2700 to 2651, approach < 20 km, return > 20 km', async () => {
            const mockParam_params = structuredClone(MockData_requestRouteMatrix['route2700-2651']);
            const mockResult = structuredClone(MockData_requestRouteMatrix['route2700-2651']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const flatrateModel = new DrivingFlatrateModel(mockAPI);
            const testFn = await flatrateModel.calcFlatrateRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 122 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('1220 to 2514, approach > 20 km, return < 20 km', async () => {
            const mockParam_params = structuredClone(MockData_requestRouteMatrix['route1220-2514']);
            const mockResult = structuredClone(MockData_requestRouteMatrix['route1220-2514']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const flatrateModel = new DrivingFlatrateModel(mockAPI);
            const testFn = await flatrateModel.calcFlatrateRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 117 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('2320 to 1020, approach > 20 km, return > 20 km', async () => {
            const mockParam_params = structuredClone(MockData_requestRouteMatrix['route2320-1020']);
            const mockResult = structuredClone(MockData_requestRouteMatrix['route2320-1020']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const flatrateModel = new DrivingFlatrateModel(mockAPI);
            const testFn = await flatrateModel.calcFlatrateRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 123 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('2491 to 2491, origin == destination', async () => {
            const mockParam_params = structuredClone(MockData_requestRouteMatrix['route2491-2491']);
            const mockResult = structuredClone(MockData_requestRouteMatrix['route2491-2491']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const flatrateModel = new DrivingFlatrateModel(mockAPI);
            const testFn = await flatrateModel.calcFlatrateRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 105 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })
    })

    describe.only('Testing invalid fn calls', () => {

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

    describe.only('Testing valid fn calls', () => {

        test('Discount, Service distance == 75km, tenancy time < 180', () => {
            const mockParam_distance = 75;
            const mockParam_tenancyTime = 60;
            const testFn = flatrateModel._calcChargeByTenancyDiscount(
                mockParam_distance,
                mockParam_tenancyTime
            );
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Discount, Service distance == 75km, tenancy time == 180', () => {
            const mockParam_distance = 75;
            const mockParam_tenancyTime = 180;
            const testFn = flatrateModel._calcChargeByTenancyDiscount(
                mockParam_distance,
                mockParam_tenancyTime
            );
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Discount, Service distance == 75km, tenancy time > 180', () => {
            const mockParam_distance = 75;
            const mockParam_tenancyTime = 300;
            const testFn = flatrateModel._calcChargeByTenancyDiscount(
                mockParam_distance,
                mockParam_tenancyTime
            );
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Discount, Service distance > 75km, tenancy time < 180', () => {
            const mockParam_distance = 150;
            const mockParam_tenancyTime = 60;
            const testFn = flatrateModel._calcChargeByTenancyDiscount(
                mockParam_distance,
                mockParam_tenancyTime
            );
            const expectResult = 37.5;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Discount, Service distance > 75km, tenancy time == 180', () => {
            const mockParam_distance = 97.3;
            const mockParam_tenancyTime = 180;
            const testFn = flatrateModel._calcChargeByTenancyDiscount(
                mockParam_distance,
                mockParam_tenancyTime
            );
            const expectResult = 11.1;

            expect(testFn).toBe(expectResult);
        })

        test('Discount, Service distance > 75km, tenancy time > 180', () => {
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

    describe.only('Testing valid fn calls', () => {

        test('Tenancy: time < 180 min', () => {
            const mockParam_time = 90;
            const testFn = flatrateModel._calcTenancyValues(mockParam_time);
            const expectSubObj = { time: 180, costs: 105 };

            expect(testFn).toMatchObject(expectSubObj);
        })

        test('Tenancy: time == 180 min, time % 30 == 0', () => {
            const mockParam_time = 180;
            const testFn = flatrateModel._calcTenancyValues(mockParam_time);
            const expectSubObj = { time: 180, costs: 105 };

            expect(testFn).toMatchObject(expectSubObj);
        })

        test('Tenancy: time > 180 min, time % 30 == 0', () => {
            const mockParam_time = 210;
            const testFn = flatrateModel._calcTenancyValues(mockParam_time);
            const expectSubObj = { time: 210, costs: 122.5 };

            expect(testFn).toMatchObject(expectSubObj);
        })

        test('Tenancy: time < 180 min, time % 30 != 0', () => {
            const mockParam_time = 211;
            const testFn = flatrateModel._calcTenancyValues(mockParam_time);
            const expectSubObj = { time: 240, costs: 140 };

            expect(testFn).toMatchObject(expectSubObj);
        })
    })
})