// mock necessary validators/fn calls before 'app' is required 
// => would run code instead of mocks
jest.mock('../../src/middleware/auth.middleware.js', () => {
    return jest.fn(() => {
        return (req, res, next) => next();
    });
});

const mockResult = { routeData: { duration: 27, distance: 21, price: 42 } };
jest.mock('../../src/models/driving/airport.driving.model.js', () => {
    return jest.fn().mockImplementation(() => {
        return {
            calcAirportRoute: jest.fn().mockResolvedValue(mockResult)
        };
    });
});

const app = require('../../src/app.js');
const request = require('supertest');
const { ErrorStatusCodes } = require('../../src/utils/errorStatusCodes.utils.js');
const MockData_requestMapsMatrix = require('../mock-data/requestMapsMatrix.mock.json');

describe('Integration test, service flow: Airport', () => {

    beforeAll(() => {
        jest.resetModules();
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('Test valid fn calls', () => {

        test('Workflow: calc by route (1010to1300)', async () => {
            const mockParam_params = structuredClone(MockData_requestMapsMatrix['params']['route1010-1300#1']);
            const mockResponse = await request(app)
                .post('/api/v1/driving/airport')
                .send(mockParam_params);

            expect(mockResponse.statusCode).toBe(200);
            expect(mockResponse.body.body).toMatchObject(mockResult);
        })
    })

    describe('Test invalid fn calls', () => {

        describe('Priority: express-validators', () => {
            let mockError;
            beforeEach(() => {
                mockError = {
                    type: 'field',
                    value: '',
                    msg: 'backend-required',
                    path: '?',
                    location: 'body'
                }
            })

            test('Param: <origin>, validator: notEmpty', async () => {
                const invalidParam = 'origin';
                const mockParam_params = structuredClone(MockData_requestMapsMatrix['params']['route1010-1300#1']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/driving/airport')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Param: <destination>, validator: notEmpty', async () => {
                const invalidParam = 'destination';
                const mockParam_params = structuredClone(MockData_requestMapsMatrix['params']['route1010-1300#1']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/driving/airport')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })
        })
    })
})