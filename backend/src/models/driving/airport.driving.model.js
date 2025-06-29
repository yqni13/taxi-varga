const { NotFoundException } = require('../../utils/exceptions/common.exception');

class DrivingAirportModel {
    #googleRoutes;
    #prices;
    
    constructor(googleRoutesApi) {
        this.#googleRoutes = googleRoutesApi;
        this.#prices = {
            innerRange: 42,
            middleRange: 45,
            outerRange: 48
        }
    }

    calcAirportRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        // CONFIGURE PARAMETERS
        const districtInnerRange = [1, 2, 3, 4, 10, 11];
        const districtMiddleRange = [5, 6, 7, 8, 9, 12, 15, 20];
        const districtOuterRange = [13, 14, 16, 17, 18, 19, 21, 22, 23];
        let district, price, matrixParams;

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
        const distance = (route.rows[0].elements[0].distance.value) / 1000 // result divided by 1000 to get total km
        const duration = (route.rows[0].elements[0].duration.value) / 60 // result divided by 60 to get total minutes

        // PRICE CALC BASED ON ZIPCODE
        district = Number(district.slice(1,3));
        if(districtInnerRange.includes(district)) {
            price = this.#prices.innerRange;
        } else if(districtMiddleRange.includes(district)) {
            price = this.#prices.middleRange;
        } else if(districtOuterRange.includes(district)) {
            price = this.#prices.outerRange;
        } else {
            throw new NotFoundException('Vienna zip code not found');
        }

        return {
            routeData: {
                duration: Math.ceil(duration),
                distance: Math.ceil(distance),
                price: price
            }
        };
    }
}

module.exports = DrivingAirportModel;