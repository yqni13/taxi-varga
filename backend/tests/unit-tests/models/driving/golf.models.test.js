const Utils = require('../../../../src/utils/common.utils');
const { UnexpectedException } = require('../../../../src/utils/exceptions/common.exception');
const { mapMockApiResult } = require('../../../common.test-utils');
const DrivingGolfModel = require('../../../../src/models/driving/golf.driving.model');
const googleRoutesApi = require('../../../../src/services/google-routes/google-routes.api');
const MockData_RouteMatrix = require('../../../mock-data/routeMatrix_golf.mock.json');

const expectExceptionResult = UnexpectedException;
const mockBoolean = false;

describe('Flatrate tests, priority: calcGolfRoute', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Testing valid fn calls', () => {

        test('Route (2542to2551to2542), params: service distance < 20, <passengers> = 1', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2542-2551-2542']);
            mockParam_params['supportMode'] = true;
            mockParam_params['stayInMinutes'] = 480;
            const mockResult = structuredClone(MockData_RouteMatrix['route2542-2551-2542']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const golfModel = new DrivingGolfModel(mockAPI);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 59 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('Route (2340to2013to2340), params: service distance > 20, <passengers> = 1', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2340-2013-2340']);
            mockParam_params['supportMode'] = true;
            mockParam_params['stayInMinutes'] = 400;
            const mockResult = structuredClone(MockData_RouteMatrix['route2340-2013-2340']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const golfModel = new DrivingGolfModel(mockAPI);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 126 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('Route (2500to7574to2500), params: service distance > 200, <passengers> = 1', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2500-7574-2500']);
            mockParam_params['supportMode'] = false;
            mockParam_params['stayInMinutes'] = 540;
            const mockResult = structuredClone(MockData_RouteMatrix['route2500-7574-2500']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const golfModel = new DrivingGolfModel(mockAPI);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 225 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('Route (1010to2821to1010), params: service distance > 20, <passengers> = 1', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route1010-2821-1010']);
            mockParam_params['supportMode'] = false;
            mockParam_params['stayInMinutes'] = 480;
            const mockResult = structuredClone(MockData_RouteMatrix['route1010-2821-1010']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const golfModel = new DrivingGolfModel(mockAPI);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 195 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('Route (2340to2013to2340), params: service distance > 20, <passengers> = 3', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2340-2013-2340']);
            mockParam_params['youthOption'] = true;
            mockParam_params['passengers'] = 3;
            mockParam_params['stayInMinutes'] = 540;
            const mockResult = structuredClone(MockData_RouteMatrix['route2340-2013-2340']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const golfModel = new DrivingGolfModel(mockAPI);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 126 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })

        test('Route (2340to2013to2340), params: service distance > 20, <passengers> = 3', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route2340-2013-2340']);
            mockParam_params['supportMode'] = true;
            mockParam_params['passengers'] = 3;
            mockParam_params['stayInMinutes'] = 540;
            const mockResult = structuredClone(MockData_RouteMatrix['route2340-2013-2340']['apiResult']);
            const mockAPI = { requestRouteMatrix: jest.fn().mockResolvedValue(mockResult) };

            const golfModel = new DrivingGolfModel(mockAPI);
            const testFn = await golfModel.calcGolfRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 126 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
        })
    })

    describe('Testing invalid fn calls', () => {
    
        test('Throw UnexpectedException by catch-block', async () => {
            const mockParam_params = null;
            const mockResult = null;
            const mockErrorMsg = 'ERROR ON MODEL CALCULATION + API';
            const mockAPI = { requestMapsMatrix: jest.fn().mockResolvedValue(mockResult) };
            const golfModel = new DrivingGolfModel(mockAPI);

            jest.spyOn(Utils, 'logError').mockReturnValue();
            const _ = mapMockApiResult(mockResult, mockBoolean, mockErrorMsg);

            await expect(() => golfModel.calcGolfRoute(mockParam_params))
                .rejects.toThrow(expectExceptionResult);
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

describe('Flatrate tests, priority: _calcSingleDayStayCosts', () => {

    let golfModel;
    beforeEach(() => {
        golfModel = new DrivingGolfModel(googleRoutesApi);
    })

    describe('Testing valid fn calls', () => {

        test('Params: <>', () => {
            const testFn = golfModel._calcSingleDayStayCosts();
            const expectResult = 48;

            expect(testFn).toBe(expectResult);
        })
    })
})

describe('Flatrate tests, priority: _calcMultiDayStayCosts', () => {

    let golfModel;
    beforeEach(() => {
        golfModel = new DrivingGolfModel(googleRoutesApi);
    })

    describe('Testing valid fn calls', () => {

        test('Params: <days> = 2', () => {
            const mockParam_days = 2;
            const testFn = golfModel._calcMultiDayStayCosts(mockParam_days);
            const expectResult = 2 * 54;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <days> = 8', () => {
            const mockParam_days = 8;
            const testFn = golfModel._calcMultiDayStayCosts(mockParam_days);
            const expectResult = 8 * 54;

            expect(testFn).toBe(expectResult);
        })
    })
})

describe('Flatrate tests, priority: _calcDiscountByOptions', () => {

    let golfModel;
    beforeEach(() => {
        golfModel = new DrivingGolfModel(googleRoutesApi);
    })

    describe('Testing valid fn calls', () => {

        test('Params: <isYouthOption> = false, <isSupportOption> = false', () => {
            const mockParam_params = { isYouthOption: false, isSupportOption: false, servDist: 100 };
            const testFn = golfModel._calcDiscountByOptions(mockParam_params);
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <isYouthOption> = true, <isSupportOption> = false', () => {
            const mockParam_params = { isYouthOption: true, isSupportOption: false, servDist: 100 };
            const testFn = golfModel._calcDiscountByOptions(mockParam_params);
            const expectResult = 100 * 0.15;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <isYouthOption> = false, <isSupportOption> = true', () => {
            const mockParam_params = { isYouthOption: false, isSupportOption: true, servDist: 100 };
            const testFn = golfModel._calcDiscountByOptions(mockParam_params);
            const expectResult = 100 * 0.15;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <isYouthOption> = true, <isSupportOption> = true', () => {
            const mockParam_params = { isYouthOption: true, isSupportOption: true, servDist: 100 };
            const testFn = golfModel._calcDiscountByOptions(mockParam_params);
            const expectResult = 100 * 0.15;

            expect(testFn).toBe(expectResult);
        })
    })
})

describe('Flatrate tests, priority: _mapFlatRateDiscount', () => {

    let golfModel;
    beforeEach(() => {
        golfModel = new DrivingGolfModel(googleRoutesApi);
    })

    describe('Testing valid fn calls, priority: time of stay', () => {

        test('Params: discount < 48, <youthOption> = false, <supportMode> = false', () => {
            const mockParam_paramsFlatRateDiscount = {
                costs: 100,
                isYouthOption: false,
                isSupportOption: false,
                passengers: 1
            };
            const testFn = golfModel._mapFlatRateDiscount(mockParam_paramsFlatRateDiscount);
            const expectSubObj = 100;

            expect(testFn).toBe(expectSubObj);
        })

        test('Params: discount < 48, <youthOption> = true, <supportMode> = false', () => {
            const mockParam_paramsFlatRateDiscount = {
                costs: 100,
                isYouthOption: true,
                isSupportOption: false,
                passengers: 1
            };
            const testFn = golfModel._mapFlatRateDiscount(mockParam_paramsFlatRateDiscount);
            const expectSubObj = 75;

            expect(testFn).toBe(expectSubObj);
        })

        test('Params: discount == 48, <youthOption> = true, <supportMode> = false', () => {
            const mockParam_paramsFlatRateDiscount = {
                costs: 192,
                isYouthOption: true,
                isSupportOption: false,
                passengers: 1
            };
            const testFn = golfModel._mapFlatRateDiscount(mockParam_paramsFlatRateDiscount);
            const expectSubObj = 144;

            expect(testFn).toBe(expectSubObj);
        })

        test('Params: discount > 48, <youthOption> = true, <supportMode> = false', () => {
            const mockParam_paramsFlatRateDiscount = {
                costs: 200,
                isYouthOption: true,
                isSupportOption: false,
                passengers: 1
            };
            const testFn = golfModel._mapFlatRateDiscount(mockParam_paramsFlatRateDiscount);
            const expectSubObj = 152;

            expect(testFn).toBe(expectSubObj);
        })

        test('Params: <costs> < 48, <youthOption> = false, <supportMode> = true', () => {
            const mockParam_paramsFlatRateDiscount = {
                costs: 100,
                isYouthOption: false,
                isSupportOption: true,
                passengers: 1
            };
            const testFn = golfModel._mapFlatRateDiscount(mockParam_paramsFlatRateDiscount);
            const expectSubObj = 75;

            expect(testFn).toBe(expectSubObj);
        })

        test('Params: <costs> == 48, <youthOption> = false, <supportMode> = true', () => {
            const mockParam_paramsFlatRateDiscount = {
                costs: 192,
                isYouthOption: false,
                isSupportOption: true,
                passengers: 1
            };
            const testFn = golfModel._mapFlatRateDiscount(mockParam_paramsFlatRateDiscount);
            const expectSubObj = 144;

            expect(testFn).toBe(expectSubObj);
        })

        test('Params: <costs> > 48, <youthOption> = false, <supportMode> = true', () => {
            const mockParam_paramsFlatRateDiscount = {
                costs: 200,
                isYouthOption: false,
                isSupportOption: true,
                passengers: 1
            };
            const testFn = golfModel._mapFlatRateDiscount(mockParam_paramsFlatRateDiscount);
            const expectSubObj = 152;

            expect(testFn).toBe(expectSubObj);
        })
    })
})