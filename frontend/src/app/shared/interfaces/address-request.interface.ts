import { AddressFilterOptions } from "../enums/addressfilter-options.enum"

export declare interface AddressAutocompleteRequest {
    address: string,
    language: string,
    filter: AddressFilterOptions
    sessionToken: string
}

export declare interface AddressDetailsRequest {
    placeId: string,
    language: string,
    sessionToken: string
}

export declare interface AddressGelocationRequest {
    latitude: string,
    longitude: string,
    language: string
}