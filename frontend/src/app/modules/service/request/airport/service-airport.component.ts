/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit } from "@angular/core";
import { filter, Subject, Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../../../shared/enums/theme-options.enum";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ObservationService } from "../../../../shared/services/observation.service";
import { CommonModule, DOCUMENT } from "@angular/common";
import { CastAbstract2FormControlPipe } from "../../../../common/pipes/cast-abstract2form-control.pipe";
import { CurrencyFormatPipe } from "../../../../common/pipes/currency-format.pipe";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { SelectInputComponent } from "../../../../common/components/form-components/select-input/select-input.component";
import { TextareaInputComponent } from "../../../../common/components/form-components/textarea-input/textarea-input.component";
import { DrivingAPIService } from "../../../../shared/services/driving-api.service";
import { DateTimeService } from "../../../../shared/services/datetime.service";
import { HttpObservationService } from "../../../../shared/services/http-observation.service";
import { TextInputComponent } from "../../../../common/components/form-components/text-input/text-input.component";
import { DistanceFormatPipe } from "../../../../common/pipes/distance-format.pipe";
import { VarDirective } from "../../../../common/directives/ng-var.directive";
import * as CustomValidators from "../../../../common/helper/custom-validators";
import { MailAPIService } from "../../../../shared/services/mail-api.service";
import { Router } from "@angular/router";
import { AddressInputComponent } from "../../../../common/components/form-components/address-input/address-input.component";
import { AddressOptions } from "../../../../shared/enums/address-options.enum";
import { AuthService } from "../../../../shared/services/auth.service";
import { ServiceOptions } from "../../../../shared/enums/service-options.enum";
import { TokenService } from "../../../../shared/services/token.service";
import { NavigationService } from "../../../../shared/services/navigation.service";
import { SnackbarMessageService } from "../../../../shared/services/snackbar.service";
import { SnackbarOption } from "../../../../shared/enums/snackbar-options.enum";
import { MailTranslateService } from "../../../../shared/services/mail-translate.service";

@Component({
    selector: 'tava-service-airport',
    templateUrl: './service-airport.component.html',
    styleUrl: './service-airport.component.scss',
    standalone: true,
    imports: [
        AddressInputComponent,
        CastAbstract2FormControlPipe,
        CommonModule,
        CurrencyFormatPipe,
        DistanceFormatPipe,
        ReactiveFormsModule,
        SelectInputComponent,
        TextareaInputComponent,
        TextInputComponent,
        TranslateModule,
        VarDirective
    ]
})
export class ServiceAirportComponent implements OnInit, AfterViewInit, OnDestroy {

    protected addressOptions = AddressOptions;
    protected selectedBg: string;
    protected hasOffer: boolean;
    protected hasToken: boolean;
    protected hasOrder: boolean;
    protected hasConfirmed: boolean;
    protected pickupTimeByLang$: Subject<string>;
    protected pickupTimeByLangStatic: string;
    protected direction: string;

    protected serviceForm: FormGroup;
    protected customer: string;
    protected termCancellation: boolean;
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
        private readonly snackbar: SnackbarMessageService,
        private readonly mailTranslate: MailTranslateService,
        private readonly drivingAPIService: DrivingAPIService,
        private readonly datetimeService: DateTimeService,
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
        this.direction = '';
    
        this.serviceForm = new FormGroup({});
        this.customer = '';
        this.termCancellation = false;
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

    async ngOnInit() {
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
        })

        await this.auth.initSession(ServiceOptions.airport);
        this.auth.sendInitRequest().subscribe(response => {
            // avoid refreshing token after reload of webpage
            if(this.navigation.getPreviousUrl() !== 'UNAVAILABLE') {
                this.tokenService.setToken(response.body?.body.token);
            }
            this.snackbar.notify({
                title: this.translate.currentLang === 'de'
                    ? this.mailTranslate.getTranslationDE('modules.service.content.airport.info.title')
                    : this.mailTranslate.getTranslationEN('modules.service.content.airport.info.title'),
                text: this.translate.currentLang === 'de'
                    ? this.mailTranslate.getTranslationDE('modules.service.content.airport.info.text')
                    : this.mailTranslate.getTranslationEN('modules.service.content.airport.info.text'),
                autoClose: false,
                type: SnackbarOption.info
            })
            this.hasToken = true;
        });
        
        this.initEdit();
        this.scrollAnchor = this.elRef.nativeElement.querySelector(".tava-service-airport");
        
    }

    ngAfterViewInit() {
        this.subscriptionHttpObservationDriving$ = this.httpObservationService.drivingAirportStatus$.pipe(
            filter((x) => x || !x),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.hasOffer = true;
                    this.addCustomerData2Form();
                    this.httpObservationService.setDrivingAirportStatus(false);
                }
                this.loadOfferResponse = false;
            })
        ).subscribe();
        
        this.subscriptionHttpObservationEmail$ = this.httpObservationService.emailStatus$.pipe(
            // tap((status) => console.log('Before filter: ', status)),
            // HINT: BehaviorSubject(false) is ignored by !!x in filter
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
            airport: new FormControl('', Validators.required),
            originAddress: new FormControl(''),
            originDetails: new FormControl(''),
            destinationAddress: new FormControl(''),  
            destinationDetails: new FormControl(''),
            datetime: new FormControl('', [
                Validators.required,
                CustomValidators.invalidAirportTimeValidator(this.datetimeService),
                CustomValidators.negativeDateTimeValidator(this.datetimeService)
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
            service: 'airport',
            airport: '',
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

    scrollToTop() {
        if(this.scrollAnchor && this.document.scrollingElement !== null) {
            this.scrollAnchor.scrollTo(0,0);
            this.document.scrollingElement.scrollTop = 0;
        }
    }

    restrictDatePicker(): string {
        return this.datetimeService.getTodayStartingTimestamp(true);
    }

    getDirectionRadioValue(event: any) {
        this.direction = event.target?.value;
        this.configAddressFields(this.direction);
    }

    getTermsCheckboxValue(event: any) {
        this.termCancellation = event.target?.checked;
    }

    getAddressDetails(event: any, option: AddressOptions) {
        if(option === AddressOptions.origin) {
            this.serviceForm.get('originDetails')?.setValue(event);
        } else {
            this.serviceForm.get('destinationDetails')?.setValue(event);
        }
    }

    configPickupTimeByLanguage(lang: string) {
        const time = this.serviceForm.get('pickupTIME')?.value;
        if(time === '') {
            return;
        }

        this.pickupTimeByLang$.next(this.datetimeService.getTimeFromLanguage(time, lang));
    }

    configAddressFields(direction: string) {
        if(direction === 'arrival') {
            this.serviceForm.get('originAddress')?.setValue('vie-schwechat');
            this.serviceForm.get('destinationAddress')?.setValue('');
            this.serviceForm.get('destinationAddress')?.setValidators(Validators.required);
            this.serviceForm.get('destinationAddress')?.markAsUntouched();
        } else if(direction === 'departure') {
            this.serviceForm.get('destinationAddress')?.setValue('vie-schwechat');
            this.serviceForm.get('originAddress')?.setValue('');
            this.serviceForm.get('originAddress')?.setValidators(Validators.required);
            this.serviceForm.get('originAddress')?.markAsUntouched();
        }
    }

    async onSubmitOffer() {
        this.serviceForm.markAllAsTouched();

        if(this.serviceForm.invalid) {
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

    configDateTimeData() {
        const datetime = this.serviceForm.get('datetime')?.value;
        this.serviceForm.get('pickupDATE')?.setValue(this.datetimeService.getDateFromTimestamp(datetime));
        this.serviceForm.get('pickupTIME')?.setValue(this.datetimeService.getTimeFromTimestamp(datetime));
        this.pickupTimeByLangStatic = this.datetimeService.getTimeFromLanguage(
            this.serviceForm.get('pickupTIME')?.value,
            this.translate.currentLang
        );
    }

    addResponseRouteData2Form(response: any) {
        this.serviceForm.get('distance')?.setValue(response.body?.body.routeData.distance);
        this.serviceForm.get('duration')?.setValue(this.datetimeService.getTimeFromTotalMinutes(response.body?.body.routeData.duration));
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
        await this.mailAPIService.setMailData(this.serviceForm.getRawValue());
        this.mailAPIService.sendMail().subscribe(data => {
            console.log("response Email: ", data);
        })

        await this.delay(100);
        this.scrollToTop();
    }

    resetOrderStatus() {
        this.termCancellation = false;
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