const Utils = require('../../utils/common.utils');
const { ServiceOption } = require("../../utils/enums/service-option.enum");
const { UnexpectedException } = require("../../utils/exceptions/common.exception");
const CustomValidator = require('../../utils/customValidator.utils');
const { UnexpectedApiResponseException } = require('../../utils/exceptions/api.exception');
const discountConfig = require('../../configs/discounts.json');
const BaseDrivingModel = require('./base.driving.model');

class DrivingGolfModel extends BaseDrivingModel {
    #googleRoutes;
    #prices;
    #preferenceGcIdList;

    constructor(googleRoutesApi) {
        super();
        this.#googleRoutes = googleRoutesApi;
        this.#prices = {
            base: 4,
            discount: {
                percent10: 0.1,
                percent15: 0.15,
                percent20: 0.2,
                preference: 0.25,
                perServKm: 0.15
            },
            stay: {
                singleDay: 48,
                perDay: 54
            },
            service: {
                above30Km: 0.5,
                below30Km: 0.65
            },
            approach: {
                perKm: 0.4
            },
            return: {
                perKm: 0.4
            },
        };
        this.#preferenceGcIdList = Object.values(discountConfig.service.golf.preference);
    }

    async calcGolfRoute(params) {
        try {
            // GET ROUTE DATA
            const response = await this.#googleRoutes.requestRouteMatrix(params, ServiceOption.GOLF);
            const routes = {
                h2o: response.find(obj => {return obj.originIndex === 0 && obj.destinationIndex === 1}),
                o2g: response.find(obj => {return obj.originIndex === 1 && obj.destinationIndex === 0}),
                g2d: response.find(obj => {return obj.originIndex === 2 && obj.destinationIndex === 1}),
                d2h: response.find(obj => {return obj.originIndex === 3 && obj.destinationIndex === 2}),
            };
            let result = {
                distance: 0,
                duration: 0,
                price: 0
            };

            // Validate relevance & update stay time by removing origin route duration (in total minutes).
            if (params['stayInDays'] === 1) {
                params['stayInMinutes'] = CustomValidator.validateTravelTimeRelevance(
                    params['stayInMinutes'],
                    routes.o2g.duration,
                    ServiceOption.GOLF
                );
            }

            // Already converted (google-routes.api.js): distanceMeters to kilometers & duration to minutes.
            const servDist = routes.o2g.distanceMeters + routes.g2d.distanceMeters;
            const servTime = routes.o2g.duration + routes.g2d.duration;

            const approachCosts = this._calcApproachH2O(routes.h2o.distanceMeters);
            const servDistCosts = servDist <= 30
                ? servDist * this.#prices.service.below30Km
                : servDist * this.#prices.service.above30Km;
            const servTimeCosts = servDist <= 30
                ? servTime * this.#prices.service.below30Km
                : servTime * this.#prices.service.above30Km;
            const returnCosts = routes.d2h.distanceMeters * this.#prices.return.perKm;

            const stayCosts = params['stayInDays'] > 1
                ? this._calcMultiDayStayCosts(params['stayInDays'])
                : this._calcSingleDayStayCosts();

            // Add up all additional charges.
            let additionalCharges = 0;

            const preBaseDiscountCostSum = this.calculateSum([
                this.#prices.base,
                servDistCosts,
                servTimeCosts,
                approachCosts,
                returnCosts,
                stayCosts,
                additionalCharges
            ]);

            // Subtract all additional discounts.
            const paramsByOptions = {
                servDist: servDist,
                isYouthOption: params['youthOption'],
                isSupportOption: params['supportMode']
            };

            const discountByOptions = this._calcDiscountByOptions(paramsByOptions);
            const postBaseDiscountCostSum = this.substractAllDiscounts(preBaseDiscountCostSum, [discountByOptions]);

            // Map additional discounts.
            const paramsFlatRateDiscount = {
                costs: postBaseDiscountCostSum,
                isYouthOption: params['youthOption'],
                isSupportOption: params['supportMode'],
                passengers: params.passengers
            };

            const postFlatRateDiscountCosts = this._mapFlatRateDiscount(paramsFlatRateDiscount);
            const totalCosts = this.mapLongDistanceDiscount(postFlatRateDiscountCosts, servDist);

            result['distance'] = Math.ceil(servDist);
            result['duration'] = Math.ceil(servTime);
            result['price'] = (totalCosts % 1) >= 0.5 ? Math.ceil(totalCosts) : Math.floor(totalCosts);

            return {routeData: result};
        } catch(err) {
            const message = 'ERROR ON MODEL CALCULATION + API';
            const method = 'TAVA_DrivingModel_calcGolfRoute';
            Utils.logError(message, method, err);
            if(err instanceof UnexpectedApiResponseException) {
                throw err;
            }
            throw new UnexpectedException(err);
        }
    }

    _calcApproachH2O(distance) {
        if(typeof(distance) !== 'number') {
            return 0;
        }

        return this.calcApproachDistanceAdvanced(distance) * this.#prices.approach.perKm;
    }

    _calcSingleDayStayCosts() {
        return this.#prices.stay.singleDay;
    }

    _calcMultiDayStayCosts(days) {
        return days * this.#prices.stay.perDay;
    }

    _calcDiscountByOptions(params) {
        return params.isYouthOption || params.isSupportOption 
            ? params.servDist * this.#prices.discount.perServKm 
            : 0;
    }

    _mapFlatRateDiscount(params) {
        // Always 25% (max 48€) discount on youth or support option.
        if(params.isYouthOption || (params.isSupportOption && params.passengers < 4)) {
            const discount = params.costs * this.#prices.discount.preference;
            return discount <= 48 ? params.costs - discount : params.costs - 48;
        }

        return params.costs;
    }
}

module.exports = DrivingGolfModel;