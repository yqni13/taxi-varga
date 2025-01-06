export declare interface DrivingAirportRequest {
    origin: string | null,
    destination: string | null,
}

export declare interface DrivingDestinationRequest {
    origin: string,
    destination: string,
    back2home: boolean
}

export declare interface DrivingFlatrateRequest {
    origin: string,
    destination: string,
    tenancy: string,
}