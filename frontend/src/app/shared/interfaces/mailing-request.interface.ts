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
    date: string,
    time: string,
    tenancy?: string,
    duration?: string,
    distance?: string,
    price: string
}