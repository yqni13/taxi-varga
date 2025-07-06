// mock necessary validators/fn calls before 'app' is required 
// => would run code instead of mocks
jest.mock('../../src/middleware/auth.middleware.js', () => {
    return jest.fn(() => {
        return (req, res, next) => next();
    });
});

const mockResult = { routeData: { tenancy: 180, price: 117 } };
jest.mock('../../src/models/driving/flatrate.driving.model.js', () => {
    return jest.fn().mockImplementation(() => {
        return {
            calcFlatrateRoute: jest.fn().mockResolvedValue(mockResult)
        };
    });
});

const app = require('../../src/app.js');
const request = require('supertest');
const { ErrorStatusCodes } = require('../../src/utils/errorStatusCodes.utils.js');
const MockData_RouteMatrix = require('../mock-data/routeMatrix_flatrate.mock.json');

describe('Integration test, service flow: Flatrate', () => {

    beforeAll(() => {
        jest.resetModules();
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('Test valid fn calls', () => {

        test('Workflow: calc by route (1220to2514)', async () => {
            const mockParam_params = structuredClone(MockData_RouteMatrix['route1220-2514']);
            const mockResponse = await request(app)
                .post('/api/v1/driving/flatrate')
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
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1220-2514']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/driving/flatrate')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <destination>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'destination';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1220-2514']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/driving/flatrate')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <tenancy>, validator: exists({values: "null"})', async () => {
                const invalidParam = 'tenancy';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1220-2514']);
                delete mockParam_params[`${invalidParam}`];

                // no 'value' in error object by exists() instead trim() + notEmpty()
                delete mockError['value'];
                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/driving/flatrate')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <tenancy>, validator: isInt({max: 1440})', async () => {
                const invalidParam = 'tenancy';
                const mockParam_params = structuredClone(MockData_RouteMatrix['route1220-2514']);
                mockParam_params[`${invalidParam}`] = 1441;

                mockError['msg'] = 'backend-invalid-tenancy';
                mockError['path'] = invalidParam;
                mockError['value'] = mockParam_params[`${invalidParam}`];
                const mockResponse = await request(app)
                    .post('/api/v1/driving/flatrate')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })
        })
    })
})