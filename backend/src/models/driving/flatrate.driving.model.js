const { ServiceOption } = require('../../utils/enums/service-option.enum');
const CustomValidator = require('../../utils/customValidator.utils');

class DrivingFlatrateModel {
    #googleRoutes;
    #prices;

    constructor(googleRoutesApi) {
        this.#googleRoutes = googleRoutesApi;
        this.#prices = {
            approachByKm: 0.4,
            returnByKm: 0.4,
            fullPricePerKm: 0.5,
            tenancyBy30Min: 17.5
        }
    }
    calcFlatrateRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        let totalCost = 0;

        // GET ROUTE DATA
        const response = await this.#googleRoutes.requestRouteMatrix(params, ServiceOption.FLATRATE);
        // h2o: home to origin
        // o2d: origin to destination
        // d2h: destination to home
        const routes = {
            h2o: response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
            o2d: response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
            d2h: response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 2}),
        }

        // validate relevance comparing tenancy to min time effort of origin2destination route
        CustomValidator.validateTravelTimeRelevance(
            Number(params['tenancy']),
            routes.o2d.duration,
            ServiceOption.FLATRATE
        );

        const tenancyObj = this._calcTenancyValues(Number(params['tenancy']));

        const approachDistance = routes.h2o.distanceMeters > 20 ? routes.h2o.distanceMeters - 20 : 0;
        const returnDistance = routes.d2h.distanceMeters > 20 ? routes.d2h.distanceMeters - 20 : 0;

        const approachCost = (approachDistance % 1) >= 5
            ? Math.ceil(approachDistance) * this.#prices.approachByKm
            : Math.floor(approachDistance) * this.#prices.approachByKm;

        if(params['origin'] !== params['destination']) {
            const minDistanceCost = this._calcChargeByTenancyDiscount(routes.o2d.distanceMeters, tenancyObj.time);
            const returnCost = (returnDistance % 1) >= 0.5
                ? Math.ceil(returnDistance) * this.#prices.returnByKm
                : Math.floor(returnDistance) * this.#prices.returnByKm;
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

    _calcTenancyValues = (time) => {
        // min 3h are charged
        time = time <= 180 ? 180 : time;
        const newTimeInMinutes = time % 30 !== 0 ? (Math.ceil(time / 30)) * 30 : time;
        const costs = (newTimeInMinutes / 30) * this.#prices.tenancyBy30Min;

        return {
            time: newTimeInMinutes,
            costs: costs
        }
    }

    _calcChargeByTenancyDiscount = (distance, tenancyTime) => {
        // Get tenancy in full hours to calc free distance.
        let chargedFullHours = (tenancyTime % 60) !== 0 
            ? Math.floor(tenancyTime / 60) 
            : tenancyTime / 60;

        // Check again on tenancy time equals min 3h
        chargedFullHours = chargedFullHours < 3 ? 3 : chargedFullHours;

        // Substract 25 km each hour of tenancy from total service distance.
        const chargedDistance = distance - (25 * chargedFullHours);

        return chargedDistance <= 0 ? 0 : Number((chargedDistance * this.#prices.fullPricePerKm).toFixed(1));
    }
}

module.exports = DrivingFlatrateModel;