/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit } from "@angular/core";
import { filter, Subject, Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../../../shared/enums/theme-options.enum";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ObservationService } from "../../../../shared/services/observation.service";
import { CommonModule, DOCUMENT } from "@angular/common";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
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
import { AddressOptions } from "../../../../shared/enums/address-options.enum";
import { AddressInputComponent } from "../../../../common/components/form-components/address-input/address-input.component";
import { AuthService } from "../../../../shared/services/auth.service";
import { TokenService } from "../../../../shared/services/token.service";
import { ServiceOptions } from "../../../../shared/enums/service-options.enum";
import { NavigationService } from "../../../../shared/services/navigation.service";

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
export class ServiceFlatrateComponent implements OnInit, AfterViewInit, OnDestroy {

    protected addressOptions = AddressOptions;
    protected selectedBg: string;
    protected hasOffer: boolean;
    protected hasToken: boolean;
    protected hasOrder: boolean;
    protected hasConfirmed: boolean;
    protected pickupTimeByLang$: Subject<string>;
    protected dropoffTimeByLang$: Subject<string>;
    protected pickupTimeByLangStatic: string;
    protected dropoffTimeByLangStatic: string;

    protected serviceForm: FormGroup;
    protected minTenancyStamp$: Subject<string>;
    protected maxTenancyStamp$: Subject<string>;
    protected customer: string;
    protected termCancellation: boolean;
    protected termSurchargeParking: boolean;
    protected loadOfferResponse: boolean;
    protected loadOrderResponse: boolean;

    private subscriptionThemeObservation$: Subscription;
    private subscriptionLangObservation$: Subscription;
    private subscriptionHttpObservationDriving$: Subscription;
    private subscriptionHttpObservationEmail$: Subscription;
    private subscriptionHttpObservationError$: Subscription;

    private window: any;
    private scrollAnchor!: HTMLElement;
    private customerData: string[];
    private delay: any;

    constructor(
        private readonly fb: FormBuilder,
        private readonly auth: AuthService,
        private readonly elRef: ElementRef,
        private readonly router: Router,
        private readonly tokenService: TokenService,
        private readonly translate: TranslateService,
        private readonly navigation: NavigationService,
        private readonly mailAPIService: MailAPIService,
        private readonly observation: ObservationService,
        private readonly datetimeService: DateTimeService,
        private readonly drivingAPIService: DrivingAPIService,
        private httpObservationService: HttpObservationService,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.selectedBg = '';
        this.hasOffer = false;
        this.hasToken = false;
        this.hasOrder = false;
        this.hasConfirmed = false;
        this.pickupTimeByLang$ = new Subject<string>();
        this.pickupTimeByLangStatic = '';
        this.dropoffTimeByLang$ = new Subject<string>();
        this.dropoffTimeByLangStatic = '';

        this.serviceForm = new FormGroup({});
        this.minTenancyStamp$ = new Subject<string>();
        this.maxTenancyStamp$ = new Subject<string>();
        this.customer = '';
        this.termCancellation = false;
        this.termSurchargeParking = false;
        this.loadOfferResponse = false;
        this.loadOrderResponse = false;
    
        this.subscriptionThemeObservation$ = new Subscription();
        this.subscriptionLangObservation$ = new Subscription();
        this.subscriptionHttpObservationDriving$ = new Subscription();
        this.subscriptionHttpObservationEmail$ = new Subscription();
        this.subscriptionHttpObservationError$ = new Subscription();
        this.window = this.document.defaultView;
        this.customerData = [
            'gender',
            'title',
            'firstName',
            'lastName',
            'phone',
            'email',
            'note'
        ];
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    ngOnInit() {
        this.subscriptionThemeObservation$ = this.observation.themeOption$.pipe(
            tap((theme: ThemeOptions) => {
                switch(theme) {
                    case(ThemeOptions.lightMode): {
                        this.selectedBg = 'bg-pattern-light';
                        break;
                    }
                    case(ThemeOptions.darkMode):
                    default: {
                        this.selectedBg = 'bg-pattern-dark';
                    }
                }
            })
        ).subscribe();

        this.subscriptionLangObservation$ = this.translate.onLangChange.subscribe((val) => {
            this.configPickupTimeByLanguage(val.lang);
        });

        this.auth.initSession(ServiceOptions.flatrate);
        this.auth.sendInitRequest().subscribe(response => {
            // avoid refreshing token after reload of webpage
            if(this.navigation.getPreviousUrl() !== 'UNAVAILABLE') {
                this.tokenService.setToken(response.body?.body.token);
            }
            this.hasToken = true;
        });

        this.initEdit();
        this.scrollAnchor = this.elRef.nativeElement.querySelector(".tava-service-flatrate");
    }

    ngAfterViewInit() {
        this.subscriptionHttpObservationDriving$ = this.httpObservationService.drivingFlatrateStatus$.pipe(
            filter((x) => x || !x),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.hasOffer = true;
                    this.addCustomerData2Form();
                    this.httpObservationService.setDrivingFlatrateStatus(false);
                }
                this.loadOfferResponse = false;
            })
        ).subscribe();

        this.subscriptionHttpObservationEmail$ = this.httpObservationService.emailStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.hasConfirmed = true;
                    this.httpObservationService.setEmailStatus(false);
                    this.router.navigate(['/service']);
                } else if(!isStatus200) {
                    this.resetOrderStatus();
                }
            })
        ).subscribe();

        this.subscriptionHttpObservationError$ = this.httpObservationService.errorStatus$.pipe(
            filter((x) => x && this.auth.getExceptionStatusCodes().includes(x.status.toString())),
            tap((response: any) => {
                if(this.auth.getExceptionCollection().includes(response.error.headers.error)) {
                    this.httpObservationService.setErrorStatus(null);
                    this.router.navigate(['/service']);
                }
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

    scrollToTop() {
        if(this.scrollAnchor && this.document.scrollingElement !== null) {
            this.scrollAnchor.scrollTo(0,0);
            this.document.scrollingElement.scrollTop = 0;
        }
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

    getTermsCheckboxValue(event: any) {
        this.termCancellation = event.target?.checked;
    }

    getSurchargeParkingCheckboxValue(event: any) {
        this.termSurchargeParking = event.target?.checked;
    }

    getAddressDetails(event: any, option: AddressOptions) {
            if(option === AddressOptions.origin) {
                this.serviceForm.get('originDetails')?.setValue(event);
            } else {
                this.serviceForm.get('destinationDetails')?.setValue(event);
            }
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

    configPickupTimeByLanguage(lang: string) {
        const time = this.serviceForm.get('pickupTIME')?.value;
        if(time === '') {
            return;
        }

        this.pickupTimeByLang$.next(this.datetimeService.getTimeFromLanguage(time, lang));
        this.dropoffTimeByLang$.next(this.datetimeService.getTimeFromLanguage(time, lang));
    }

    addCustomerData2Form() {
        Object.values(this.customerData).forEach((element) => {
            if(element === 'email') {
                this.serviceForm.addControl(element, new FormControl('', [Validators.required, Validators.email]));
            } else if(element !== 'title' && element !== 'note') {
                this.serviceForm.addControl(element, new FormControl('', Validators.required));
            } else {
                this.serviceForm.addControl(element, new FormControl(''))
            }
        })
    }

    addResponseRouteData2Form(response: any) {
        this.serviceForm.get('price')?.setValue(response.body?.body.routeData.price);
    
    }

    async onSubmitOrder() {
        this.serviceForm.markAllAsTouched();

        if(this.serviceForm.invalid) {
            return;
        }

        this.hasOrder = true;
        this.editFinalOrder();
        await this.delay(100);
        this.scrollToTop();
    }

    editFinalOrder() {
        const title = this.serviceForm.get('title')?.value !== ''
            ? this.serviceForm.get('title')?.value + ' '
            : ''
        this.customer = ` ${title}${this.serviceForm.get('firstName')?.value} ${this.serviceForm.get('lastName')?.value}`;
    }

    async submitOrder() {
        if(!this.termCancellation) {
            return;
        }

        this.loadOrderResponse = true;
        this.mailAPIService.setMailData(this.serviceForm.getRawValue());
        this.mailAPIService.sendMail().subscribe(data => {
            console.log("response Email: ", data);
        })

        await this.delay(100);
        this.scrollToTop();
    }

    resetOrderStatus() {
        this.termCancellation = false;
        this.termSurchargeParking = false;
        this.loadOrderResponse = false;
        this.loadOfferResponse = false;
        this.hasOrder = false;
    }

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
        this.subscriptionLangObservation$.unsubscribe();
        this.subscriptionHttpObservationDriving$.unsubscribe();
        this.subscriptionHttpObservationEmail$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}