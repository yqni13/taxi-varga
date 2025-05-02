const GoogleRoutes = require('../../services/google-routes/google-routes.api');
const Secrets = require('../../utils/secrets.utils');

class DrivingFlatrateModel {
    calcFlatrateRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const priceApproachPerKm = 0.5;
        const priceReturnPerKm = 0.5;
        const priceFlatrate30Min = 17.5;
        let totalCost = 0;

        const tenancy = (params['tenancy'] / 30) * priceFlatrate30Min; 

        const approachRoute = await GoogleRoutes.requestMapsMatrix({
            origin: Secrets.HOME_ADDRESS,
            destination: params['originDetails']['placeId']
        }, 'destination');
        const approachDistance = ((approachRoute.rows[0].elements[0].distance.value) / 1000);
        const approachCost = (approachDistance % 1) >= 5
            ? Math.ceil(approachDistance) * priceApproachPerKm
            : Math.floor(approachDistance) * priceApproachPerKm;

        if(params['origin'] !== params['destination']) {
            const returnRoute = await GoogleRoutes.requestMapsMatrix({
                origin: params['destinationDetails']['placeId'],
                destination: Secrets.HOME_ADDRESS
            }, 'origin');
            const returnDistance = ((returnRoute.rows[0].elements[0].distance.value) / 1000);
            const returnCost = (returnDistance % 1) >= 5
                ? Math.ceil(returnDistance) * priceReturnPerKm
                : Math.floor(returnDistance) * priceReturnPerKm;
            totalCost = tenancy + approachCost + returnCost;
        } else {
            totalCost = tenancy + (approachCost * 2);
        }

        return { 
            routeData: {
                price: Math.ceil(totalCost)
            }
        };
    }

}

module.exports = new DrivingFlatrateModel;