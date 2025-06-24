const DrivingAirportModel = require('../../../../src/models/driving/airport.driving.model');
const googleRoutesApi = require('../../../../src/services/google-routes/google-routes.api');
const { NotFoundException } = require('../../../../src/utils/exceptions/common.exception');
const MockData_requestMapsMatrix = require('../../../mock-data/requestMapsMatrix.mock.json');

describe('Airport tests, priority: ARRIVAL', () => {

    describe('Testing valid fn calls', () => {

        test('Price: EUR 42,00', async () => {
            const mockParam_params = structuredClone(MockData_requestMapsMatrix['params']['route1010-1300#1']);
            const mockResult = structuredClone(MockData_requestMapsMatrix['results']['route1010-1300#1']);
            const mockAPI = { requestMapsMatrix: jest.fn().mockResolvedValue(mockResult) };

            const airportModel = new DrivingAirportModel(mockAPI);
            const testFn = await airportModel.calcAirportRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 42 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestMapsMatrix).toHaveBeenCalled();
        })

        test('Price: EUR 45,00', async () => {
            const mockParam_params = structuredClone(MockData_requestMapsMatrix['params']['route1090-1300#1']);
            const mockResult = structuredClone(MockData_requestMapsMatrix['results']['route1090-1300#1']);
            const mockAPI = { requestMapsMatrix: jest.fn().mockResolvedValue(mockResult) };

            const airportModel = new DrivingAirportModel(mockAPI);
            const testFn = await airportModel.calcAirportRoute(mockParam_params);
            const expectSubObj = { routeData: { price: 45 } };

            expect(testFn).toMatchObject(expectSubObj);
            expect(mockAPI.requestMapsMatrix).toHaveBeenCalled();
        })

        test('Price EUR 48,00', async () => {
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

    describe('Testing invalid fn calls', () => {

        test('Empty params', async () => {
            const mockParam_params = {};

            const airportModel = new DrivingAirportModel(googleRoutesApi);
            const testFn = await airportModel.calcAirportRoute(mockParam_params);
            const expectResult = {error: 'no params found'};

            expect(testFn).toMatchObject(expectResult);
        })

        test('Invalid zipCode', async () => {
            const mockParam_params = structuredClone(MockData_requestMapsMatrix['params']['route2000-1300#1']);
            const mockResult = structuredClone(MockData_requestMapsMatrix['results']['route2000-1300#1']);
            const mockAPI = { requestMapsMatrix: jest.fn().mockResolvedValue(mockResult) };

            const airportModel = new DrivingAirportModel(mockAPI);
            const expectResult = NotFoundException;

            await expect(airportModel.calcAirportRoute(mockParam_params))
                .rejects
                .toThrow(expectResult);
            expect(mockAPI.requestMapsMatrix).toHaveBeenCalled();
        })
    })
});

describe('Airport tests, priority: DEPARTURE', () => {

    describe('Testing valid fn calls', () => {

        test('Price: EUR 42,00', async () => {
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