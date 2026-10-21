import { QuickRouteOption } from "../../shared/enums/quickroute-option.enum"

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
            duration: number,
            price: number,
        }
    }
}

export interface DrivingFlatrateResponse {
    body: {
        routeData: {
            tenancy: number,
            price: number
        }
    }
}

export interface DrivingGolfResponse {
    body: {
        routeData: {
            distance: number,
            duration: number,
            stay: number,
            price: number,
        }
    }
}

export interface DrivingQuickResponse {
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