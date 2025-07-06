const DrivingQuickModel = require("../../../../src/models/driving/quick.driving.model");
const googleRoutesApi = require("../../../../src/services/google-routes/google-routes.api");
const MockData_RouteMatrix = require("../../../mock-data/routeMatrix_quick.mock.json");

describe('Quick tests, priority: calcQuickRoute', () => {

    // describe('Testing valid fn calls', () => {

    //     beforeEach(() => {
    //         jest.resetModules();
    //     })

    //     test('Route (1230to2345), params: <back2origin> = true, <latency> = 22', async () => {
    //         const mockParam_params = structuredClone(MockData_RouteMatrix['route1230-2345']);
    //         mockParam_params['back2origin'] = true;
    //         mockParam_params['latency'] = 22;
    //         console.log("params: ", mockParam_params);
    //         const mockResult_service = structuredClone(MockData_RouteMatrix['route1230-2345']['serviceResult']);
    //         const mockResult_latency = { time: 25, costs: 12.5 };
    //         const mockResult_servCosts = 34.2;

    //         jest.mock('../../../../src/services/google-routes/google-routes.api.js', () => ({
    //             requestRouteMatrix: jest.fn().mockResolvedValue(mockResult_service),
    //         }));
    //         jest.mock('./quick.models.test.js', () => ({
    //             _mapLatencyData: jest.fn().mockReturnValue(mockResult_latency),
    //             _calcServDistCosts: jest.fn().mockReturnValue(mockResult_servCosts)
    //         }))
    //         const DrivingQuickModel = require('../../../../src/models/driving/quick.driving.model');
    //         const googleRoutesApi = require('../../../../src/services/google-routes/google-routes.api');
    //         const quickModel = new DrivingQuickModel(googleRoutesApi);
    //         const testFn = await quickModel.calcQuickRoute(mockParam_params);
    //         const expectSubObj = { routeData: {
    //             price: 47,
    //             servTime: 18,
    //             latency: {
    //                 time: 25,
    //                 costs: 12.5
    //             },
    //             returnTarget: 'h'
    //         }};

    //         expect(testFn).toMatchObject(expectSubObj);
    //     })
    // })

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

        test('Route (1230to2345), params: <back2origin> = false, service distance < 20', () => {
            const mockParam_response = structuredClone(MockData_RouteMatrix['route1230-2345']);
            const mockParam_returnObj = {
                distance: mockParam_response['returnResult'][0]['distanceMeters'],
                duration: mockParam_response['returnResult'][0]['duration'],
                routeHome: mockParam_response['a_information']['routeHome'] === 'h' ? true : false
            };
            const mockParam_back2origin = false;
            const mockParam_routes = {
                o2d: mockParam_response['serviceResult'][0],
                d2o: mockParam_response['serviceResult'][1],
                d2v: !mockParam_back2origin && !mockParam_returnObj.routeHome ? mockParam_returnObj : null,
                d2h: !mockParam_back2origin && mockParam_returnObj.routeHome ? mockParam_returnObj : null
            }
            const mockParam_servTime = mockParam_routes.o2d.duration;
    
            const testFn = quickModel._calcServDistCosts(
                mockParam_routes,
                mockParam_servTime,
                mockParam_returnObj,
                mockParam_back2origin
            );
            const expectResult = 16;
    
            expect(testFn).toBeCloseTo(expectResult, 1);
        })
    
        test('Route (1010to2500), params: <back2origin> = false, service distance > 20 <= 50', () => {
            const mockParam_response = structuredClone(MockData_RouteMatrix['route1010-2500']);
            const mockParam_returnObj = {
                distance: mockParam_response['returnResult'][0]['distanceMeters'],
                duration: mockParam_response['returnResult'][0]['duration'],
                routeHome: mockParam_response['a_information']['routeHome'] === 'h' ? true : false
            };
            const mockParam_back2origin = false;
            const mockParam_routes = {
                o2d: mockParam_response['serviceResult'][0],
                d2o: mockParam_response['serviceResult'][1],
                d2v: !mockParam_back2origin && !mockParam_returnObj.routeHome ? mockParam_returnObj : null,
                d2h: !mockParam_back2origin && mockParam_returnObj.routeHome ? mockParam_returnObj : null
            }
            const mockParam_servTime = mockParam_routes.o2d.duration;
    
            const testFn = quickModel._calcServDistCosts(
                mockParam_routes,
                mockParam_servTime,
                mockParam_returnObj,
                mockParam_back2origin
            );
            const expectResult = 49.8;
    
            expect(testFn).toBeCloseTo(expectResult, 1);
        })
    
        test('Route (1190to4020), params: <back2origin> = false, service distance > 50', () => {
            const mockParam_response = structuredClone(MockData_RouteMatrix['route1190-4020']);
            const mockParam_returnObj = {
                distance: mockParam_response['returnResult'][0]['distanceMeters'],
                duration: mockParam_response['returnResult'][0]['duration'],
                routeHome: mockParam_response['a_information']['routeHome'] === 'h' ? true : false
            };
            const mockParam_back2origin = false;
            const mockParam_routes = {
                o2d: mockParam_response['serviceResult'][0],
                d2o: mockParam_response['serviceResult'][1],
                d2v: !mockParam_back2origin && !mockParam_returnObj.routeHome ? mockParam_returnObj : null,
                d2h: !mockParam_back2origin && mockParam_returnObj.routeHome ? mockParam_returnObj : null
            }
            const mockParam_servTime = mockParam_routes.o2d.duration;
    
            const testFn = quickModel._calcServDistCosts(
                mockParam_routes,
                mockParam_servTime,
                mockParam_returnObj,
                mockParam_back2origin
            );
            const expectResult = 221.5;
    
            expect(testFn).toBeCloseTo(expectResult, 1);
        })
    
        test('Route (1230to2345), params: <back2origin> = true, service distance < 20', () => {
            const mockParam_response = structuredClone(MockData_RouteMatrix['route1230-2345']);
            const mockParam_returnObj = { distanceMeters: 0, duration: 0, routeHome: false };
            const mockParam_back2origin = true;
            const mockParam_routes = {
                o2d: mockParam_response['serviceResult'][0],
                d2o: mockParam_response['serviceResult'][1],
                d2v: null,
                d2h: null
            }
            const mockParam_servTime = mockParam_routes.o2d.duration + mockParam_routes.d2o.duration;
    
            const testFn = quickModel._calcServDistCosts(
                mockParam_routes,
                mockParam_servTime,
                mockParam_returnObj,
                mockParam_back2origin
            );
            const expectResult = 34.2;
    
            expect(testFn).toBeCloseTo(expectResult, 1);
        })
    
        test('Route (1210to2201), params: <back2origin> = true, service distance > 20 <= 50', () => {
            const mockParam_response = structuredClone(MockData_RouteMatrix['route1210-2201']);
            const mockParam_returnObj = { distanceMeters: 0, duration: 0, routeHome: false };
            const mockParam_back2origin = true;
            const mockParam_routes = {
                o2d: mockParam_response['serviceResult'][0],
                d2o: mockParam_response['serviceResult'][1],
                d2v: null,
                d2h: null
            }
            const mockParam_servTime = mockParam_routes.o2d.duration + mockParam_routes.d2o.duration;
    
            const testFn = quickModel._calcServDistCosts(
                mockParam_routes,
                mockParam_servTime,
                mockParam_returnObj,
                mockParam_back2origin
            );
            const expectResult = 60.4;
    
            expect(testFn).toBeCloseTo(expectResult, 1);
        })
    
        test('Route (1190to4020), params: <back2origin> = true, service distance > 50', () => {
            const mockParam_response = structuredClone(MockData_RouteMatrix['route1190-4020']);
            const mockParam_returnObj = { distanceMeters: 0, duration: 0, routeHome: false };
            const mockParam_back2origin = true;
            const mockParam_routes = {
                o2d: mockParam_response['serviceResult'][0],
                d2o: mockParam_response['serviceResult'][1],
                d2v: null,
                d2h: null
            }
            const mockParam_servTime = mockParam_routes.o2d.duration + mockParam_routes.d2o.duration;
    
            const testFn = quickModel._calcServDistCosts(
                mockParam_routes,
                mockParam_servTime,
                mockParam_returnObj,
                mockParam_back2origin
            );
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
            const mockParam_servTime = null;
            const mockParam_returnObj = null;
            const mockParam_back2origin = false;

            const testFn = quickModel._calcServDistCosts(
                mockParam_routes,
                mockParam_servTime,
                mockParam_returnObj,
                mockParam_back2origin
            );
            const expectResult = 0;

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

describe('Quick tests, priority: _mapShortestReturnLocation', () => {

    beforeEach(() => {
        jest.resetModules();
    })

    describe('Testing valid fn calls', () => {

        test('Route (1010to2500), expect: routeHome == true', () => {
            const mockParam_data = structuredClone(MockData_RouteMatrix['route1010-2500']['returnResult']);
            const mockResult = mockParam_data;

            jest.mock('../../../../src/utils/common.utils.js', () => ({
                sortByQuickSort: jest.fn().mockReturnValue(mockResult)
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
                sortByQuickSort: jest.fn().mockReturnValue(mockResult)
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