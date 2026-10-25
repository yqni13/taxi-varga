export interface DrivingAirportRequest {
    origin: string,
    originDetails: any,
    destination: string,
    destinationDetails: any
}

export interface DrivingDestinationRequest {
    origin: string,
    originDetails: any,
    destination: string,
    destinationDetails: any,
    back2home: boolean,
    latency: number,
    pickupTIME: number
}

export interface DrivingFlatrateRequest {
    origin: string,
    originDetails: any,
    destination: string,
    destinationDetails: any,
    tenancy: number,
}

export interface DrivingGolfRequest {
    origin: string,
    originDetails: any,
    golfcourse: string,
    golfcourseDetails: any,
    destination: string,
    destinationDetails: any,
    stayInMinutes?: number,
    stayInDays: number,
    supportMode: boolean,
    youthOption: boolean,
    passengers: number
}

export interface DrivingQuickRequest {
    origin: string,
    originDetails: any,
    destination: string,
    destinationDetails: any,
    latency: number,
    back2origin: boolean,
    pickupTIME: string
}