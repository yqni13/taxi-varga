const GoogleRoutes = require('../../services/google-routes/google-routes.api');
const { ServiceOption } = require('../../utils/enums/service-option.enum');
const CustomValidator = require('../../utils/customValidator.utils');

class DrivingFlatrateModel {
    calcFlatrateRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        let totalCost = 0;

        // GET ROUTE DATA
        const response = await GoogleRoutes.requestRouteMatrix(params, ServiceOption.FLATRATE);
        // h2o: home to origin
        // o2d: origin to destination
        // d2h: destination to home
        const routes = {
            h2o: response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
            o2d: response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
            d2h: response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 2}),
        }
        const prices = {
            approachByKm: 0.4,
            returnByKm: 0.4
        }

        // validate relevance comparing tenancy to min time effort of origin2destination route
        CustomValidator.validateTravelTimeRelevance(
            Number(params['tenancy']),
            routes.o2d.duration,
            ServiceOption.FLATRATE
        );
        const tenancyObj = this.#calcTenancyValues(Number(params['tenancy']));

        const approachDistance = routes.h2o.distanceMeters > 20 ? routes.h2o.distanceMeters - 20 : 0;
        const returnDistance = routes.d2h.distanceMeters > 20 ? routes.d2h.distanceMeters - 20 : 0;

        const approachCost = (approachDistance % 1) >= 5
            ? Math.ceil(approachDistance) * prices.approachByKm
            : Math.floor(approachDistance) * prices.approachByKm;

        if(params['origin'] !== params['destination']) {
            const minDistanceCost = this.#calcMinDistanceValues(routes.o2d);
            const returnCost = (returnDistance % 1) >= 5
                ? Math.ceil(returnDistance) * prices.returnByKm
                : Math.floor(returnDistance) * prices.returnByKm;
            totalCost = approachCost + minDistanceCost + tenancyObj.costs + returnCost;
        } else {
            totalCost = (approachCost * 2) + tenancyObj.costs;
        }

        return { 
            routeData: {
                tenancy: tenancyObj.time,
                price: Math.ceil(totalCost)
            }
        };
    }

    #calcTenancyValues = (time) => {
        const priceEach30Min = 17.5;

        // min 3h are charged
        time = time < 180 ? 180 : time;
        const newTimeInMinutes = time % 30 !== 0 ? (Math.ceil(time / 30)) * 30 : time;
        const costs = (newTimeInMinutes / 30) * priceEach30Min;

        return {
            time: newTimeInMinutes,
            costs: costs
        }
    }

    #calcMinDistanceValues = (params) => {
        const priceNextKm = 0.5;

        // substract 25km distance included in every full hour tenancy
        const chargedTime = (params.duration % 60) !== 0 
            ? (Math.floor(params.duration / 60) * 60) 
            : params.duration;
        const chargedDistance = params.distanceMeters - (25 * (chargedTime / 60));
        return chargedDistance * priceNextKm;
    }
}

module.exports = new DrivingFlatrateModel;