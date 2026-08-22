import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { filter, Subscription, tap } from "rxjs";
import { FormControl, Validators } from "@angular/forms";
import { DistanceFormatPipe } from "../../../../common/pipes/distance-format.pipe";
import * as CustomValidators from "../../../../common/helper/custom-validators";
import { ServiceRoute } from "../../../../api/routes/service.route.enum";
import { BaseServiceComponent } from "../../../../common/components/base-service.component";
import { ServiceImportsModule } from "../../../../common/helper/service-imports.helper";
import { AirportOptions } from "../../../../shared/enums/airport-options.enum";
import { DatetimeOption } from "../../../../shared/enums/datetime-options.enum";
import { InvalidBHValidatorParams } from "../../../../shared/interfaces/custom-validators.interface";

@Component({
    selector: 'tava-service-airport',
    templateUrl: './service-airport.component.html',
    styleUrls: [
        '../../service.component.scss',
        './service-airport.component.scss'
    ],
    imports: [
        DistanceFormatPipe,
        ...ServiceImportsModule
    ]
})
export class ServiceAirportComponent extends BaseServiceComponent implements OnInit, AfterViewInit, OnDestroy {

    protected directionOptions = AirportOptions;

    private addressSubscription$: Subscription | undefined = new Subscription();

    constructor() {
        super();
    }

    override async ngOnInit() {
        this.service = ServiceRoute.AIRPORT;
        super.ngOnInit();
        this.initEdit();
    }

    override ngAfterViewInit() {
        super.ngAfterViewInit();
        this.subscriptionHttpObservationDriving$ = this.httpObserve.drivingAirportStatus$.pipe(
            filter((x) => x || !x),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.hasOffer = true;
                    this.mapMetaFormControls(this.serviceForm);
                    this.httpObserve.setDrivingAirportStatus(false);
                }
                this.loadOfferResponse = false;
            })
        ).subscribe();
    }

    private initForm() {
        const invalidBHValidatorParams: InvalidBHValidatorParams = {
            service: this.datetimeService,
            format: DatetimeOption.FULL,
            startHour: 4,
            endHour: 12,
            isPickup: true
        };
        this.serviceForm = this.fb.group({
            service: new FormControl(''),
            airportMode: new FormControl('', Validators.required),
            originAddress: new FormControl(''),
            originDetails: new FormControl(''),
            destinationAddress: new FormControl(''),  
            destinationDetails: new FormControl(''),
            datetime: new FormControl('', [
                Validators.required,
                CustomValidators.priorityValidator([
                    CustomValidators.negativeCurrentDateTimeValidator(this.datetimeService),
                    CustomValidators.invalidBusinessHoursValidator(invalidBHValidatorParams)
                ])
            ]),
            pickupDATE: new FormControl(''),
            pickupTIME: new FormControl(''),
            distance: new FormControl(''),
            duration: new FormControl(''),
            price: new FormControl('')
        });
    }

    private initEdit() {
        this.initForm();
        this.serviceForm.patchValue({
            service: this.service,
            airportMode: null,
            originAddress: '',
            originDetails: null,
            destinationAddress: '',
            destinationDetails: null,
            datetime: '',
            pickupDATE: '',
            pickupTIME: '',
            distance: null,
            duration: null,
            price: null
        });
    }
    getDirectionRadioValue() {
        /**
         * $event = native DOM event !== value from FormControl
         * even property binding [value]="..." can result "on" (default radio value)
         * radio select changes FormControl val => (change) triggers process
         */
        this.transformAddressFields(this.serviceForm.get('airportMode')?.value);
    }

    private transformAddressFields(direction: AirportOptions) {
        if(direction === AirportOptions.ARRIVAL) {
            // Hidden part.
            this.serviceForm.get('originAddress')?.setValue('vie-schwechat');
            this.serviceForm.get('originAddress')?.setValidators(Validators.required);
            this.serviceForm.get('originAddress')?.updateValueAndValidity();
            this.serviceForm.get('originDetails')?.clearValidators();
            this.serviceForm.get('originDetails')?.setValue(null);
            this.serviceForm.get('originDetails')?.updateValueAndValidity();
            // Visual part.
            this.addressSubscription$ = new Subscription();
            this.serviceForm.get('destinationAddress')?.clearValidators();
            this.serviceForm.get('destinationAddress')?.setValidators(Validators.required);
            this.serviceForm.get('destinationAddress')?.setValue('');
            this.serviceForm.get('destinationAddress')?.markAsPristine();
            this.serviceForm.get('destinationAddress')?.markAsUntouched();
            // Prevent afresh trigger of valueChanges via emitEvent: false.
            this.serviceForm.get('destinationAddress')?.updateValueAndValidity({ onlySelf: true, emitEvent: false});
            this.addressSubscription$ = this.serviceForm.get('destinationDetails')?.valueChanges.subscribe((value) => {
                if(value && !value.zipCode) {
                    this.serviceForm.get('destinationAddress')?.setErrors({missingZipcode: true})
                }
            })
        } else if(direction === AirportOptions.DEPARTURE) {
            // Hidden part.
            this.serviceForm.get('destinationAddress')?.setValue('vie-schwechat');
            this.serviceForm.get('destinationAddress')?.setValidators(Validators.required);
            this.serviceForm.get('destinationAddress')?.updateValueAndValidity();
            this.serviceForm.get('destinationDetails')?.setValue(null);
            this.serviceForm.get('destinationDetails')?.clearValidators();
            // Visual part.
            this.addressSubscription$ = new Subscription();
            this.serviceForm.get('originAddress')?.clearValidators();
            this.serviceForm.get('originAddress')?.setValidators(Validators.required);
            this.serviceForm.get('originAddress')?.setValue('');
            this.serviceForm.get('originAddress')?.markAsPristine();
            this.serviceForm.get('originAddress')?.markAsUntouched();
            // Prevent afresh trigger of valueChanges via emitEvent: false.
            this.serviceForm.get('originAddress')?.updateValueAndValidity({ onlySelf: true, emitEvent: false}); 
            this.addressSubscription$ = this.serviceForm.get('originDetails')?.valueChanges.subscribe((value) => {
                if(value && !value.zipCode) {
                    this.serviceForm.get('originAddress')?.setErrors({missingZipcode: true});
                }
            })
        }
    }

    async onSubmitOffer() {
        this.serviceForm.markAllAsTouched();

        if(this.serviceForm.invalid) {
            if(this.serviceForm.get('airportMode')?.value === null) {
                this.serviceForm.get('originAddress')?.markAsUntouched();
                this.serviceForm.get('destinationAddress')?.markAsUntouched();
                this.serviceForm.get('datetime')?.markAsUntouched();
            }
            return;
        }

        this.configDateTimeData();
        this.drivingAPIService.setDataAirport(this.serviceForm.getRawValue());
        this.drivingAPIService.sendAirportRequest().subscribe(data => {
            this.addResponseRouteData2Form(data);
        })
        this.loadOfferResponse = true;

        await this.delay(100);
        this.scrollToTop();
    }

    configDateTimeData() {
        const datetime = this.serviceForm.get('datetime')?.value;
        this.serviceForm.get('pickupDATE')?.setValue(this.datetimeService.getDateFromTimestamp(datetime));
        this.serviceForm.get('pickupTIME')?.setValue(this.datetimeService.getTimeFromTimestamp(datetime));
        this.pickupTimeByLangStatic = this.datetimeService.getTimeFromLanguage(
            this.serviceForm.get('pickupTIME')?.value,
            this.translate.currentLang
        );
    }

    override ngOnDestroy() {
        super.ngOnDestroy();
        this.addressSubscription$?.unsubscribe();
    }
}