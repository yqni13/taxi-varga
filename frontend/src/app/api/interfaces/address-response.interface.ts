export interface AddressAutocompleteResponse {
    descriptionFull: string,
    descriptionMain: string,
    placeId: string,
}

export interface AddressDetailsResponse {
    address: string,
    zipCode: string,
    province: string,
    country: string,
    placeId: string
}

export interface AddressDetailsData {
    address: string,
    zipCode?: string,
    province: string,
    country: string,
    placeId: string
}