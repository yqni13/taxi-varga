import { PassengerOptions } from "../../shared/enums/passenger-options.enum"
import { ServiceRoute } from "../routes/service.route.enum"

export declare interface MailingRequest {
    sender: string,
    subject: string,
    body: string
}

export declare interface MailingMessage {
    service: ServiceRoute,
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