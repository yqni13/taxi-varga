export declare interface DrivingAirportRequest {
    origin: string,
    destination: string
}

export declare interface DrivingDestinationRequest {
    origin: string,
    destination: string,
    back2home: boolean,
    latency: number
}

export declare interface DrivingFlatrateRequest {
    origin: string,
    destination: string,
    tenancy: number,
}