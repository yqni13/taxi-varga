const DrivingFlatrateModel = require('../../../../src/models/driving/flatrate.driving.model');
const googleRoutesApi = require('../../../../src/services/google-routes/google-routes.api');
const MockData_requestRouteMatrix = require('../../mock-data/requestRouteMatrix.mock.json')['service-flatrate'];

describe('Flatrate tests, priority: calcFlatrateRoute', () => {

    describe.only('Testing valid calculations, tenancy: 180', () => {

        test('2525 to 2551, approach < 20 km, return < 20 km', async () => {
            const mockParam_params = MockData_requestRouteMatrix['route-2525To2551'];
            const mockResult = MockData_requestRouteMatrix['route-2525To2551']['apiResult'];
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const model = new DrivingFlatrateModel(mockAPI);
            const testFn = await model.calcFlatrateRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 109 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('2700 to 2651, approach < 20 km, return > 20 km', async () => {
            const mockParam_params = MockData_requestRouteMatrix['route-2700To2651'];
            const mockResult = MockData_requestRouteMatrix['route-2700To2651']['apiResult'];
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const model = new DrivingFlatrateModel(mockAPI);
            const testFn = await model.calcFlatrateRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 145 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('1220 to 2514, approach > 20 km, return < 20 km', async () => {
            const mockParam_params = MockData_requestRouteMatrix['route-1220To2514'];
            const mockResult = MockData_requestRouteMatrix['route-1220To2514']['apiResult'];
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const model = new DrivingFlatrateModel(mockAPI);
            const testFn = await model.calcFlatrateRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 136 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('2320 to 1020, approach > 20 km, return > 20 km', async () => {
            const mockParam_params = MockData_requestRouteMatrix['route-2320To1020'];
            const mockResult = MockData_requestRouteMatrix['route-2320To1020']['apiResult'];
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const model = new DrivingFlatrateModel(mockAPI);
            const testFn = await model.calcFlatrateRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 133 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('2491 to 2491, origin == destination', async () => {
            const mockParam_params = MockData_requestRouteMatrix['route-2491To2491'];
            const mockResult = MockData_requestRouteMatrix['route-2491To2491']['apiResult'];
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const model = new DrivingFlatrateModel(mockAPI);
            const testFn = await model.calcFlatrateRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 105 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })
    })

    describe.only('Testing invalid calculations', () => {

        test('Invalid params', async () => {
            const mockParams = {};

            const airportModel = new DrivingFlatrateModel(googleRoutesApi);
            const testFn = await airportModel.calcFlatrateRoute(mockParams);
            const expectResult = { error: 'no params found' };

            expect(testFn).toMatchObject(expectResult);
        })
    })
})

describe('Flatrate tests, priority: _calcChargeByTenancyDiscount', () => {

    let model;
    beforeEach(() => {
        model = new DrivingFlatrateModel(googleRoutesApi);
    })

    describe.only('Testing valid calculations', () => {

        test('No discount, service distance < 25, duration < 60', () => {
            const mockParam_params = { duration: 17.3, distanceMeters: 16.8};
            const testFn = model._calcChargeByTenancyDiscount(mockParam_params);
            const expectResult = 8.4;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('No discount, service distance > 25, duration < 60', () => {
            const mockParam_params = { duration: 40.2, distanceMeters: 28.4};
            const testFn = model._calcChargeByTenancyDiscount(mockParam_params);
            const expectResult = 14.2;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Discount, service distance > 25, duration > 60', () => {
            const mockParam_params = { duration: 72.8, distanceMeters: 45.1};
            const testFn = model._calcChargeByTenancyDiscount(mockParam_params);
            const expectResult = 10.1;

            expect(testFn).toBe(expectResult);
        })

        test('Discount, Service distance > 25, duration == 60', () => {
            const mockParam_params = { duration: 60, distanceMeters: 67.9};
            const testFn = model._calcChargeByTenancyDiscount(mockParam_params);
            const expectResult = 21.5;

            expect(testFn).toBe(expectResult);
        })
    })
})

describe('Flatrate tests, priority: _calcTenancyValues', () => {

    let model;
    beforeEach(() => {
        model = new DrivingFlatrateModel(googleRoutesApi);
    })

    describe.only('Testing valid calculations', () => {

        test('Tenancy: time < 180 min', () => {
            const mockParam_time = 90;
            const testFn = model._calcTenancyValues(mockParam_time);
            const expectSubObj = { time: 180, costs: 105 };

            expect(testFn).toMatchObject(expectSubObj);
        })

        test('Tenancy: time == 180 min, time % 30 == 0', () => {
            const mockParam_time = 180;
            const testFn = model._calcTenancyValues(mockParam_time);
            const expectSubObj = { time: 180, costs: 105 };

            expect(testFn).toMatchObject(expectSubObj);
        })

        test('Tenancy: time > 180 min, time % 30 == 0', () => {
            const mockParam_time = 210;
            const testFn = model._calcTenancyValues(mockParam_time);
            const expectSubObj = { time: 210, costs: 122.5 };

            expect(testFn).toMatchObject(expectSubObj);
        })

        test('Tenancy: time < 180 min, time % 30 != 0', () => {
            const mockParam_time = 211;
            const testFn = model._calcTenancyValues(mockParam_time);
            const expectSubObj = { time: 240, costs: 140 };

            expect(testFn).toMatchObject(expectSubObj);
        })
    })
})