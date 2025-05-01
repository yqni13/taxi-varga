const GoogleRoutes = require('../../services/google-routes/google-routes.api');
const { NotFoundException } = require('../../utils/exceptions/common.exception');

class DrivingAirportModel {
    calcAirportRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        // CONFIGURE PARAMETERS
        const districtRange42 = [1, 2, 3, 4, 10, 11];
        const districtRange45 = [5, 6, 7, 8, 9, 12, 15, 20];
        const districtRange48 = [13, 14, 16, 17, 18, 19, 21, 22, 23];
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

        const route = await GoogleRoutes.requestMapsMatrix(matrixParams, matrixParams['useId']);
        const distance = (route.rows[0].elements[0].distance.value) / 1000 // result divided by 1000 to get total km
        const duration = (route.rows[0].elements[0].duration.value) / 60 // result divided by 60 to get total minutes

        // PRICE CALC BASED ON ZIPCODE
        district = Number(district.slice(1,3));
        if(districtRange42.includes(district)) {
            price = 42;
        } else if(districtRange45.includes(district)) {
            price = 45;
        } else if(districtRange48.includes(district)) {
            price = 48;
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


module.exports = new DrivingAirportModel;