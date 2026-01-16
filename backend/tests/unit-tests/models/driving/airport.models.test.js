const DrivingAirportModel = require('../../../../src/models/driving/airport.driving.model');
const googleRoutesApi = require('../../../../src/services/google-routes/google-routes.api');
const MockData_requestMapsMatrix = require('../../../mock-data/requestMapsMatrix.mock.json');

describe('Airport tests, priority: calcAirportRoute - ARRIVAL', () => {

    describe('Testing valid fn calls', () => {

        test('Price: 42', async () => {
            const mockParam_params = structuredClone(MockData_requestMapsMatrix['params']['route1010-1300#1']);
            const mockResult = structuredClone(MockData_requestMapsMatrix['results']['route1010-1300#1']);
            const mockAPI = { requestMapsMatrix: jest.fn().mockResolvedValue(mockResult) };

            const airportModel = new DrivingAirportModel(mockAPI);
            const testFn = await airportModel.calcAirportRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 42 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestMapsMatrix).toHaveBeenCalled();
        })

        test('Price: 45', async () => {
            const mockParam_params = structuredClone(MockData_requestMapsMatrix['params']['route1090-1300#1']);
            const mockResult = structuredClone(MockData_requestMapsMatrix['results']['route1090-1300#1']);
            const mockAPI = { requestMapsMatrix: jest.fn().mockResolvedValue(mockResult) };

            const airportModel = new DrivingAirportModel(mockAPI);
            const testFn = await airportModel.calcAirportRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 45 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestMapsMatrix).toHaveBeenCalled();
        })

        test('Price: 48', async () => {
            const mockParam_params = structuredClone(MockData_requestMapsMatrix['params']['route1190-1300#1']);
            const mockResult = structuredClone(MockData_requestMapsMatrix['results']['route1190-1300#1']);
            const mockAPI = { requestMapsMatrix: jest.fn().mockResolvedValue(mockResult) };

            const airportModel = new DrivingAirportModel(mockAPI);
            const testFn = await airportModel.calcAirportRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 48 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestMapsMatrix).toHaveBeenCalled();
        })
    })
});

describe('Airport tests, priority: calcAirportRoute - DEPARTURE', () => {

    describe('Testing valid fn calls', () => {

        test('Price: 42', async () => {
            const mockParam_params = structuredClone(MockData_requestMapsMatrix['params']['route1300-1010#1']);
            const mockResult = structuredClone(MockData_requestMapsMatrix['results']['route1300-1010#1']);
            const mockAPI = { requestMapsMatrix: jest.fn().mockResolvedValue(mockResult) };

            const airportModel = new DrivingAirportModel(mockAPI);
            const testFn = await airportModel.calcAirportRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 42 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestMapsMatrix).toHaveBeenCalled();
        })
    })
})

describe('Airport tests, priority: _mapPriceByZipCode', () => {

    let airportModel;
    beforeEach(() => {
        airportModel = new DrivingAirportModel(googleRoutesApi);
    })

    describe('Testing valid fn calls', () => {

        test('Params: <district> = districts.inner', () => {
            const mockParam_district = 1;
            const mockResult = 42;
            const testFn = airportModel._mapPriceByZipCode(mockParam_district);

            expect(testFn).toBe(mockResult);
        })

        test('Params: <district> = districts.middle', () => {
            const mockParam_district = 9;
            const mockResult = 45;
            const testFn = airportModel._mapPriceByZipCode(mockParam_district);

            expect(testFn).toBe(mockResult);
        })

        test('Params: <district> = districts.outer', () => {
            const mockParam_district = 22;
            const mockResult = 48;
            const testFn = airportModel._mapPriceByZipCode(mockParam_district);

            expect(testFn).toBe(mockResult);
        })
    })
})