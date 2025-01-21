/* eslint-disable @typescript-eslint/no-explicit-any */

export declare interface DrivingAirportRequest {
    origin: string,
    originDetails: any,
    destination: string,
    destinationDetails: any
}

export declare interface DrivingDestinationRequest {
    origin: string,
    originDetails: any,
    destination: string,
    destinationDetails: any,
    back2home: boolean,
    latency: number
}

export declare interface DrivingFlatrateRequest {
    origin: string,
    originDetails: any,
    destination: string,
    destinationDetails: any,
    tenancy: number,
}