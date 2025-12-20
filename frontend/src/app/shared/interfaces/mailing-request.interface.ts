import { PassengerOptions } from "../enums/passenger-options.enum"
import { ServiceOptions } from "../enums/service-options.enum"

export declare interface MailingRequest {
    sender: string,
    subject: string,
    body: string
}

export declare interface MailingMessage {
    service: ServiceOptions,
    gender: 'male' | 'female',
    title?: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    note?: string,
    airport?: string,
    originAddress: string,
    golfcourseAddress?: string,
    destinationAddress: string,
    back2home?: boolean,
    pickupDATE: string,
    pickupTIME: string,
    dropOffDATE?: string,
    dropOffTIME?: string,
    supportMode: boolean,
    passengers?: PassengerOptions,
    stay?: string,
    tenancy?: string,
    latency?: string,
    duration?: string,
    distance?: number,
    price: number
}