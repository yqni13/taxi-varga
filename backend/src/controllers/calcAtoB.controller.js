const CalcAtoBRepository = require('../repositories/calcAtoB.repository');

class CalcAtoBController {
    getCalculation = async (req, res, next) => {
        // console.log(req.body); // result == {}
        const response = await CalcAtoBRepository.calcRoute(req.body);
        res.send(response);
    }
}

module.exports = new CalcAtoBController;