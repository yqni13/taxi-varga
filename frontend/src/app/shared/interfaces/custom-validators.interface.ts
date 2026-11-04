import { DatetimeOption } from "../enums/datetime-options.enum";
import { DateTimeService } from "../services/datetime.service";

export interface ValidateBaseParams {
    dtServ: DateTimeService
}

export interface InvalidBHParams extends ValidateBaseParams {
    options: { min: number, max: number },
    isPickup: boolean,
    format: DatetimeOption
}

export interface InvalidBHValidatorParams {
    service: DateTimeService,
    format: DatetimeOption,
    startHour: number,
    endHour: number
    isPickup: boolean
}

export interface TimeRangeValidatorParams {
    service: DateTimeService,
    format: DatetimeOption,
    startHour: number,
    endHour: number,
    validation: string
}

export interface StayTimeValidatorParams {
    service: DateTimeService,
    maxHours: number,
    validation: string
}