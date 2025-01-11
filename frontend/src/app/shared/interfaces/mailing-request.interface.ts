export declare interface MailingRequest {
    sender: string,
    subject: string,
    body: string,
}

export declare interface MailingMessage {
    service: 'airport' | 'destination' | 'flatrate',
    gender: 'male' | 'female',
    title?: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    note?: string,
    origin: string,
    destination: string,
    back2home?: boolean,
    pickupDATE: string,
    pickupTIME: string,
    dropoffDATE?: string,
    dropoffTIME?: string,
    tenancy?: string,
    latency?: string,
    duration?: string,
    distance?: number,
    price: number
}