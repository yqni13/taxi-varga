import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit } from "@angular/core";
import { filter, Subscription, tap } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { ObservationService } from "../../../../shared/services/observation.service";
import { DOCUMENT } from "@angular/common";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { DrivingAPIService } from "../../../../shared/services/driving-api.service";
import { DateTimeService } from "../../../../shared/services/datetime.service";
import { HttpObservationService } from "../../../../shared/services/http-observation.service";
import { DistanceFormatPipe } from "../../../../common/pipes/distance-format.pipe";
import * as CustomValidators from "../../../../common/helper/custom-validators";
import { MailAPIService } from "../../../../shared/services/mail-api.service";
import { Router } from "@angular/router";
import { AuthService } from "../../../../shared/services/auth.service";
import { ServiceOptions } from "../../../../shared/enums/service-options.enum";
import { TokenService } from "../../../../shared/services/token.service";
import { NavigationService } from "../../../../shared/services/navigation.service";
import { SnackbarMessageService } from "../../../../shared/services/snackbar.service";
import { MailTranslateService } from "../../../../shared/services/mail-translate.service";
import { BaseServiceComponent } from "../../../../common/components/base-service.component";
import { ServiceImportsModule } from "../../../../common/helper/service-imports.helper";
import { AirportOptions } from "../../../../shared/enums/airport-options.enum";
import { DatetimeOption } from "../../../../shared/enums/datetime-options.enum";

@Component({
    selector: 'tava-service-airport',
    templateUrl: './service-airport.component.html',
    styleUrls: [
        '../../service.component.scss',
        './service-airport.component.scss'
    ],
    standalone: true,
    imports: [
        DistanceFormatPipe,
        ...ServiceImportsModule
    ]
})
export class ServiceAirportComponent extends BaseServiceComponent implements OnInit, AfterViewInit, OnDestroy {

    protected directionOptions = AirportOptions;

    private addressSubscription$: Subscription | undefined;

    constructor(
        router: Router,
        fb: FormBuilder,
        auth: AuthService,
        elRef: ElementRef,
        tokenService: TokenService,
        observe: ObservationService,
        translate: TranslateService,
        navigation: NavigationService,
        mailAPIService: MailAPIService,
        snackbar: SnackbarMessageService,
        datetimeService: DateTimeService,
        mailTranslate: MailTranslateService,
        httpObserve: HttpObservationService,
        @Inject(DOCUMENT) document: Document,
        drivingAPIService: DrivingAPIService,
    ) {
        super(router, fb, auth, elRef, tokenService, translate, observe, navigation, mailAPIService, datetimeService, snackbar, mailTranslate, httpObserve, document, drivingAPIService);

        this.addressSubscription$ = new Subscription();
    }

    override async ngOnInit() {
        this.service = ServiceOptions.AIRPORT;
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
                    this.addMetaProperties2Form(this.serviceForm);
                    this.httpObserve.setDrivingAirportStatus(false);
                }
                this.loadOfferResponse = false;
            })
        ).subscribe();
    }

    private initForm() {
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
                    CustomValidators.invalidBusinessHoursValidator(this.datetimeService, DatetimeOption.FULL)
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