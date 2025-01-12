const { basicResponse } = require('../utils/common.utils');
const DrivingModel = require('../models/driving.model');

class DrivingService {
    calcAirportRoute = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        let calculation = await DrivingModel.calcAirportRoute(hasParams ? params : {});
        return basicResponse(calculation, 1, "Success");
    }
    
    calcDestinationRoute = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        let calculation = await DrivingModel.calcDestinationRoute(hasParams ? params : {});        
        return basicResponse(calculation, 1, "Success");
    }
    
    calcFlatrateRoute = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        let calculation = await DrivingModel.calcFlatrateRoute(hasParams ? params : {});
        return basicResponse(calculation, 1, "Success");
    }
}

module.exports = new DrivingService;