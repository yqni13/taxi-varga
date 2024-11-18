class CalcAtoBModel {
    calcRoute = async (params = {}) => {
        console.log('get into model');
        return await {distance: 35, price: 44.50};
    }
}

module.exports = new CalcAtoBModel;