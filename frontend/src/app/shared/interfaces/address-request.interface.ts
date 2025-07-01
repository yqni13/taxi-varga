import { AddressFilterOptions } from "../enums/addressfilter-options.enum"

export declare interface AddressAutocompleteRequest {
    address: string,
    language: string,
    filter: AddressFilterOptions
    sessiontoken: string
}

export declare interface AddressDetailsRequest {
    placeId: string,
    language: string,
    sessiontoken: string
}