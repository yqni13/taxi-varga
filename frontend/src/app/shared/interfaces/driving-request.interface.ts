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
    latency: number,
    pickupTIME: number
}

export declare interface DrivingFlatrateRequest {
    origin: string,
    originDetails: any,
    destination: string,
    destinationDetails: any,
    tenancy: number,
}

export declare interface DrivingGolfRequest {
    origin: string,
    originDetails: any,
    golfcourse: string,
    golfcourseDetails: any,
    destination: string,
    destinationDetails: any,
    stay: number,
    supportMode: boolean
}

export declare interface DrivingQuickRequest {
    origin: string,
    originDetails: any,
    destination: string,
    destinationDetails: any,
    latency: number,
    back2origin: boolean,
    pickupTIME: string
}