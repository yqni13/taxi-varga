const GoogleRoutes = require('../../services/google-routes/google-routes.api');
const Secrets = require('../../utils/secrets.utils');

class DrivingFlatrateModel {
    calcFlatrateRoute = async (params) => {
        if(!Object.keys(params).length) {
            return {error: 'no params found'};
        }

        const priceApproachPerKm = 0.5;
        const priceReturnPerKm = 0.5;
        let totalCost = 0;

        const tenancyObj = this.#calculateTenancyValues(Number(params['tenancy']));

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
            totalCost = tenancyObj.costs + approachCost + returnCost;
        } else {
            totalCost = tenancyObj.costs + (approachCost * 2);
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
}

module.exports = new DrivingFlatrateModel;