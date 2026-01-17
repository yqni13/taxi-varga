const AuthModel = require("../../../../src/models/auth.model");
const { InvalidCredentialsException } = require("../../../../src/utils/exceptions/auth.exception");
const MockData_common = require('../../../mock-data/common.mock.json');
const jwt = require('jsonwebtoken');

describe('Auth tests, priority: generateToken', () => {

    describe('Testing valid fn calls', () => {

        test('Keep file alive', () => {
            expect(true).toBe(true);
        })

        // TODO(yqni13): update of auth model and crypto utils necessary to use tests
        // test('Authentication by \'admin\' user', async () => {
        //     const mockParam_params = structuredClone(MockData_common['auth']['payload']['admin']);
        //     const mockParam_privateKey = structuredClone(MockData_common['auth']['privateKey']);
        //     const mockParam_secrets = {
        //         PASS_POSITION: structuredClone(MockData_common['auth']['secrets']['position']['admin']),
        //         AUTH_ID: structuredClone(MockData_common['auth']['secrets']['id']['admin']),
        //         AUTH_USER: structuredClone(MockData_common['auth']['secrets']['user']['admin']),
        //         AUTH_PASS: structuredClone(MockData_common['auth']['secrets']['password']['admin']),
        //         PRIVATE_KEY: mockParam_privateKey
        //     }
        //     const mockAPI = jest.fn()
        //         .mockReturnValueOnce(mockParam_params['user'])
        //         .mockReturnValueOnce(mockParam_params['pass'])
            
        //     const model = new AuthModel(mockAPI);
        //     model._secrets = mockParam_secrets;

        //     const mockResultToken = 'mockJwtToken';
        //     const mockJWT = jest.spyOn(jwt, 'sign').mockReturnValue(mockResultToken);
        //     const mockResult = await model.generateToken(mockParam_params);
        //     const expectSubObj = { body: { token: mockResultToken }, code: 1, msg: 'Success' };

        //     expect(mockAPI).toHaveBeenCalled(2);
        //     expect(mockJWT).toHaveBeenCalled(
        //         expect.objectContaining({
        //             id: mockParam_secrets.AUTH_ID,
        //             user: expect.stringContaining(mockParam_params['user']),
        //             role: 'user'
        //         }),
        //         mockParam_privateKey,
        //         expect.objectContaining({
        //             expiresIn: '30m',
        //             audience: mockParam_params['aud']
        //         })
        //     );
        //     expect(mockResult).toEqual(expectSubObj);

        //     mockJWT.mockRestore();
        // })
    })
})