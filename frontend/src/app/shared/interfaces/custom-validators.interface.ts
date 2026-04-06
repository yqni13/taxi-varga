import { DatetimeOption } from "../enums/datetime-options.enum";
import { DateTimeService } from "../services/datetime.service";

export interface InvalidBHValidatorParams {
    service: DateTimeService,
    format: DatetimeOption,
    startHour: number,
    endHour: number
}