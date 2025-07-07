// mock necessary validators/fn calls before 'app' is required 
// => would run code instead of mocks
jest.mock('../../src/middleware/auth.middleware.js', () => {
    return jest.fn(() => {
        return (req, res, next) => next();
    });
});

const mockResult = { routeData: { duration: 96, distance: 125, price: 182, stay: 8 } };
jest.mock('../../src/models/driving/golf.driving.model.js', () => {
    return jest.fn().mockImplementation(() => {
        return {
            calcGolfRoute: jest.fn().mockResolvedValue(mockResult)
        };
    });
});

const app = require('../../src/app.js');
const request = require('supertest');
const { ErrorStatusCodes } = require('../../src/utils/errorStatusCodes.utils.js');
const MockData_RouteMatrix = require('../mock-data/routeMatrix_golf.mock.json');

describe('Integration test, service flow: Golf', () => {

    beforeAll(() => {
        jest.resetModules();
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('Testing valid fn calls', () => {

        test('Workflow: calc by route (2340to2013to2340)', async () => {
            const mockParam_params_driving = structuredClone(MockData_RouteMatrix['route2340-2013-2340']);
            const mockResponse_driving = await request(app)
                .post('/api/v1/driving/golf')
                .send(mockParam_params_driving);
    
            expect(mockResponse_driving.statusCode).toBe(200);
            expect(mockResponse_driving.body.body).toMatchObject(mockResult);
        })
    })

    describe('Testing invalid fn calls', () => {

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
                const mockParam_params = structuredClone(MockData_RouteMatrix['route2340-2013-2340']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/driving/golf')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <golfcourse>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'golfcourse';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route2340-2013-2340']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/driving/golf')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <destination>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'destination';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route2340-2013-2340']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/driving/golf')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <stay>, validator: exists({values: "null"})', async () => {
                const invalidParam = 'stay';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route2340-2013-2340']);
                delete mockParam_params[`${invalidParam}`];

                // no 'value' in error object by exists() instead trim() + notEmpty()
                delete mockError['value'];
                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/driving/golf')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <stay>, validator: isInt({max: 4320})', async () => {
                const invalidParam = 'stay';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route2340-2013-2340']);
                mockParam_params[`${invalidParam}`] = 4321;

                mockError['msg'] = 'backend-invalid-stay';
                mockError['path'] = invalidParam;
                mockError['value'] = mockParam_params[`${invalidParam}`];
                const mockResponse = await request(app)
                    .post('/api/v1/driving/golf')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <supportMode>, validator: exists({values: "null"})', async () => {
                const invalidParam = 'supportMode';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route2340-2013-2340']);
                delete mockParam_params[`${invalidParam}`];

                // no 'value' in error object by exists() instead trim() + notEmpty()
                delete mockError['value'];
                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/driving/golf')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })
        })
    })
})