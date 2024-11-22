const { basicResponse } = require('../utils/common.utils');
const DrivingModel = require('../models/driving.model');
const { UnexpectedException } = require('../utils/exceptions/common.exception');

class DrivingRepository {
    calcRoute = async (params) => {
        let calculation = await DrivingModel.calcRoute(params);
        if(!calculation) {
            throw new UnexpectedException('No logic to calc yet');
        }

        return basicResponse(calculation, 1, "Success");
    }
}

module.exports = new DrivingRepository;