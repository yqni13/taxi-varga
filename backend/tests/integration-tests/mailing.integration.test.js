// mock necessary validators/fn calls before 'app' is required 
// => would run code instead of mocks
jest.mock('../../src/middleware/auth.middleware.js', () => {
    return jest.fn(() => {
        return (req, res, next) => next();
    });
});

const request = require('supertest');
const { ErrorStatusCodes } = require('../../src/utils/errorStatusCodes.utils.js');
const MockData_common = require('../mock-data/common.mock.json')['mailing'];

describe('Integration test, priority: Mailing', () => {

    describe('Test valid fn calls', () => {

        beforeAll(() => {
            jest.resetModules();
        })

        let app;
        beforeEach(() => {
            // These mocks are not global because we want to check process for invalid fn calls.
            jest.mock('../../src/middleware/validators/mailingValidator.middleware.js', () => ({
                mailingSchema: (req, res, next) => {
                    next();
                }
            }));

            jest.mock('../../src/models/mailing.model.js', () => ({
                sendMail: jest.fn().mockResolvedValue({
                        sendRequestTo: "test@to.com",
                        confirmedRequestFrom: "test@from.com",
                        sender: "test@sender.com"
                    }
                )
            }));
            app = require('../../src/app.js');
            jest.clearAllMocks();
        })

        test('Workflow: send mail by data', async () => {
            const mockParam_params = structuredClone(MockData_common['params']['testuser']);
            const mockResult = structuredClone(MockData_common['response']['testuser']['body']['response']);
            const mockResponse = await request(app)
                .post('/api/v1/mailing/send')
                .send(mockParam_params);

            expect(mockResponse.statusCode).toBe(200);
            expect(mockResponse.body.body).toMatchObject(mockResult);
        })
    })

    describe('Test invalid fn calls', () => {

        beforeAll(() => {
            jest.resetModules();
        })

        beforeEach(() => {
            jest.clearAllMocks();
        })

        const app = require('../../src/app.js');

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

            test('Params: <subject>, validator: notEmpty by " "', async () => {
                const invalidParam = 'subject';
                const mockParam_params = structuredClone(MockData_common['params']['testuser']);
                mockParam_params[`${invalidParam}`] = '';

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/mailing/send')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <subject>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'subject';
                const mockParam_params = structuredClone(MockData_common['params']['testuser']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/mailing/send')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <sender>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'sender';
                const mockParam_params = structuredClone(MockData_common['params']['testuser']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/mailing/send')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <body>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'body';
                const mockParam_params = structuredClone(MockData_common['params']['testuser']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post('/api/v1/mailing/send')
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })
        })
    })
})