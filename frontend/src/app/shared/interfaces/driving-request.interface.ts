export declare interface DrivingAirportRequest {
    origin: string,
    destination: string,
    datetime: string // TODO(yqni13): not implemented at the moment
}

export declare interface DrivingDestinationRequest {
    origin: string,
    destination: string,
    back2home: boolean
}

export declare interface DrivingFlatrateRequest {
    origin: string // TODO(yqni13): not implemented at the moment
}