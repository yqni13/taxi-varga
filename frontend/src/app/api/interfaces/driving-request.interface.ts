export interface DrivingAirportRequest {
    origin: string,
    originDetails: unknown,
    destination: string,
    destinationDetails: unknown
}

export interface DrivingDestinationRequest {
    origin: string,
    originDetails: unknown,
    destination: string,
    destinationDetails: unknown,
    back2home: boolean,
    latency: number,
    pickupTIME: number
}

export interface DrivingFlatrateRequest {
    origin: string,
    originDetails: unknown,
    destination: string,
    destinationDetails: unknown,
    tenancy: number,
}

export interface DrivingGolfRequest {
    origin: string,
    originDetails: unknown,
    golfcourse: string,
    golfcourseDetails: unknown,
    destination: string,
    destinationDetails: unknown,
    stayInMinutes?: number,
    stayInDays: number,
    supportMode: boolean,
    youthOption: boolean,
    passengers: number
}

export interface DrivingQuickRequest {
    origin: string,
    originDetails: unknown,
    destination: string,
    destinationDetails: unknown,
    latency: number,
    back2origin: boolean,
    pickupTIME: string
}