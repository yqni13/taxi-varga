export declare interface DrivingAirportResponse {
    body: {
        routeData: {
            distance: number,
            duration: number,
            price: number,
        }
    }
}

export declare interface DrivingDestinationResponse {
    body: {
        routeData: {
            distance: number,
            time: number,
            price: number,
        }
    }
}

export declare interface DrivingFlatrateResponse {
    body: {
        routeData: {
            price: number,
        }
    }
}

export declare interface DrivingGolfResponse {
    body: {
        routeData: {
            distance: number,
            time: number,
            priceDriving: number,
            priceSupport: number,
            price: number,
        }
    }
}