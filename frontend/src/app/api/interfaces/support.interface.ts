import { SupportDeviceOption } from "../enums/device-option.support.enum";
import { SupportOption } from "../enums/ticket-option.support.enum";

export interface SupportTicketRequest {
    attachment?: any;
    user_email: string,
    option: SupportOption,
    title: string,
    message: string,
    info_browser?: string,
    info_os?: string,
    info_device?: SupportDeviceOption
}

export interface SupportFeedbackRequest {
    user_email: string,
    rating: number,
    term_accepted: boolean,
    message?: string
}

export interface SupportRatingRequest {
    client_name: string
}

export interface SupportTicketResponse {
    status: string,
    option: SupportOption,
    flag: any,
    last_modified: string,
    created_on: string
}

export interface SupportFeedbackResponse {
    rating: number,
    rating_average_new?: number,
    rating_old?: number,
    last_modified: string,
    created_on: string,
}

export interface SupportRatingResponse {
    rating_average: number
}