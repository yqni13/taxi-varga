const { basicResponse } = require('../utils/common.utils');
const DrivingModel = require('../models/driving.model');
const { UnexpectedException } = require('../utils/exceptions/common.exception');

class DrivingRepository {
    calcAirportRoute = async (params) => {
        let calculation = await DrivingModel.calcAirportRoute(params);
        if(!calculation) {
            throw new UnexpectedException('No logic to calc yet');
        }

        return basicResponse(calculation, 1, "Success");
    }

    calcDestinationRoute = async (params) => {
        let calculation = await DrivingModel.calcDestinationRoute(params);
        if(!calculation) {
            throw new UnexpectedException('No logic to calc yet');
        }

        return basicResponse(calculation, 1, "Success");
    }
    
    calcFlatrateRoute = async (params) => {
        let calculation = await DrivingModel.calcFlatrateRoute(params);
        if(!calculation) {
            throw new UnexpectedException('No logic to calc yet');
        }

        return basicResponse(calculation, 1, "Success");
    }
}

module.exports = new DrivingRepository;