const { ServiceOption } = require('../../utils/enums/service-option.enum');
const CustomValidator = require('../../utils/customValidator.utils');

class DrivingFlatrateModel {
    #googleRoutes;
    #prices;

    constructor(googleRoutesApi) {
        this.#googleRoutes = googleRoutesApi;
        this.#prices = {
            approach: {
                perKm: 0.4
            },
            servDist: {
                perKm: 0.5
            },
            return: {
                perKm: 0.4
            },
            tenancy: {
                per30Min: 17.5
            }
        }
    }
    async calcFlatrateRoute(params) {
        let totalCost = 0;

        // GET ROUTE DATA
        const response = await this.#googleRoutes.requestRouteMatrix(params, ServiceOption.FLATRATE);
        const routes = {
            h2o: response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
            o2d: response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
            d2h: response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 2}),
        }

        // Validate relevance comparing tenancy to min time effort of origin2destination route.
        CustomValidator.validateTravelTimeRelevance(
            Number(params['tenancy']),
            routes.o2d.duration,
            ServiceOption.FLATRATE
        );

        const tenancyObj = this._calcTenancyValues(Number(params['tenancy']));

        const approachDistance = routes.h2o.distanceMeters > 20 ? routes.h2o.distanceMeters - 20 : 0;
        const returnDistance = routes.d2h.distanceMeters > 20 ? routes.d2h.distanceMeters - 20 : 0;

        const approachCost = (approachDistance % 1) >= 5
            ? Math.ceil(approachDistance) * this.#prices.approach.perKm
            : Math.floor(approachDistance) * this.#prices.approach.perKm;

        if(params['origin'] !== params['destination']) {
            const minDistanceCost = this._calcChargeByTenancyDiscount(routes.o2d.distanceMeters, tenancyObj.time);
            const returnCost = (returnDistance % 1) >= 0.5
                ? Math.ceil(returnDistance) * this.#prices.return.perKm
                : Math.floor(returnDistance) * this.#prices.return.perKm;
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

    _calcTenancyValues(time) {
        // min 3h are charged
        time = time <= 180 ? 180 : time;
        const newTimeInMinutes = time % 30 !== 0 ? (Math.ceil(time / 30)) * 30 : time;
        const costs = (newTimeInMinutes / 30) * this.#prices.tenancy.per30Min;

        return {
            time: newTimeInMinutes,
            costs: costs
        }
    }

    _calcChargeByTenancyDiscount(distance, tenancyTime) {
        // Get tenancy in full hours to calc free distance.
        let chargedFullHours = (tenancyTime % 60) !== 0 
            ? Math.floor(tenancyTime / 60) 
            : tenancyTime / 60;

        // Substract 25 km each hour of tenancy from total service distance.
        const chargedDistance = distance - (25 * chargedFullHours);

        return chargedDistance <= 0 ? 0 : Number((chargedDistance * this.#prices.servDist.perKm).toFixed(1));
    }
}

module.exports = DrivingFlatrateModel;