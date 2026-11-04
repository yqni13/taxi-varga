import { AddressDetailsData } from "../../api/interfaces/address-response.interface";
import { ServiceRoute } from "../../api/routes/service.route.enum";
import { AirportOptions } from "../enums/airport-options.enum";

export interface ServiceBaseForm {
    originAddress: string,
    originDetails: AddressDetailsData | null,
    destinationAddress: string,
    destinationDetails: AddressDetailsData | null,
    price: number
}

export interface ServiceMetaForm {
    gender: string,
    title: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    note: string
}

export interface ServiceGolfForm extends ServiceBaseForm, ServiceMetaForm {
    service: ServiceRoute,
    airportMode: AirportOptions,
    datetime: string,
    pickupDATE: string,
    pickupTIME: string,
    distance: number,
    duration: string
}