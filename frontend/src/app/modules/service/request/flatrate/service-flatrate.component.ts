/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, Inject, OnInit } from "@angular/core";
import { filter, Subject, tap } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { ObservationService } from "../../../../shared/services/observation.service";
import { DOCUMENT } from "@angular/common";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { HttpObservationService } from "../../../../shared/services/http-observation.service";
import { DateTimeService } from "../../../../shared/services/datetime.service";
import * as CustomValidators from "../../../../common/helper/custom-validators";
import { DrivingAPIService } from "../../../../shared/services/driving-api.service";
import { MailAPIService } from "../../../../shared/services/mail-api.service";
import { Router } from "@angular/router";
import { AuthService } from "../../../../shared/services/auth.service";
import { TokenService } from "../../../../shared/services/token.service";
import { ServiceOptions } from "../../../../shared/enums/service-options.enum";
import { NavigationService } from "../../../../shared/services/navigation.service";
import { SnackbarMessageService } from "../../../../shared/services/snackbar.service";
import { MailTranslateService } from "../../../../shared/services/mail-translate.service";
import { BaseServiceComponent } from "../../../../common/components/base-service.component";
import { ServiceImportsModule } from "../../../../common/helper/service-imports.helper";

@Component({
    selector: 'tava-service-flatrate',
    templateUrl: './service-flatrate.component.html',
    styleUrls: [
        '../../service.component.scss',
        './service-flatrate.component.scss'
    ],
    standalone: true,
    imports: [
        ...ServiceImportsModule
    ]
})
export class ServiceFlatrateComponent extends BaseServiceComponent implements OnInit, AfterViewInit {

    protected dropoffTimeByLang$: Subject<string>;
    protected dropoffTimeByLangStatic: string;
    protected minTenancyStamp$: Subject<string>;
    protected maxTenancyStamp$: Subject<string>;

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
        super(router, fb, auth, elRef, tokenService, translate, observe, navigation, mailAPIService, datetimeService, snackbar, mailTranslate, httpObserve, document, drivingAPIService)

        this.dropoffTimeByLang$ = new Subject<string>();
        this.dropoffTimeByLangStatic = '';
        this.minTenancyStamp$ = new Subject<string>();
        this.maxTenancyStamp$ = new Subject<string>();
    }

    override async ngOnInit() {
        this.service = ServiceOptions.FLATRATE;
        super.ngOnInit();
        this.initEdit();
    }

    override ngAfterViewInit() {
        super.ngAfterViewInit();
        this.subscriptionHttpObservationDriving$ = this.httpObserve.drivingFlatrateStatus$.pipe(
            filter((x) => x || !x),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.hasOffer = true;
                    this.addMetaProperties2Form(this.serviceForm);
                    this.httpObserve.setDrivingFlatrateStatus(false);
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
            destinationAddress: new FormControl('', Validators.required),
            destinationDetails: new FormControl(''),
            tenancy: new FormControl(''),
            datetimeStart: new FormControl('', [
                Validators.required,
                CustomValidators.negativeDateTimeValidator(this.datetimeService)
            ]),
            datetimeEnd: new FormControl(''),
            pickupDATE: new FormControl(''),
            pickupTIME: new FormControl(''),
            dropOffDATE: new FormControl(''),
            dropOffTIME: new FormControl(''),
            price: new FormControl(''),
        });
    }

    private initEdit() {
        this.initForm();
        this.serviceForm.patchValue({
            service: this.service,
            originAddress: '',
            originDetails: null,
            destinationAddress: '',
            destinationDetails: null,
            tenancy: null,
            datetimeStart: '',
            datetimeEnd: '',
            pickupDATE: '',
            pickupTIME: '',
            dropOffDATE: '',
            dropOffTIME: '',
            price: null
        })
    }

    configDateTimeEnd($event: any) {
        const restrictDateTime = this.datetimeService.getRestrictionTimestampHoursBased($event, 24);
        this.minTenancyStamp$.next(this.datetimeService.getTodayStartingTimestamp(false, $event));
        this.maxTenancyStamp$.next(restrictDateTime);
        this.serviceForm.get('datetimeEnd')?.clearValidators();
        this.serviceForm.get('datetimeEnd')?.setValidators([
            CustomValidators.requiredTenancyValidator(),
            CustomValidators.priorityValidator([
                CustomValidators.negativeDateTimeEndValidator(
                    this.datetimeService,
                    this.serviceForm.get('datetimeStart')?.value
                ),
                CustomValidators.invalidZeroTenancyValidator(
                    this.datetimeService,
                    this.serviceForm.get('datetimeStart')?.value
                ),
                CustomValidators.invalidTenancyLowerLimitValidator($event),
            ]),
            CustomValidators.invalidTenancyUpperLimitValidator(restrictDateTime, ServiceOptions.FLATRATE)
        ]);
        this.serviceForm.get('datetimeEnd')?.setValue('');
        this.serviceForm.get('datetimeEnd')?.markAsUntouched();
    }

    async onSubmitOffer() {
        this.serviceForm.markAllAsTouched();

        if(this.serviceForm.invalid) {
            return;
        }

        this.configDateTimeData();
        this.drivingAPIService.setDataFlatrate(this.serviceForm.getRawValue());
        this.drivingAPIService.sendFlatrateRequest().subscribe(data => {
            this.addResponseRouteData2Form(data);
        })
        this.loadOfferResponse = true;
        await this.delay(100);
        this.scrollToTop();
    }

    configDateTimeData() {
        this.serviceForm.get('tenancy')?.setValue(this.datetimeService.getTimeDifferenceAsString(
            this.serviceForm.get('datetimeStart')?.value,
            this.serviceForm.get('datetimeEnd')?.value
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

    override configPickupTimeByLanguage(lang: string) {
        const time = this.serviceForm.get('pickupTIME')?.value;
        if(time === '') {
            return;
        }

        this.pickupTimeByLang$.next(this.datetimeService.getTimeFromLanguage(time, lang));
        this.dropoffTimeByLang$.next(this.datetimeService.getTimeFromLanguage(time, lang));
    }

    override addResponseRouteData2Form(response: any) {
        this.serviceForm.get('price')?.setValue(response.body?.body.routeData.price);
    }

    override resetOrderStatus() {
        super.resetOrderStatus();
        this.termSurchargeParking = false;
    }
}