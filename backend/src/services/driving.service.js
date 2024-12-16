const { basicResponse } = require('../utils/common.utils');
const DrivingModel = require('../models/driving.model');
const { UnexpectedException, NotFoundException } = require('../utils/exceptions/common.exception');

class DrivingService {
    calcAirportRoute = (params) => {
        const hasParams = Object.keys(params).length !== 0;
        let calculation = DrivingModel.calcAirportRoute(hasParams ? params : {});
        if(!calculation) {
            throw new NotFoundException('Vienna zip code not found'); //TODO(yqni13): replace with regarding error
        }
        return basicResponse(calculation, 1, "Success");
    }
    
    calcDestinationRoute = (params) => {
        const hasParams = Object.keys(params).length !== 0;
        let calculation = DrivingModel.calcDestinationRoute(hasParams ? params : {});
        if(!calculation) {
            throw new UnexpectedException('No logic to calc yet'); //TODO(yqni13): replace with regarding error
        }
        
        return basicResponse(calculation, 1, "Success");
    }
    
    calcFlatrateRoute = (params) => {
        const hasParams = Object.keys(params).length !== 0;
        let calculation = DrivingModel.calcFlatrateRoute(hasParams ? params : {});
        if(!calculation) {
            throw new UnexpectedException('No logic to calc yet'); //TODO(yqni13): replace with regarding error
        }

        return basicResponse(calculation, 1, "Success");
    }
}

module.exports = new DrivingService;