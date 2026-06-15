class BaseDrivingModel {
    mapLongDistanceDiscount(costs, servDist) {
        const distanceRules = [
            { max: 200, apply: (cost) => cost },
            { max: 300, apply: (cost) => cost * (1 - 0.1) },
            { max: 400, apply: (cost) => cost * (1 - 0.15) },
            { max: Infinity, apply: (cost) => cost * (1 - 0.2) }
        ];

        return distanceRules.find(rule => servDist < rule.max).apply(costs);
    }

    calcApproachDistanceAdvanced(servDist) {
        const distanceRules = [
            { max: 20, apply: (dist) => 0 },
            { max: 60, apply: (dist) => dist - 20 },
            { max: Infinity, apply: (dist) => dist }
        ];

        return distanceRules.find(rule => servDist < rule.max).apply(servDist);
    }

    calculateSum(arr) {
        let sum = 0;
        arr.map(entry => sum += entry);
        return sum;
    }

    substractAllDiscounts(sum, arr) {
        if(arr.length === 0) {
            return sum;
        }
        arr.map(entry => sum -= entry);
        return sum;
    }
}

module.exports = BaseDrivingModel;