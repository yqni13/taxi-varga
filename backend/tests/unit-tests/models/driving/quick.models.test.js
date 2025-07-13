const DrivingQuickModel = require("../../../../src/models/driving/quick.driving.model");
const googleRoutesApi = require("../../../../src/services/google-routes/google-routes.api");
const { QuickRouteOption } = require("../../../../src/utils/enums/quickroute-option.enum");
const MockData_RouteMatrix = require("../../../mock-data/routeMatrix_quick.mock.json");

describe('Quick tests, priority: calcQuickRoute', () => {

    describe('Testing valid fn calls', () => {

        beforeEach(() => {
            jest.resetModules();
        })

        test('Route (1230to2345), params: <back2origin> = true, <latency> = 22, <pickupTIME> = 5 (servTime ends before time limit of 06:00)', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route1230-2345']);
            mockParam_params['back2origin'] = 'true';
            mockParam_params['latency'] = 22;
            mockParam_params['pickupTIME'] = 5;

            const mockResult_service = structuredClone(MockData_RouteMatrix['route1230-2345']['serviceResult']);
            const mockResult_latency = { time: 25, costs: 12.5 };
            const mockResult_surcharge = 47;
            const mockResult_servCosts = 34.2;
            const mockResult_returnTarget = QuickRouteOption.OR;
            const mockResult_isRouteV2V = false;

            const mockAPI = {
                requestRouteMatrix: jest.fn().mockResolvedValue(mockResult_service),
                requestBorderRouteMatrix: jest.fn()
            };

            const quickModel = new DrivingQuickModel(mockAPI);
            jest.spyOn(quickModel, '_mapLatencyData').mockReturnValue(mockResult_latency);
            jest.spyOn(quickModel, '_updateCostsByTimeBasedSurcharge').mockReturnValue(mockResult_surcharge);
            jest.spyOn(quickModel, '_mapShortestReturnLocation').mockReturnValue({});
            jest.spyOn(quickModel, '_isRouteWithinVienna').mockReturnValue(mockResult_isRouteV2V);
            jest.spyOn(quickModel, '_calcServDistCosts').mockReturnValue(mockResult_servCosts);
            jest.spyOn(quickModel, '_mapReturnTarget').mockReturnValue(mockResult_returnTarget);

            const testFn = await quickModel.calcQuickRoute(mockParam_params);
            const expectSubObj = { routeData: {
                price: 47,
                servTime: 18,
                servDist: 7.3,
                latency: {
                    time: 25,
                    costs: 12.5
                },
                returnTarget: QuickRouteOption.OR
            }};

            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            expect(quickModel._mapLatencyData).toHaveBeenCalled();
            expect(quickModel._updateCostsByTimeBasedSurcharge).toHaveBeenCalled();
            expect(quickModel._isRouteWithinVienna).toHaveBeenCalled();
            expect(quickModel._calcServDistCosts).toHaveBeenCalled();
            expect(quickModel._mapReturnTarget).toHaveBeenCalled();
            expect(testFn).toMatchObject(expectSubObj);
        })

        test('Route (1230to2345), params: <back2origin> = false, <latency> = 9', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route1230-2345']);
            mockParam_params['back2origin'] = 'false';
            mockParam_params['latency'] = 9;

            const mockResult_service = structuredClone(MockData_RouteMatrix['route1230-2345']['serviceResult']);
            const mockResult_return = structuredClone(MockData_RouteMatrix['route1230-2345']['returnResult']);
            const mockResult_shortestReturn = { distance: 2.5, duration: 4, routeHome: false };
            const mockResult_latency = { time: 0, costs: 0 };
            const mockResult_surcharge = 34;
            const mockResult_servCosts = 34.2;
            const mockResult_returnTarget = QuickRouteOption.VB;
            const mockResult_isRouteV2V = false;

            const mockAPI = {
                requestRouteMatrix: jest.fn().mockResolvedValue(mockResult_service),
                requestBorderRouteMatrix: jest.fn().mockResolvedValue(mockResult_return)
            };

            const quickModel = new DrivingQuickModel(mockAPI);
            jest.spyOn(quickModel, '_mapLatencyData').mockReturnValue(mockResult_latency);
            jest.spyOn(quickModel, '_updateCostsByTimeBasedSurcharge').mockReturnValue(mockResult_surcharge);
            jest.spyOn(quickModel, '_mapShortestReturnLocation').mockReturnValue(mockResult_shortestReturn);
            jest.spyOn(quickModel, '_isRouteWithinVienna').mockReturnValue(mockResult_isRouteV2V);
            jest.spyOn(quickModel, '_calcServDistCosts').mockReturnValue(mockResult_servCosts);
            jest.spyOn(quickModel, '_mapReturnTarget').mockReturnValue(mockResult_returnTarget);

            const testFn = await quickModel.calcQuickRoute(mockParam_params);
            const expectSubObj = { routeData: {
                price: 34,
                servTime: 8,
                servDist: 3.4,
                latency: {
                    time: 0,
                    costs: 0
                },
                returnTarget: QuickRouteOption.VB
            }};

            expect(mockAPI.requestRouteMatrix).toHaveBeenCalled();
            expect(mockAPI.requestBorderRouteMatrix).toHaveBeenCalled();
            expect(quickModel._mapShortestReturnLocation).toHaveBeenCalled();
            expect(quickModel._mapLatencyData).toHaveBeenCalled();
            expect(quickModel._updateCostsByTimeBasedSurcharge).toHaveBeenCalled();
            expect(quickModel._isRouteWithinVienna).toHaveBeenCalled();
            expect(quickModel._calcServDistCosts).toHaveBeenCalled();
            expect(quickModel._mapReturnTarget).toHaveBeenCalled();
            expect(testFn).toMatchObject(expectSubObj);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Empty params', async () => {
            const mockParam_params = {};

            const quickModel = new DrivingQuickModel(googleRoutesApi);
            const testFn = await quickModel.calcQuickRoute(mockParam_params);
            const expectResult = { error: 'no params found' };

            expect(testFn).toMatchObject(expectResult);
        })
    })
})

describe('Quick tests, priority: _calcServDistCosts', () => {

    let quickModel;
    beforeEach(() => {
        quickModel = new DrivingQuickModel(googleRoutesApi);
    })

    describe('Testing valid fn calls', () => {

        test('Route (1230to2345), params: <back2origin> = false, service distance < 8', () => {
            const mockParam_response = structuredClone(MockData_RouteMatrix['route1230-2345']);
            const mockParam_returnObj = {
                distance: mockParam_response['returnResult'][0]['distanceMeters'],
                duration: mockParam_response['returnResult'][0]['duration'],
                routeHome: mockParam_response['a_information']['routeHome'] === 'home' ? true : false
            };
            const mockParam_back2origin = false;
            const mockParam_routes = {
                o2d: mockParam_response['serviceResult'][0],
                d2o: mockParam_response['serviceResult'][1]
            };
            const mockParam_servCostParams = {
                servDist: mockParam_routes.o2d.distanceMeters,
                servTime: mockParam_routes.o2d.duration,
                returnObj: mockParam_returnObj,
                back2origin: mockParam_back2origin,
                isRouteV2V: false
            };

            const testFn = quickModel._calcServDistCosts(mockParam_routes, mockParam_servCostParams);
            const expectResult = 15.3;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Route (1180to1100), params: <back2origin> = false, service distance > 8 <= 20', () => {
            const mockParam_response = structuredClone(MockData_RouteMatrix['route1180-1100']);
            const mockParam_returnObj = {
                distance: mockParam_response['returnResult'][0]['distanceMeters'],
                duration: mockParam_response['returnResult'][0]['duration'],
                routeHome: mockParam_response['a_information']['routeHome'] === 'home' ? true : false
            };
            const mockParam_back2origin = false;
            const mockParam_routes = {
                o2d: mockParam_response['serviceResult'][0],
                d2o: mockParam_response['serviceResult'][1]
            }
            const mockParam_servCostParams = {
                servDist: mockParam_routes.o2d.distanceMeters,
                servTime: mockParam_routes.o2d.duration,
                returnObj: mockParam_returnObj,
                back2origin: mockParam_back2origin,
                isRouteV2V: true
            };

            const testFn = quickModel._calcServDistCosts(mockParam_routes, mockParam_servCostParams);
            const expectResult = 23.5;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Route (1190to4020), params: <back2origin> = false, service distance > 20', () => {
            const mockParam_response = structuredClone(MockData_RouteMatrix['route1190-4020']);
            const mockParam_returnObj = {
                distance: mockParam_response['returnResult'][0]['distanceMeters'],
                duration: mockParam_response['returnResult'][0]['duration'],
                routeHome: mockParam_response['a_information']['routeHome'] === 'home' ? true : false
            };
            const mockParam_back2origin = false;
            const mockParam_routes = {
                o2d: mockParam_response['serviceResult'][0],
                d2o: mockParam_response['serviceResult'][1]
            };
            const mockParam_servCostParams = {
                servDist: mockParam_routes.o2d.distanceMeters,
                servTime: mockParam_routes.o2d.duration,
                returnObj: mockParam_returnObj,
                back2origin: mockParam_back2origin,
                isRouteV2V: false
            };

            const testFn = quickModel._calcServDistCosts(mockParam_routes, mockParam_servCostParams);
            const expectResult = 221.5;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Route (1230to2345), params: <back2origin> = true, service distance < 8', () => {
            const mockParam_response = structuredClone(MockData_RouteMatrix['route1230-2345']);
            const mockParam_returnObj = { distance: 0, duration: 0, routeHome: false };
            const mockParam_back2origin = true;
            const mockParam_routes = {
                o2d: mockParam_response['serviceResult'][0],
                d2o: mockParam_response['serviceResult'][1]
            };
            const mockParam_servCostParams = {
                servDist: mockParam_routes.o2d.distanceMeters + mockParam_routes.d2o.distanceMeters,
                servTime: mockParam_routes.o2d.duration + mockParam_routes.d2o.duration,
                returnObj: mockParam_returnObj,
                back2origin: mockParam_back2origin,
                isRouteV2V: false
            };

            const testFn = quickModel._calcServDistCosts(mockParam_routes, mockParam_servCostParams);
            const expectResult = 32.2;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Route (1100to1040), params: <back2origin> = true, service distance > 8 <= 20', () => {
            const mockParam_response = structuredClone(MockData_RouteMatrix['route1100-1040']);
            const mockParam_returnObj = { distance: 0, duration: 0, routeHome: false };
            const mockParam_back2origin = true;
            const mockParam_routes = {
                o2d: mockParam_response['serviceResult'][0],
                d2o: mockParam_response['serviceResult'][1]
            }
            const mockParam_servCostParams = {
                servDist: mockParam_routes.o2d.distanceMeters + mockParam_routes.d2o.distanceMeters,
                servTime: mockParam_routes.o2d.duration + mockParam_routes.d2o.duration,
                returnObj: mockParam_returnObj,
                back2origin: mockParam_back2origin,
                isRouteV2V: true
            };

            const testFn = quickModel._calcServDistCosts(mockParam_routes, mockParam_servCostParams);
            const expectResult = 33.3;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })

        test('Route (1190to4020), params: <back2origin> = true, service distance > 20', () => {
            const mockParam_response = structuredClone(MockData_RouteMatrix['route1190-4020']);
            const mockParam_returnObj = { distanceMeters: 0, duration: 0, routeHome: false };
            const mockParam_back2origin = true;
            const mockParam_routes = {
                o2d: mockParam_response['serviceResult'][0],
                d2o: mockParam_response['serviceResult'][1]
            }
            const mockParam_servCostParams = {
                servDist: mockParam_routes.o2d.distanceMeters + mockParam_routes.d2o.distanceMeters,
                servTime: mockParam_routes.o2d.duration + mockParam_routes.d2o.duration,
                returnObj: mockParam_returnObj,
                back2origin: mockParam_back2origin,
                isRouteV2V: false
            };

            const testFn = quickModel._calcServDistCosts(mockParam_routes, mockParam_servCostParams);
            const expectResult = 427.4;

            expect(testFn).toBeCloseTo(expectResult, 1);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('No route, params: <back2origin> = false, service distance == 0', () => {
            const mockParam_routes = {
                o2d: { distanceMeters: 0, duration: 0 },
                d2o: { distanceMeters: 0, duration: 0 }
            };
            const mockParam_servCostParams = {
                servDist: null,
                servTime: null,
                returnObj: null,
                back2origin: false,
                isRouteV2V: false
            };

            const testFn = quickModel._calcServDistCosts(mockParam_routes, mockParam_servCostParams);
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })
    })
})

describe('Quick tests, priority: _updateCostsByTimeBasedSurcharge', () => {

    let quickModel;
    beforeEach(() => {
        quickModel = new DrivingQuickModel(googleRoutesApi);
    })

    describe('Testing valid fn calls', () => {

        test('Params: <totalCosts> = 17, <servTime> = 22, <pickUp> = "05:03"', () => {
            const mockParam_totalCosts = 17;
            const mockParam_servTime = 22;
            const mockParam_pickUp = "05:03";

            const testFn = quickModel._updateCostsByTimeBasedSurcharge(mockParam_totalCosts, mockParam_servTime, mockParam_pickUp);
            const expectResult = 19.5;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <totalCosts> = 17, <servTime> = 22, <pickUp> = "07:45"', () => {
            const mockParam_totalCosts = 17;
            const mockParam_servTime = 22;
            const mockParam_pickUp = "07:45";

            const testFn = quickModel._updateCostsByTimeBasedSurcharge(mockParam_totalCosts, mockParam_servTime, mockParam_pickUp);
            const expectResult = 17;

            expect(testFn).toBe(expectResult);
        })
    })
})

describe('Quick tests, priority: _mapLatencyData', () => {

    let quickModel;
    beforeEach(() => {
        quickModel = new DrivingQuickModel(googleRoutesApi);
    })

    describe('Testing valid fn calls', () => {

        test('Params: <latencyInMin> == 0', () => {
            const mockParam_latencyInMin = 0;
            const testFn = quickModel._mapLatencyData(mockParam_latencyInMin);
            const expectResult = { time: 0, costs: 0 };

            expect(testFn).toMatchObject(expectResult);
        })

        test('Params: <latencyInMin> < 5', () => {
            const mockParam_latencyInMin = 4;
            const testFn = quickModel._mapLatencyData(mockParam_latencyInMin);
            const expectResult = { time: 0, costs: 0 };

            expect(testFn).toMatchObject(expectResult);
        })

        test('Params: <latencyInMin> > 5', () => {
            const mockParam_latencyInMin = 16;
            const testFn = quickModel._mapLatencyData(mockParam_latencyInMin);
            const expectResult = { time: 20, costs: 10 };

            expect(testFn).toMatchObject(expectResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        test('Params: <latencyInMin> == null', () => {
            const mockParam_latencyInMin = null;
            const testFn = quickModel._mapLatencyData(mockParam_latencyInMin);
            const expectResult = { time: 0, costs: 0 };

            expect(testFn).toMatchObject(expectResult);
        })
    })
})

describe('Quick tests, priority: _mapReturnTarget', () => {

    let quickModel;
    beforeEach(() => {
        quickModel = new DrivingQuickModel(googleRoutesApi);
    })

    describe('Testing valid fn calls', () => {

        test('Params: <back2origin> = true, <routeHome> = false, <isRouteV2V> = true', () => {
            const mockParam_back2origin = true;
            const mockParam_routeHome = false;
            const mockParam_isRouteV2V = true;
    
            const testFn = quickModel._mapReturnTarget(mockParam_back2origin, mockParam_routeHome, mockParam_isRouteV2V);
            const expectResult = QuickRouteOption.OR;
    
            expect(testFn).toBe(expectResult);
        })
    
        test('Params: <back2origin> = false, <routeHome> = false, <isRouteV2V> = true', () => {
            const mockParam_back2origin = false;
            const mockParam_routeHome = false;
            const mockParam_isRouteV2V = true;
    
            const testFn = quickModel._mapReturnTarget(mockParam_back2origin, mockParam_routeHome, mockParam_isRouteV2V);
            const expectResult = QuickRouteOption.DES;
    
            expect(testFn).toBe(expectResult);
        })
    
        test('Params: <back2origin> = false, <routeHome> = false, <isRouteV2V> = false', () => {
            const mockParam_back2origin = false;
            const mockParam_routeHome = false;
            const mockParam_isRouteV2V = false;
    
            const testFn = quickModel._mapReturnTarget(mockParam_back2origin, mockParam_routeHome, mockParam_isRouteV2V);
            const expectResult = QuickRouteOption.VB;
    
            expect(testFn).toBe(expectResult);
        })
    
        test('Params: <back2origin> = false, <routeHome> = true, <isRouteV2V> = false', () => {
            const mockParam_back2origin = false;
            const mockParam_routeHome = true;
            const mockParam_isRouteV2V = false;
    
            const testFn = quickModel._mapReturnTarget(mockParam_back2origin, mockParam_routeHome, mockParam_isRouteV2V);
            const expectResult = QuickRouteOption.HOME;
    
            expect(testFn).toBe(expectResult);
        })
    })
})

describe('Quick tests, priority: _mapShortestReturnLocation', () => {

    beforeEach(() => {
        jest.resetModules();
    })

    describe('Testing valid fn calls', () => {

        test('Route (1010to2500), expect: routeHome == true', () => {
            const mockParam_data = structuredClone(MockData_RouteMatrix['route1010-2500']['returnResult']);
            const mockResult = mockParam_data;

            jest.mock('../../../../src/utils/common.utils.js', () => ({
                quicksort: jest.fn().mockReturnValue(mockResult)
            }));
            const DrivingQuickModel = require('../../../../src/models/driving/quick.driving.model');
            const api = {};
            const quickModel = new DrivingQuickModel(api);
            const testFn = quickModel._mapShortestReturnLocation(mockParam_data);
            const expectResult = { 
                distance: mockResult[0].distanceMeters,
                duration: mockResult[0].duration,
                routeHome: true
            };

            expect(testFn).toMatchObject(expectResult);
        })

        test('Route (1010to2000), expect: routeHome == false', () => {
            const mockParam_data = structuredClone(MockData_RouteMatrix['route1010-2000']['returnResult']);
            const mockResult = mockParam_data;

            jest.mock('../../../../src/utils/common.utils.js', () => ({
                quicksort: jest.fn().mockReturnValue(mockResult)
            }));
            const DrivingQuickModel = require('../../../../src/models/driving/quick.driving.model');
            const api = {};
            const quickModel = new DrivingQuickModel(api);
            const testFn = quickModel._mapShortestReturnLocation(mockParam_data);
            const expectResult = { 
                distance: mockResult[0].distanceMeters,
                duration: mockResult[0].duration,
                routeHome: false
            };

            expect(testFn).toMatchObject(expectResult);
        })
    })
})

describe('Quick tests, priority: _isRouteWithinVienna', () => {

    let quickModel;
    beforeEach(() => {
        quickModel = new DrivingQuickModel(googleRoutesApi);
    })

    describe('Testing valid fn calls', () => {

        test('Route (1210to2201), expect: return = false', () => {
            const mockData = structuredClone(MockData_RouteMatrix['route1210-2201']);
            const mockParam_params = {
                originDetails: mockData.originDetails,
                destinationDetails: mockData.destinationDetails
            };

            const testFn = quickModel._isRouteWithinVienna(mockParam_params);
            const expectResult = false;

            expect(testFn).toBe(expectResult);
        })

        test('Route (1230to1010), expect: return = true', () => {
            const mockData = structuredClone(MockData_RouteMatrix['route1230-1010']);
            const mockParam_params = {
                originDetails: mockData.originDetails,
                destinationDetails: mockData.destinationDetails
            };

            const testFn = quickModel._isRouteWithinVienna(mockParam_params);
            const expectResult = true;

            expect(testFn).toBe(expectResult);
        })
    })
})