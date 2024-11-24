class DrivingModel {
    calcAirportRoute = async (params = {}) => {
        return await {distance: 35, price: 44.50};
    }
    calcDestinationRoute = async (params = {}) => {
        return await {distance: 11.11, price: 22.22};
    }
    calcFlatrateRoute = async (params = {}) => {
        return await {distance: 55, price: 55};
    }
}

module.exports = new DrivingModel;