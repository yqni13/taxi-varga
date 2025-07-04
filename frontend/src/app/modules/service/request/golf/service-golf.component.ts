/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, Inject, OnInit } from "@angular/core";
import { BaseServiceComponent } from "../../../../common/components/base-service.component";
import { ServiceImportsModule } from "../../../../common/helper/service-imports.helper";
import { Router } from "@angular/router";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../../../../shared/services/auth.service";
import { TokenService } from "../../../../shared/services/token.service";
import { ObservationService } from "../../../../shared/services/observation.service";
import { TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../../shared/services/navigation.service";
import { MailAPIService } from "../../../../shared/services/mail-api.service";
import { SnackbarMessageService } from "../../../../shared/services/snackbar.service";
import { DateTimeService } from "../../../../shared/services/datetime.service";
import { MailTranslateService } from "../../../../shared/services/mail-translate.service";
import { HttpObservationService } from "../../../../shared/services/http-observation.service";
import { DOCUMENT } from "@angular/common";
import { DrivingAPIService } from "../../../../shared/services/driving-api.service";
import { ServiceOptions } from "../../../../shared/enums/service-options.enum";
import { filter, Subject, tap } from "rxjs";
import * as CustomValidators from "../../../../common/helper/custom-validators";
import { SelectInputComponent } from "../../../../common/components/form-components/select-input/select-input.component";
import { PassengerOptions } from "../../../../shared/enums/passenger-options.enum";
import { GolfSupportOptions } from "../../../../shared/enums/golf-support-options.enum";
import { DistanceFormatPipe } from "../../../../common/pipes/distance-format.pipe";
import { AddressFilterOptions } from "../../../../shared/enums/addressfilter-options.enum";

@Component({
    selector: 'tava-service-golf',
    templateUrl: './service-golf.component.html',
    styleUrls: [
        '../../service.component.scss',
        './service-golf.component.scss'
    ],
    standalone: true,
    imports: [
        DistanceFormatPipe,
        SelectInputComponent,
        ...ServiceImportsModule
    ]
})
export class ServiceGolfComponent extends BaseServiceComponent implements OnInit, AfterViewInit {

    protected AddressFilterOptionsEnum = AddressFilterOptions;
    protected PassengerOptionsEnum = PassengerOptions;
    protected GolfSupportOptionsEnum = GolfSupportOptions;
    protected dropoffTimeByLang$: Subject<string>;
    protected dropoffTimeByLangStatic: string;
    protected minStayStamp$: Subject<string>;
    protected maxStayStamp$: Subject<string>;

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

        this.dropoffTimeByLang$ = new Subject<string>();
        this.dropoffTimeByLangStatic = '';
        this.minStayStamp$ = new Subject<string>();
        this.maxStayStamp$ = new Subject<string>();
    }

    override async ngOnInit() {
        this.service = ServiceOptions.GOLF;
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
                    this.addMetaProperties2Form(this.serviceForm);
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
            return: new FormControl(null),
            datetimeStart: new FormControl('', [
                Validators.required,
                CustomValidators.priorityValidator([
                    CustomValidators.negativeCurrentDateTimeValidator(this.datetimeService),
                    CustomValidators.invalidBusinessHoursValidator(this.datetimeService)
                ])
            ]),
            datetimeEnd: new FormControl(''),
            passengers: new FormControl('', Validators.required),
            stay: new FormControl(''),
            supportMode: new FormControl('', Validators.required),
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
            return: true,
            passengers: '',
            stay: null,
            supportMode: null,
            datetimeStart: '',
            datetimeEnd: '',
            pickupDATE: '',
            pickupTIME: '',
            dropOffDATE: '',
            dropOffTIME: '',
            distance: null,
            duration: null,
            price: null
        });
    }

    getOrigin4ReturnAddress() {
        this.serviceForm.get('destinationAddress')?.setValue(this.serviceForm.get('originAddress')?.value);
        this.serviceForm.get('destinationDetails')?.setValue(this.serviceForm.get('originDetails')?.value);
    }

    getReturnCheckboxValue(event: any) {
        this.serviceForm.get('return')?.setValue(event.target?.checked);
        if(event.target?.checked) {
            this.configReturnAddress(true)
        } else {
            this.configReturnAddress(false);
        }
    }

    configReturnAddress(isOrigin: boolean) {
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

    configSupportModeOnPassengers() {
        if(this.serviceForm.get('passengers')?.value === PassengerOptions.PPL3 &&
        this.serviceForm.get('supportMode')?.value === GolfSupportOptions.PLAYER) {
            this.serviceForm.get('supportMode')?.reset();
            this.serviceForm.get('supportMode')?.setValue(null);
            this.serviceForm.get('supportMode')?.addValidators(Validators.required);
        }
    }

    configDateTimeEnd($event: any) {
        const restrictDateTime = this.datetimeService.getRestrictionTimestampHoursBased($event, 72);
        this.minStayStamp$.next(this.datetimeService.getTodayStartingTimestamp(false, $event));
        this.maxStayStamp$.next(restrictDateTime);
        this.serviceForm.get('datetimeEnd')?.clearValidators();
        this.serviceForm.get('datetimeEnd')?.setValidators([
            CustomValidators.requiredTenancyValidator(),
            CustomValidators.negativeFixedDateTimeValidator(
                this.datetimeService,
                this.serviceForm.get('datetimeStart')?.value
            ),
            CustomValidators.invalidZeroTenancyValidator(this.datetimeService, this.serviceForm.get('datetimeStart')?.value),
            CustomValidators.invalidTenancyUpperLimitValidator(restrictDateTime, ServiceOptions.GOLF)
        ]);
        this.serviceForm.get('datetimeEnd')?.setValue('');
        this.serviceForm.get('datetimeEnd')?.markAsUntouched();
    }

    override addResponseRouteData2Form(response: any) {
        super.addResponseRouteData2Form(response);
        this.serviceForm.get('stay')?.setValue(
            this.datetimeService.getTimeFromTotalHours(response.body?.body.routeData.stay)
        );
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
        this.drivingAPIService.setDataGolf(this.serviceForm.getRawValue());
        this.drivingAPIService.sendGolfRequest().subscribe(data => {
            this.addResponseRouteData2Form(data);
        });
        this.loadOfferResponse = true;
        await this.delay(100);
        this.scrollToTop();
    }

    configDateTimeData() {
        this.serviceForm.get('stay')?.setValue(this.datetimeService.getTimeDifferenceAsString(
            this.serviceForm.get('datetimeStart')?.value,
            this.serviceForm.get('datetimeEnd')?.value,
            true
        ));
        
        this.serviceForm.get('pickupDATE')?.setValue(this.datetimeService.getDateFromTimestamp(
            this.serviceForm.get('datetimeStart')?.value
        ));
        this.serviceForm.get('pickupTIME')?.setValue(this.datetimeService.getTimeFromTimestamp(
            this.serviceForm.get('datetimeStart')?.value
        ));
        this.serviceForm.get('dropOffDATE')?.setValue(this.datetimeService.getDateFromTimestamp(
            this.serviceForm.get('datetimeEnd')?.value
        ));
        this.serviceForm.get('dropOffTIME')?.setValue(this.datetimeService.getTimeFromTimestamp(
            this.serviceForm.get('datetimeEnd')?.value
        ));

        this.pickupTimeByLangStatic = this.datetimeService.getTimeFromLanguage(
            this.serviceForm.get('pickupTIME')?.value,
            this.translate.currentLang
        );
        this.dropoffTimeByLangStatic = this.datetimeService.getTimeFromLanguage(
            this.serviceForm.get('dropOffTIME')?.value,
            this.translate.currentLang
        );
    }
}