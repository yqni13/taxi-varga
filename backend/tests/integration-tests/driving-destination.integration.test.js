// mock necessary validators/fn calls before 'app' is required 
// => would run code instead of mocks
jest.mock('../../src/middleware/auth.middleware.js', () => {
    return jest.fn(() => {
        return (req, res, next) => next();
    });
});

const mockResult = { routeData: { duration: 128, distance: 185, price: 266 } };
jest.mock('../../src/models/driving/destination.driving.model.js', () => {
    return jest.fn().mockImplementation(() => {
        return {
            calcDestinationRoute: jest.fn().mockResolvedValue(mockResult)
        }
    })
});

const app = require('../../src/app.js');
const request = require('supertest');
const { ErrorStatusCodes } = require('../../src/utils/errorStatusCodes.utils.js');
const MockData_RouteMatrix = require('../mock-data/routeMatrix_destination.mock.json');

describe('Integration test, service flow: Destination', () => {

    beforeAll(() => {
        jest.resetModules();
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('Test valid fn calls', () => {

        test('Process service by route (1090to4020)', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route1090-4020']);
            const mockResponse = await request(app)
                .post('/api/v1/driving/destination')
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

            test('Params: <origin>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'origin';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1090-4020']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/driving/destination')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <destination>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'destination';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1090-4020']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/driving/destination')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <back2home>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'back2home';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1090-4020']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/driving/destination')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <latency>, validator: isInt({max: 360})', async () => {
                const invalidParam = 'latency';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1090-4020']);
                mockParam_params[`${invalidParam}`] = 420;

                mockError['msg'] = 'backend-invalid-latency';
                mockError['path'] = invalidParam;
                mockError['value'] = mockParam_params[`${invalidParam}`];
                const mockResponse = await request(app)
                    .post('/api/v1/driving/destination')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <pickupTIME>, validator: exists({values: "null"})', async () => {
                const invalidParam = 'pickupTIME';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1090-4020']);
                delete mockParam_params[`${invalidParam}`];

                // no 'value' in error object by exists() instead trim() + notEmpty()
                delete mockError['value'];
                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/driving/destination')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <pickupTIME>, validator: isInt({min: 0})', async () => {
                const invalidParam = 'pickupTIME';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1090-4020']);
                mockParam_params[`${invalidParam}`] = -1;

                mockError['msg'] = 'backend-invalid-pickupTIME';
                mockError['path'] = invalidParam;
                mockError['value'] = mockParam_params[`${invalidParam}`];
                const mockResponse = await request(app)
                    .post('/api/v1/driving/destination')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })
        })
    })
})