const { basicResponse } = require('../utils/common.utils');
const GoogleRoutes = require('../services/google-routes/google-routes.api');
const DrivingAirportModel = require('../models/driving/airport.driving.model');
const DrivingDestinationModel = require('../models/driving/destination.driving.model');
const DrivingFlatrateModel = require('../models/driving/flatrate.driving.model');
const DrivingGolfModel = require('../models/driving/golf.driving.model');
const DrivingQuickModel = require('../models/driving/quick.driving.model');

class DrivingService {
    calcAirportRoute = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const model = new DrivingAirportModel(GoogleRoutes);
        let calculation = await model.calcAirportRoute(hasParams ? params : {});
        return basicResponse(calculation, 1, "Success");
    }
    
    calcDestinationRoute = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const model = new DrivingDestinationModel(GoogleRoutes);
        let calculation = await model.calcDestinationRoute(hasParams ? params : {});        
        return basicResponse(calculation, 1, "Success");
    }
    
    calcFlatrateRoute = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const model = new DrivingFlatrateModel(GoogleRoutes);
        let calculation = await model.calcFlatrateRoute(hasParams ? params : {});
        return basicResponse(calculation, 1, "Success");
    }

    calcGolfRoute = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const model = new DrivingGolfModel(GoogleRoutes);
        let calculation = await model.calcGolfRoute(hasParams ? params : {});
        return basicResponse(calculation, 1, "Success");
    }

    calcQuickRoute = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const model = new DrivingQuickModel(GoogleRoutes);
        let calculation = await model.calcQuickRoute(hasParams ? params : {});
        return basicResponse(calculation, 1, "Success");
    }
}

module.exports = new DrivingService;