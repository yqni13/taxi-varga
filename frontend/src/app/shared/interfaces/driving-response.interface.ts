export interface DrivingAirportResponse {
    body: {
        routeData: {
            distance: number,
            duration: number,
            price: number,
        }
    }
}

export interface DrivingDestinationResponse {
    body: {
        routeData: {
            distance: number,
            time: number,
            price: number,
        }
    }
}

export interface DrivingFlatrateResponse {
    body: {
        routeData: {
            price: number,
        }
    }
}