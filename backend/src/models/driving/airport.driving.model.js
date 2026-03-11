const Utils = require('../../utils/common.utils');
const { UnexpectedApiResponseException } = require('../../utils/exceptions/api.exception');
const { UnexpectedException } = require("../../utils/exceptions/common.exception");

class DrivingAirportModel {
    #googleRoutes;
    #prices;
    #districts;
    
    constructor(googleRoutesApi) {
        this.#googleRoutes = googleRoutesApi;
        this.#prices = {
            district: {
                exception: 35,
                inner: 42,
                middle: 45,
                outer: 48
            }
        };
        this.#districts = {
            exception: [11],
            inner: [1, 2, 3, 4, 10],
            middle: [5, 6, 7, 8, 9, 12, 15, 20],
            outer: [13, 14, 16, 17, 18, 19, 21, 22, 23]
        };
    }

    async calcAirportRoute(params) {
        try {
            let district, matrixParams;
            if(params['origin'] === 'vie-schwechat') {
                district = params['destinationDetails']['zipCode'];
                matrixParams = {
                    origin: params['origin'],
                    destination: params['destinationDetails']['placeId'],
                    useId: 'destination'
                };
            } else if(params['destination'] === 'vie-schwechat') {
                district = params['originDetails']['zipCode'];
                matrixParams = {
                    origin: params['originDetails']['placeId'],
                    destination: params['destination'],
                    useId: 'origin'
                };
            }

            const route = await this.#googleRoutes.requestMapsMatrix(matrixParams, matrixParams['useId']);
            const distance = (route.rows[0].elements[0].distance.value) / 1000 // result divided by 1000, get total km
            const duration = (route.rows[0].elements[0].duration.value) / 60 // result divided by 60, get total minutes
            const price = this._mapPriceByZipCode(Number(district.slice(1,3)))

            return {
                routeData: {
                    duration: Math.ceil(duration),
                    distance: Math.ceil(distance),
                    price: price
                }
            };
        } catch(err) {
            const message = 'ERROR ON MODEL CALCULATION + API';
            const method = 'TAVA_DrivingModel_calcAirportRoute';
            Utils.logError(message, method, err);
            if(err instanceof UnexpectedApiResponseException) {
                throw err;
            }
            throw new UnexpectedException(err);
        }
    }

    _mapPriceByZipCode(district) {
        const districtPriceRules = [
            { area: this.#districts.exception, apply: () => this.#prices.district.exception },
            { area: this.#districts.inner, apply: () => this.#prices.district.inner },
            { area: this.#districts.middle, apply: () => this.#prices.district.middle },
            { area: this.#districts.outer, apply: () => this.#prices.district.outer },
        ];

        return districtPriceRules.find(rule => rule.area.includes(district)).apply();
    }
}

module.exports = DrivingAirportModel;