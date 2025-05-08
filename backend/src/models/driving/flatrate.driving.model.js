const GoogleRoutes = require('../../services/google-routes/google-routes.api');
const { ServiceOption } = require('../../utils/enums/service-option.enum');
const CustomValidator = require('../../utils/customValidator.utils');

class DrivingFlatrateModel {
    calcFlatrateRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const priceApproachPerKm = 0.5;
        const priceReturnPerKm = 0.5;
        let totalCost = 0;

        // GET ROUTE DATA
        const response = await GoogleRoutes.requestRouteMatrix(params, ServiceOption.FLATRATE);
        const home2origin = response.find(obj => { 
            return obj.originIndex === 0 && obj.destinationIndex === 1;
        });
        const origin2destination = response.find(obj => { 
            return obj.originIndex === 1 && obj.destinationIndex === 0;
        });
        const destination2home = response.find(obj => {
            return obj.originIndex === 2 && obj.destinationIndex === 2;
        });

        // validate relevance comparing tenancy to min time effort of origin2destination route
        CustomValidator.validateTravelTimeRelevance(
            Number(params['tenancy']),
            origin2destination.duration,
            ServiceOption.FLATRATE
        );
        const tenancyObj = this.#calculateTenancyValues(Number(params['tenancy']));

        const approachCost = (home2origin.distanceMeters % 1) >= 5
            ? Math.ceil(home2origin.distanceMeters) * priceApproachPerKm
            : Math.floor(home2origin.distanceMeters) * priceApproachPerKm;

        if(params['origin'] !== params['destination']) {
            const minDistanceCost = this.#calculateMinDistanceValues(origin2destination);
            const returnCost = (destination2home.distanceMeters % 1) >= 5
                ? Math.ceil(destination2home.distanceMeters) * priceReturnPerKm
                : Math.floor(destination2home.distanceMeters) * priceReturnPerKm;
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

    #calculateTenancyValues = (time) => {
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

    #calculateMinDistanceValues = (params) => {
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