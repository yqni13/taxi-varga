const { basicResponse } = require('../utils/common.utils');
const CalcAtoBModel = require('../models/calcAtoB.model');
const { UnexpectedException } = require('../utils/exceptions/common.exception');

class CalcAtoBRepository {
    calcRoute = async (params) => {
        let calculation = await CalcAtoBModel.calcRoute(params);
        if(!calculation) {
            throw new UnexpectedException('No logic to calc yet');
        }

        return basicResponse(calculation, 1, "Success");
    }
}

module.exports = new CalcAtoBRepository;