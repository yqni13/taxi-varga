const { basicResponse } = require('../utils/common.utils');
const Utils = require('../utils/common.utils');
const GoogleRoutes = require('../services/google-routes/google-routes.api');
const DrivingAirportModel = require('../models/driving/airport.driving.model');
const DrivingDestinationModel = require('../models/driving/destination.driving.model');
const DrivingFlatrateModel = require('../models/driving/flatrate.driving.model');
const DrivingGolfModel = require('../models/driving/golf.driving.model');
const DrivingQuickModel = require('../models/driving/quick.driving.model');

class DrivingService {
    calcAirportRoute = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const airportModel = new DrivingAirportModel(GoogleRoutes);
        let calculation = await airportModel.calcAirportRoute(hasParams ? params : {});
        return basicResponse(calculation, 1, "Success");
    }
    
    calcDestinationRoute = async (params) => {
        if(Utils.isObjEmpty(params)) {
            return {error: 'no params found'}
        }
        const destinationModel = new DrivingDestinationModel(GoogleRoutes);
        let resultOrig = await destinationModel.calcDestinationRoute(params);
        if(resultOrig.routeData?.price && !params['back2home'] 
            && Utils.checkAddressInLowerAustriaByProvince(params.originDetails.province) 
            && Utils.checkAddressInLowerAustriaByProvince(params.destinationDetails.province)
            && !Utils.checkAddressAtViennaAirport(params.originDetails.zipCode ?? '2000')
            && !Utils.checkAddressAtViennaAirport(params.destinationDetails.zipCode ?? '2000')
        ) {
            // Swap addresses and run calculations again to compare and select by price.
            [params.origin, params.destination] = [params.destination, params.origin];
            [params.originDetails, params.destinationDetails] = [params.destinationDetails, params.originDetails];
            const resultSwap = await destinationModel.calcDestinationRoute(params);
            return basicResponse(resultOrig.routeData?.price >= resultSwap.routeData?.price ? resultOrig : resultSwap, 1, "Success");
        }
        return basicResponse(resultOrig, 1, "Success");
    }
    
    calcFlatrateRoute = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const flatrateModel = new DrivingFlatrateModel(GoogleRoutes);
        let calculation = await flatrateModel.calcFlatrateRoute(hasParams ? params : {});
        return basicResponse(calculation, 1, "Success");
    }

    calcGolfRoute = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const golfModel = new DrivingGolfModel(GoogleRoutes);
        let calculation = await golfModel.calcGolfRoute(hasParams ? params : {});
        return basicResponse(calculation, 1, "Success");
    }

    calcQuickRoute = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const quickModel = new DrivingQuickModel(GoogleRoutes);
        let calculation = await quickModel.calcQuickRoute(hasParams ? params : {});
        return basicResponse(calculation, 1, "Success");
    }
}

module.exports = new DrivingService;