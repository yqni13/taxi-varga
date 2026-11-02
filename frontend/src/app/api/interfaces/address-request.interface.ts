import { AddressFilterOptions } from "../../shared/enums/addressfilter-options.enum"

export interface AddressAutocompleteRequest {
    address: string,
    language: string,
    filter: AddressFilterOptions
    sessionToken: string
}

export interface AddressDetailsRequest {
    placeId: string,
    language: string,
    sessionToken: string
}

export interface AddressGelocationRequest {
    latitude: string,
    longitude: string,
    language: string
}