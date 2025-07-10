import { QuickRouteOption } from "../enums/quickroute-option.enum"

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
            duration: number,
            price: number,
        }
    }
}

export declare interface DrivingFlatrateResponse {
    body: {
        routeData: {
            tenancy: number,
            price: number
        }
    }
}

export declare interface DrivingGolfResponse {
    body: {
        routeData: {
            distance: number,
            duration: number,
            stay: number,
            price: number,
        }
    }
}

export declare interface DrivingQuickResponse {
    body: {
        routeData: {
            price: number,
            servTime: number,
            servDist: number,
            latency: { time: number, costs: number },
            returnTarget: QuickRouteOption
        }
    }
}