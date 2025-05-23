const { basicResponse } = require('../utils/common.utils');
const DrivingAirportModel = require('../models/driving/airport.driving.model');
const DrivingDestinationModel = require('../models/driving/destination.driving.model');
const DrivingFlatrateModel = require('../models/driving/flatrate.driving.model');
const DrivingGolfModel = require('../models/driving/golf.driving.model');

class DrivingService {
    calcAirportRoute = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        let calculation = await DrivingAirportModel.calcAirportRoute(hasParams ? params : {});
        return basicResponse(calculation, 1, "Success");
    }
    
    calcDestinationRoute = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        let calculation = await DrivingDestinationModel.calcDestinationRoute(hasParams ? params : {});        
        return basicResponse(calculation, 1, "Success");
    }
    
    calcFlatrateRoute = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        let calculation = await DrivingFlatrateModel.calcFlatrateRoute(hasParams ? params : {});
        return basicResponse(calculation, 1, "Success");
    }

    calcGolfRoute = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        let calculation = await DrivingGolfModel.calcGolfRoute(hasParams ? params : {});
        return basicResponse(calculation, 1, "Success");
    }
}

module.exports = new DrivingService;