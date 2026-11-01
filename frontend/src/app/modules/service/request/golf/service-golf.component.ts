/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, OnInit, ChangeDetectionStrategy, signal } from "@angular/core";
import { BaseServiceComponent } from "../../../../common/components/base-service.component";
import { ServiceImportsModule } from "../../../../common/helper/service-imports.helper";
import { FormControl, Validators } from "@angular/forms";
import { ServiceRoute } from "../../../../api/routes/service.route.enum";
import { filter, ReplaySubject, Subject, tap } from "rxjs";
import * as CustomValidators from "../../../../common/helper/custom-validators";
import { SelectInputComponent } from "../../../../common/components/form-components/select-input/select-input.component";
import { PassengerOptions } from "../../../../shared/enums/passenger-options.enum";
import { DistanceFormatPipe } from "../../../../common/pipes/distance-format.pipe";
import { AddressFilterOptions } from "../../../../shared/enums/addressfilter-options.enum";
import { DatetimeOption } from "../../../../shared/enums/datetime-options.enum";
import { InvalidBHValidatorParams, StayTimeValidatorParams } from "../../../../shared/interfaces/custom-validators.interface";
import { ExtraGolfAddresses } from "../../../../api/interfaces/address-helper.interface";

@Component({
    selector: 'tava-service-golf',
    imports: [
        DistanceFormatPipe,
        SelectInputComponent,
        ...ServiceImportsModule
    ],
    templateUrl: './service-golf.component.html',
    styleUrls: [
        '../../service.component.scss',
        './service-golf.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class ServiceGolfComponent extends BaseServiceComponent implements OnInit, AfterViewInit {

    protected readonly hasExtraAddresses = signal(false);
    protected readonly numOfExtraAddresses = signal(0);
    protected readonly isMultiDayTrip = signal(false);

    protected AddressFilterOptionsEnum = AddressFilterOptions;
    protected PassengerOptionsEnum = PassengerOptions;
    protected dropoffTimeByLang$ = new Subject<string>();
    protected dropoffTimeByLangStatic = "";
    protected minStayStamp$ = new ReplaySubject<string>();
    protected maxStayStamp$ = new ReplaySubject<string>();
    protected override snackbarTextMail = 'laszlovarga@gmx.at';

    private stayTimeParams: StayTimeValidatorParams = {
        service: this.datetimeService,
        maxHours: 9,
        validation: 'maxStayTime9'
    };
    private invalidBHValidatorParams: InvalidBHValidatorParams = {
        service: this.datetimeService,
        format: DatetimeOption.FULL,
        startHour: 4,
        endHour: 12,
        isPickup: true
    };


    override async ngOnInit() {
        this.service = ServiceRoute.GOLF;
        super.ngOnInit();
        this.initEdit();
    }

    override ngAfterViewInit() {
        super.ngAfterViewInit();
        this.subscriptionHttpObservationDriving$ = this.httpObserve.drivingGolfStatus$.pipe(
            filter((x) => x || !x),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.hasOffer = true;
                    this.mapMetaFormControls(this.serviceForm);
                    this.httpObserve.setDrivingGolfStatus(false);
                }
                this.loadOfferResponse = false;
            })
        ).subscribe();
    }

    private initForm() {
        this.serviceForm = this.fb.group({
            service: new FormControl(''),
            originAddress: new FormControl('', Validators.required),
            originDetails: new FormControl(''),
            golfcourseAddress: new FormControl('', Validators.required),
            golfcourseDetails: new FormControl(''),
            destinationAddress: new FormControl(''),            
            destinationDetails: new FormControl(''),
            extraAddress1: new FormControl(''),
            extraDetails1: new FormControl(''),
            extraAddress2: new FormControl(''),
            extraDetails2: new FormControl(''),
            extraAddress3: new FormControl(''),
            extraDetails3: new FormControl(''),
            extraAddresses: new FormControl(''),
            return: new FormControl(null),
            datetimeStart: new FormControl('', [
                Validators.required,
                CustomValidators.priorityValidator([
                    CustomValidators.negativeCurrentDateTimeValidator(this.datetimeService),
                    CustomValidators.invalidBusinessHoursValidator(this.invalidBHValidatorParams)
                ])
            ]),
            datetimeEnd: new FormControl(''),
            daytrip: new FormControl('', [Validators.required, CustomValidators.maxStayTimeValidator(this.stayTimeParams)]),
            passengers: new FormControl('', Validators.required),
            stayInHHmm: new FormControl(''),
            stayInDays: new FormControl(''),
            supportMode: new FormControl(''),
            youthOption: new FormControl(''),
            pickupDATE: new FormControl(''),
            pickupTIME: new FormControl(''),
            dropOffDATE: new FormControl(''),
            dropOffTIME: new FormControl(''),
            distance: new FormControl(''),
            duration: new FormControl(''),
            price: new FormControl('')
        });
    }
    
    private initEdit() {
        this.initForm();
        this.serviceForm.patchValue({
            service: this.service,
            originAddress: '',
            originDetails: null,
            golfcourseAddress: '',
            golfcourseDetails: null,
            destinationAddress: '',
            destinationDetails: null,
            extraAddress1: '',
            extraDetails1: null,
            extraAddress2: '',
            extraDetails2: null,
            extraAddress3: '',
            extraDetails3: null,
            extraAddresses: '',
            return: true,
            passengers: '',
            stayInHHmm: null,
            stayInDays: null,
            supportMode: false,
            youthOption: false,
            datetimeStart: '',
            datetimeEnd: '',
            daytrip: '',
            pickupDATE: '',
            pickupTIME: '',
            dropOffDATE: '',
            dropOffTIME: '',
            distance: null,
            duration: null,
            price: null
        });
    }

    addExtraAddress() {
        if (this.numOfExtraAddresses() < 4) {
            this.numOfExtraAddresses.update(current => ++current);
        }
    }

    removeExtraAddress() {
        if (this.numOfExtraAddresses() > 1) {
            this.numOfExtraAddresses.update(current => --current);
        } else if (this.numOfExtraAddresses() === 1) {
            this.hasExtraAddresses.set(false);
            this.configExtraAddress(false);
        }
    }

    getOrigin4ReturnAddress() {
        this.serviceForm.get('destinationAddress')?.setValue(this.serviceForm.get('originAddress')?.value);
        this.serviceForm.get('destinationDetails')?.setValue(this.serviceForm.get('originDetails')?.value);
    }

    getReturnCheckboxValue(isChecked: boolean) {
        this.serviceForm.get('return')?.setValue(isChecked);
        this.configReturnAddress(isChecked);
    }

    getExtraAddressCheckboxValue(isChecked: boolean) {
        this.hasExtraAddresses.set(isChecked);
        this.configExtraAddress(isChecked);
    }

    getSupportCheckboxValue(isChecked: boolean) {
        this.serviceForm.get('supportMode')?.setValue(isChecked);
    }

    getYouthCheckboxValue(isChecked: boolean) {
        this.serviceForm.get('youthOption')?.setValue(isChecked);
    }

    getTripCheckboxValue(isChecked: boolean) {
        this.isMultiDayTrip.set(isChecked);
        this.configDayTrip();
    }

    private configReturnAddress(isOrigin: boolean) {
        this.serviceForm.get('destinationAddress')?.clearValidators();
        if(!isOrigin) {
            this.serviceForm.get('destinationAddress')?.setValue('');
            this.serviceForm.get('destinationDetails')?.setValue(null);
            this.serviceForm.get('destinationAddress')?.setValidators(Validators.required);
        } else {
            this.serviceForm.get('destinationAddress')?.setValue(this.serviceForm.get('originAddress')?.value);
            this.serviceForm.get('destinationDetails')?.setValue(this.serviceForm.get('originDetails')?.value);
        }
    }

    private configExtraAddress(hasExtra: boolean) {
        if (hasExtra) {
            this.numOfExtraAddresses.set(1);
        } else {
            this.numOfExtraAddresses.set(0);
            this.serviceForm.get('extraAddress1')?.setValue('');
            this.serviceForm.get('extraAddress2')?.setValue('');
            this.serviceForm.get('extraAddress3')?.setValue('');
            this.serviceForm.get('extraDetails1')?.setValue(null);
            this.serviceForm.get('extraDetails2')?.setValue(null);
            this.serviceForm.get('extraDetails3')?.setValue(null);
        }
    }

    configSupportModeOnPassengers() {
        const passengers = this.serviceForm.get('passengers')?.value;
        if(passengers === PassengerOptions.PPL4) {
            this.serviceForm.get('supportMode')?.setValue(false);
        }
        if(passengers === PassengerOptions.PPL3 || passengers === PassengerOptions.PPL4) {
            this.serviceForm.get('supportMode')?.setValue(false);
        } else if(this.serviceForm.get('supportMode')?.value === null) {
            this.serviceForm.get('supportMode')?.setValue(false);
        }
    }

    configDayTrip() {
        const datetimeEnd = this.serviceForm.get('datetimeEnd');
        datetimeEnd?.clearValidators();
        datetimeEnd?.setValue('');

        const daytrip = this.serviceForm.get('daytrip');
        daytrip?.clearValidators();

        if (this.isMultiDayTrip()) {
            daytrip?.setValue('');
            const datetimeStart = this.serviceForm.get('datetimeStart')?.value;
            this.configDateTimeEnd(datetimeStart);
        } else {
            daytrip?.setValue('');
            daytrip?.setValidators([
                Validators.required,
                CustomValidators.maxStayTimeValidator(this.stayTimeParams)
            ]);
            daytrip?.markAsUntouched();
            daytrip?.markAsPristine();
        }
    }

    configDateTimeEnd($event: any) {
        const datetimeStart = this.serviceForm.get('datetimeStart');
        if (!this.isMultiDayTrip() || !datetimeStart || datetimeStart?.value === '') {
            return;
        }

        const mints = this.datetimeService.getNextDayStartingTimestamp($event);
        const restrictionHours = (8 * 24) - 24; // Max of 8 days but including 1st day starting from 00:00.
        const restrictDateTime = this.datetimeService.getRestrictionTimestampHoursBased($event, restrictionHours);
        this.minStayStamp$.next(mints);
        this.maxStayStamp$.next(restrictDateTime);
        this.serviceForm.get('datetimeEnd')?.clearValidators();
        this.serviceForm.get('datetimeEnd')?.setValidators([
            CustomValidators.requiredTenancyValidator(),
            CustomValidators.negativeFixedDateTimeValidator(
                this.datetimeService,
                this.serviceForm.get('datetimeStart')?.value
            ),
            CustomValidators.invalidZeroTenancyValidator(this.datetimeService, this.serviceForm.get('datetimeStart')?.value),
        ]);
        this.serviceForm.get('datetimeEnd')?.setValue('');
        this.serviceForm.get('datetimeEnd')?.markAsUntouched();
        this.serviceForm.get('datetimeEnd')?.markAsPristine();
    }

    async onSubmitOffer() {
        this.serviceForm.markAllAsTouched();

        // Run config again to ensure correct address if origin was updated afterwards.
        if(this.serviceForm.get('return')?.value === true) {
            this.configReturnAddress(true);
        }

        if(this.serviceForm.invalid) {
            return;
        }

        this.configDateTimeData();
        this.configSupportMode();
        this.configExtraAddresses();
        this.drivingAPIService.setDataGolf(this.serviceForm.getRawValue());
        this.drivingAPIService.sendGolfRequest().subscribe(data => {
            this.addResponseRouteData2Form(data);
        });
        this.loadOfferResponse = true;
        await this.delay(100);
        this.scrollToTop();
    }

    private configDateTimeData() {
        this.serviceForm.get('pickupDATE')?.setValue(this.datetimeService.getDateFromTimestamp(
            this.serviceForm.get('datetimeStart')?.value
        ));
        this.serviceForm.get('pickupTIME')?.setValue(this.datetimeService.getTimeFromTimestamp(
            this.serviceForm.get('datetimeStart')?.value
        ));

        if (this.isMultiDayTrip()) {
            this.serviceForm.get('stayInHHmm')?.setValue(this.datetimeService.getTimeDifferenceAsString(
                this.serviceForm.get('datetimeStart')?.value,
                this.serviceForm.get('datetimeEnd')?.value,
                true
            ));

            const start = this.datetimeService.getTodayStartingTimestamp(false, this.serviceForm.get('datetimeStart')?.value);
            const end = this.serviceForm.get('datetimeEnd')?.value;
            let diff = this.datetimeService.getTimeDifferenceAsNumbers(start, end);
            this.serviceForm.get('stayInDays')?.setValue(diff.startedDays);

            this.serviceForm.get('dropOffDATE')?.setValue(this.datetimeService.getDateFromTimestamp(
                this.serviceForm.get('datetimeEnd')?.value
            ));

            this.serviceForm.get('dropOffTIME')?.setValue(this.datetimeService.getTimeFromTimestamp(
                this.serviceForm.get('datetimeEnd')?.value
            ));
        } else {
            this.serviceForm.get('stayInDays')?.setValue(1);
            this.serviceForm.get('stayInHHmm')?.setValue(this.serviceForm.get('daytrip')?.value);
        }

        this.pickupTimeByLangStatic = this.datetimeService.getTimeFromLanguage(
            this.serviceForm.get('pickupTIME')?.value,
            this.translate.currentLang
        );
        this.dropoffTimeByLangStatic = this.datetimeService.getTimeFromLanguage(
            this.serviceForm.get('dropOffTIME')?.value,
            this.translate.currentLang
        );
    }

    private configSupportMode() {
        const val = this.serviceForm.get('supportMode')?.value;
        this.serviceForm.get('supportMode')?.setValue(val === null ? false : val);
    }

    private configExtraAddresses() {
        let addresses: ExtraGolfAddresses | null = { extra1: null, extra2: null, extra3: null };
        let isEmpty = true;
        let numOfAddresses = 0;

        // Maintain type safety in Typescript => Object.keys/entries needs type assertion for iteration.
        const typeAssertedAddresses = Object.keys(addresses) as (keyof ExtraGolfAddresses)[];
        typeAssertedAddresses.forEach((k, index: number) => {
            if (this.serviceForm.get(`extraAddress${index+1}`)?.value !== '') {
                addresses[k] = this.serviceForm.get(`extraAddress${index+1}`)?.value;
                isEmpty = false;
                numOfAddresses++;
            }
        })

        this.numOfExtraAddresses.set(numOfAddresses);
        this.serviceForm.get('extraAddresses')?.setValue(isEmpty ? null : addresses);
    }
}