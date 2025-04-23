/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, Inject, OnInit } from "@angular/core";
import { filter, Subject, tap } from "rxjs";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ObservationService } from "../../../../shared/services/observation.service";
import { CommonModule, DOCUMENT } from "@angular/common";
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { SelectInputComponent } from "../../../../common/components/form-components/select-input/select-input.component";
import { TextareaInputComponent } from "../../../../common/components/form-components/textarea-input/textarea-input.component";
import { TextInputComponent } from "../../../../common/components/form-components/text-input/text-input.component";
import { CastAbstract2FormControlPipe } from "../../../../common/pipes/cast-abstract2form-control.pipe";
import { HttpObservationService } from "../../../../shared/services/http-observation.service";
import { DateTimeService } from "../../../../shared/services/datetime.service";
import * as CustomValidators from "../../../../common/helper/custom-validators";
import { CurrencyFormatPipe } from "../../../../common/pipes/currency-format.pipe";
import { DrivingAPIService } from "../../../../shared/services/driving-api.service";
import { MailAPIService } from "../../../../shared/services/mail-api.service";
import { Router } from "@angular/router";
import { VarDirective } from "../../../../common/directives/ng-var.directive";
import { AddressInputComponent } from "../../../../common/components/form-components/address-input/address-input.component";
import { AuthService } from "../../../../shared/services/auth.service";
import { TokenService } from "../../../../shared/services/token.service";
import { ServiceOptions } from "../../../../shared/enums/service-options.enum";
import { NavigationService } from "../../../../shared/services/navigation.service";
import { SnackbarMessageService } from "../../../../shared/services/snackbar.service";
import { MailTranslateService } from "../../../../shared/services/mail-translate.service";
import { BaseServiceComponent } from "../../../../common/components/base-service.component";

@Component({
    selector: 'tava-service-flatrate',
    templateUrl: './service-flatrate.component.html',
    styleUrl: './service-flatrate.component.scss',
    standalone: true,
    imports: [
        AddressInputComponent,
        CastAbstract2FormControlPipe,
        CommonModule,
        CurrencyFormatPipe,
        ReactiveFormsModule,
        SelectInputComponent,
        TextareaInputComponent,
        TextInputComponent,
        TranslateModule,
        VarDirective
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
                    this.addCustomerData2Form();
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
            datetimeEnd: new FormControl('', CustomValidators.requiredTenancyValidator()),
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
            service: 'flatrate',
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

    restrictDatePickerStart(today: boolean): string {
        if(today) {
            return this.datetimeService.getTodayStartingTimestamp(true);
        } else {
            return this.datetimeService.getTodayStartingTimestamp(false, this.serviceForm.get('datetimeStart')?.value);
        }
    }

    configDateTimeEnd($event: any) {
        const restrictDateTime = this.datetimeService.get24HoursRestrictionTimestamp($event);
        this.minTenancyStamp$.next(this.datetimeService.getTodayStartingTimestamp(false, $event));
        this.maxTenancyStamp$.next(restrictDateTime);
        this.serviceForm.get('datetimeEnd')?.clearValidators();
        this.serviceForm.get('datetimeEnd')?.setValidators([
            CustomValidators.requiredTenancyValidator(),
            CustomValidators.invalidZeroTenancyValidator(this.datetimeService, this.serviceForm.get('datetimeStart')?.value),
            CustomValidators.invalidTenancyLowerLimitValidator($event),
            CustomValidators.invalidTenancyUpperLimitValidator(restrictDateTime)
        ]);
        this.serviceForm.get('datetimeEnd')?.setValue('');
        this.serviceForm.get('datetimeEnd')?.markAsUntouched();
    }

    checkDateEqualDate(): boolean {
        return this.datetimeService.hasSameDate(
            this.serviceForm.get('datetimeStart')?.value,
            this.serviceForm.get('datetimeEnd')?.value
        )
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