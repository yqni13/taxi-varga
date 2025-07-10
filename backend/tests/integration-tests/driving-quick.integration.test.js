// mock necessary validators/fn calls before 'app' is required 
// => would run code instead of mocks
jest.mock('../../src/middleware/auth.middleware.js', () => {
    return jest.fn(() => {
        return (req, res, next) => next();
    });
});

const mockResult = { 
    routeData: { price: 66, servTime: 41, servDist: 26, latency: { time: 10, costs: 5}, returnTarget: 'or'}
};
jest.mock('../../src/models/driving/quick.driving.model.js', () => {
    return jest.fn().mockImplementation(() => {
        return {
            calcQuickRoute: jest.fn().mockResolvedValue(mockResult)
        }
    })
})

const app = require('../../src/app.js');
const request = require('supertest');
const { ErrorStatusCodes } = require('../../src/utils/errorStatusCodes.utils.js');
const MockData_RouteMatrix = require('../mock-data/routeMatrix_quick.mock.json');
const apiUrl = '/api/v1/driving/quick';

describe('Integration test, service flow: Quick', () => {

    beforeAll(() => {
        jest.resetModules();
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('Testing valid fn calls', () => {

        test('Workflow: calc by route (1210to2201)', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route1210-2201']);
            const mockResponse = await request(app)
                .post(apiUrl)
                .send(mockParam_params);

            expect(mockResponse.statusCode).toBe(200);
            expect(mockResponse.body.body).toMatchObject(mockResult);
        })
    })

    describe('Testing invalid fn calls', () => {

        describe('Priority: express-validators', () => {

            let mockError;
            beforeEach(() => {
                mockError = { type: 'field', value: '', msg: 'backend-required', path: '?', location: 'body' };
            })

            test('Params: <origin>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'origin';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1010-2000']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post(apiUrl)
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <destination>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'destination';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1010-2000']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post(apiUrl)
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <back2origin>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'back2origin';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1010-2000']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post(apiUrl)
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <latency>, validator: exists({values: "null"})', async () => {
                const invalidParam = 'latency';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1010-2000']);
                delete mockParam_params[`${invalidParam}`];

                // no 'value' in error object by exists() instead trim() + notEmpty()
                delete mockError['value'];
                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post(apiUrl)
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <latency>, validator: isInt({max: 360})', async () => {
                const invalidParam = 'latency';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1010-2000']);
                mockParam_params[`${invalidParam}`] = 361;

                mockError['msg'] = 'backend-invalid-latency';
                mockError['path'] = invalidParam;
                mockError['value'] = mockParam_params[`${invalidParam}`];
                const mockResponse = await request(app)
                    .post(apiUrl)
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })
        })
    })
})