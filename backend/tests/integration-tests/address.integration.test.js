// mock necessary validators/fn calls before 'app' is required 
// => would run code instead of mocks
jest.mock('../../src/middleware/auth.middleware.js', () => {
    return jest.fn(() => {
        return (req, res, next) => next();
    });
});

const request = require('supertest');
const { ErrorStatusCodes } = require('../../src/utils/errorStatusCodes.utils.js');
const MockData_common = require('../mock-data/common.mock.json')['address'];
const apiUrl_autocomplete = '/api/v1/address/autocomplete';
const apiUrl_details = '/api/v1/address/details';

describe('Integration test, priority: Address workflow', () => {

    describe('Testing valid fn calls', () => {

        let app, mockResult_autocomplete, mockResult_places;
        beforeEach(() => {
            jest.resetModules();
            jest.mock('../../src/middleware/validators/addressValidator.middleware.js', () => ({
                autocompleteSchema: (req, res, next) => {
                    next();
                },
                placeSchema: (req, res, next) => {
                    next();
                },
                geocodeSchema: (req, res, next) => {
                    next();
                }
            }));

            mockResult_autocomplete = structuredClone(MockData_common['autocomplete']['non-specific_entry0']['result']);
            mockResult_places = structuredClone(MockData_common['details']['non-specific_entry0']['result']);
            jest.mock('../../src/models/address.model.js', () => {
                return jest.fn().mockImplementation(() => {
                    return {
                        getPlaceAutocomplete: jest.fn().mockResolvedValue(mockResult_autocomplete),
                        getPlaceDetails: jest.fn().mockResolvedValue(mockResult_places),
                        getPlaceByGeolocation: jest.fn().mockResolvedValue({})
                    }
                })
            });

            app = require('../../src/app.js');
        })

        test('Workflow: request autocomplete on partly address', async () => {
            const mockParam_params = structuredClone(MockData_common['autocomplete']['non-specific_entry0']['params']);
            const mockResponse = await request(app)
                .post(apiUrl_autocomplete)
                .send(mockParam_params);

            expect(mockResponse.statusCode).toBe(200);
            expect(mockResponse.body.body).toMatchObject(mockResult_autocomplete);
        })

        test('Workflow: request details on address', async () => {
            const mockParam_params = structuredClone(MockData_common['details']['non-specific_entry0']['params']);
            const mockResponse = await request(app)
                .post(apiUrl_details)
                .send(mockParam_params);

            expect(mockResponse.statusCode).toBe(200);
            expect(mockResponse.body.body).toMatchObject(mockResult_places);
        })
    })

    describe('Testing invalid fn calls', () => {

        describe('Priority: Autocomplete, express-validators', () => {

            let mockError, app, mockResult_autocomplete;
            beforeEach(() => {
                jest.resetModules();
                mockError = {
                    type: 'field',
                    value: '',
                    msg: 'backend-required',
                    path: '?',
                    location: 'body'
                };

                // unmock/mock empty data necessary, because jest.resetModules() empties cache but NOT mock registry
                jest.unmock('../../src/middleware/validators/addressValidator.middleware.js');
                mockResult_autocomplete = {};
                jest.mock('../../src/models/address.model.js', () => {
                    return jest.fn().mockImplementation(() => {
                        return {
                            getPlaceAutocomplete: jest.fn().mockResolvedValue(mockResult_autocomplete),
                        }
                    })
                });
                app = require('../../src/app.js');
                jest.clearAllMocks();
            })

            test('Params: <address>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'address';
                const mockParam_params = structuredClone(MockData_common['autocomplete']['non-specific_entry0']['params']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post(apiUrl_autocomplete)
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <language>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'language';
                const mockParam_params = structuredClone(MockData_common['autocomplete']['non-specific_entry0']['params']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post(apiUrl_autocomplete)
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <sessionToken>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'sessionToken';
                const mockParam_params = structuredClone(MockData_common['autocomplete']['non-specific_entry0']['params']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post(apiUrl_autocomplete)
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <filter>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'filter';
                const mockParam_params = structuredClone(MockData_common['autocomplete']['non-specific_entry0']['params']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post(apiUrl_autocomplete)
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })
        })

        describe('Priority: Details, express-validators', () => {

            let mockError, app, mockResult_details;
            beforeEach(() => {
                jest.resetModules();
                mockError = {
                    type: 'field',
                    value: '',
                    msg: 'backend-required',
                    path: '?',
                    location: 'body'
                };

                // unmock/mock empty data necessary, because jest.resetModules() empties cache but NOT mock registry
                jest.unmock('../../src/middleware/validators/addressValidator.middleware.js');
                mockResult_details = {};
                jest.mock('../../src/models/address.model.js', () => {
                    return jest.fn().mockImplementation(() => {
                        return {
                            getPlaceDetails: jest.fn().mockResolvedValue(mockResult_places)
                        }
                    })
                });
                app = require('../../src/app.js');
                jest.clearAllMocks();
            })

            test('Params: <placeId>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'placeId';
                const mockParam_params = structuredClone(MockData_common['details']['non-specific_entry0']['params']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post(apiUrl_details)
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <language>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'language';
                const mockParam_params = structuredClone(MockData_common['details']['non-specific_entry0']['params']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post(apiUrl_details)
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })

            test('Params: <sessionToken>, validator: notEmpty by undefined', async () => {
                const invalidParam = 'sessionToken';
                const mockParam_params = structuredClone(MockData_common['details']['non-specific_entry0']['params']);
                delete mockParam_params[`${invalidParam}`];

                mockError['path'] = invalidParam;
                const mockResponse = await request(app)
                    .post(apiUrl_details)
                    .send(mockParam_params);

                expect(mockResponse.statusCode).toBe(ErrorStatusCodes.InvalidPropertiesException);
                expect(mockResponse.body.headers.data).toContainEqual(mockError);
            })
        })
    })
})