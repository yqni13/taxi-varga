const BaseDrivingModel = require("../../../../src/models/driving/base.driving.model");

describe('Base tests, priority: mapLongDistanceDiscount', () => {

    describe('Testing valid fn calls', () => {

        test('Params: <servDist> = 100', () => {
            const mockParam_costs = 100;
            const mockParam_servDist = 100;
            const baseModel = new BaseDrivingModel();

            const testFn = baseModel.mapLongDistanceDiscount(mockParam_costs, mockParam_servDist);
            const expectResult = 100;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <servDist> = 250', () => {
            const mockParam_costs = 150;
            const mockParam_servDist = 250;
            const baseModel = new BaseDrivingModel();

            const testFn = baseModel.mapLongDistanceDiscount(mockParam_costs, mockParam_servDist);
            const expectResult = 135;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <servDist> = 350', () => {
            const mockParam_costs = 200;
            const mockParam_servDist = 350;
            const baseModel = new BaseDrivingModel();

            const testFn = baseModel.mapLongDistanceDiscount(mockParam_costs, mockParam_servDist);
            const expectResult = 170;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <servDist> = 500', () => {
            const mockParam_costs = 300;
            const mockParam_servDist = 500;
            const baseModel = new BaseDrivingModel();

            const testFn = baseModel.mapLongDistanceDiscount(mockParam_costs, mockParam_servDist);
            const expectResult = 240;

            expect(testFn).toBe(expectResult);
        })
    })
})

describe('Base tests, priority: calculateSum', () => {

    describe('Testing valid fn calls', () => {

        test('Params: <arr>.length = 0', () => {
            const mockParam_arr = [];
            const baseModel = new BaseDrivingModel();

            const testFn = baseModel.calculateSum(mockParam_arr);
            const expectResult = 0;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <arr>.length = 1', () => {
            const mockParam_arr = [55];
            const baseModel = new BaseDrivingModel();

            const testFn = baseModel.calculateSum(mockParam_arr);
            const expectResult = 55;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <servDist>.length = 3', () => {
            const mockParam_arr = [40, 32, 17.2];
            const baseModel = new BaseDrivingModel();

            const testFn = baseModel.calculateSum(mockParam_arr);
            const expectResult = 89.2;

            expect(testFn).toBe(expectResult);
        })
    })
})

describe('Base tests, priority: substractAllDiscounts', () => {

    describe('Testing valid fn calls', () => {

        test('Params: <arr>.length = 0', () => {
            const mockParam_sum = 100;
            const mockParam_arr = [];
            const baseModel = new BaseDrivingModel();

            const testFn = baseModel.substractAllDiscounts(mockParam_sum, mockParam_arr);
            const expectResult = 100;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <arr>.length = 1', () => {
            const mockParam_sum = 100;
            const mockParam_arr = [10];
            const baseModel = new BaseDrivingModel();

            const testFn = baseModel.substractAllDiscounts(mockParam_sum, mockParam_arr);
            const expectResult = 90;

            expect(testFn).toBe(expectResult);
        })

        test('Params: <servDist>.length = 2', () => {
            const mockParam_sum = 100;
            const mockParam_arr = [11.2, 20];
            const baseModel = new BaseDrivingModel();

            const testFn = baseModel.substractAllDiscounts(mockParam_sum, mockParam_arr);
            const expectResult = 68.8;

            expect(testFn).toBe(expectResult);
        })
    })
})