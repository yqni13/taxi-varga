/* eslint-disable @typescript-eslint/no-explicit-any */
import { DOCUMENT } from "@angular/common";
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { filter, Subject, Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../shared/enums/theme-options.enum";
import { ObservationService } from "../../shared/services/observation.service";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { Router } from "@angular/router";
import { AuthService } from "../../shared/services/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { DateTimeService } from "../../shared/services/datetime.service";
import { ServiceOptions } from "../../shared/enums/service-options.enum";
import { SnackbarOption } from "../../shared/enums/snackbar-options.enum";
import { SnackbarMessageService } from "../../shared/services/snackbar.service";
import { NavigationService } from "../../shared/services/navigation.service";
import { TokenService } from "../../shared/services/token.service";
import { MailTranslateService } from "../../shared/services/mail-translate.service";
import { MailAPIService } from "../../shared/services/mail-api.service";
import { AddressOptions } from "../../shared/enums/address-options.enum";
import { DrivingAPIService } from "../../shared/services/driving-api.service";
import { BaseRoute } from "../../api/routes/base.route.enum";
import * as CustomValidators from "../helper/custom-validators";

/**
 * This is the base class for all 'service' modules.
 */

@Component({
    template: '',
    standalone: true
})
export class BaseServiceComponent implements OnInit, AfterViewInit, OnDestroy {

    protected addressOptions = AddressOptions;
    protected selectedBg: string;
    protected hasOffer: boolean;
    protected hasToken: boolean;
    protected hasOrder: boolean;
    protected hasConfirmed: boolean;
    protected pickupTimeByLang$: Subject<string>;
    protected pickupTimeByLangStatic: string;
    protected customer: string;
    protected metaProperties: string[];
    protected termCancellation: boolean;
    protected termSurchargeParking: boolean;
    protected termSurchargeFuel: boolean;
    protected loadOfferResponse: boolean;
    protected loadOrderResponse: boolean;
    protected serviceForm: FormGroup;
    protected metaForm: FormGroup;
    protected service!: ServiceOptions;
    protected subscriptionHttpObservationDriving$: Subscription;
    protected window: any;
    protected delay: any;
    
    private scrollAnchor!: HTMLElement;
    private subscriptionThemeObservation$: Subscription;
    private subscriptionLangObservation$: Subscription;
    private subscriptionHttpObservationEmail$: Subscription;
    private subscriptionHttpObservationError$: Subscription;

    constructor(
        protected router: Router,
        protected fb: FormBuilder,
        protected auth: AuthService,
        protected elRef: ElementRef,
        protected tokenService: TokenService,
        protected translate: TranslateService,
        protected observe: ObservationService,
        protected navigation: NavigationService,
        protected mailAPIService: MailAPIService,
        protected datetimeService: DateTimeService,
        protected snackbar: SnackbarMessageService,
        protected mailTranslate: MailTranslateService,
        protected httpObserve: HttpObservationService,
        @Inject(DOCUMENT) protected document: Document,
        protected drivingAPIService: DrivingAPIService,
    ) {
        this.selectedBg = '';
        this.hasOffer = false;
        this.hasToken = false;
        this.hasOrder = false;
        this.hasConfirmed = false;
        this.pickupTimeByLang$ = new Subject<string>();
        this.pickupTimeByLangStatic = '';

        this.serviceForm = new FormGroup({});
        this.metaForm = new FormGroup({});
        this.customer = '';
        this.termCancellation = false;
        this.termSurchargeParking = false;
        this.termSurchargeFuel = false;
        this.loadOfferResponse = false;
        this.loadOrderResponse = false;

        this.subscriptionThemeObservation$ = new Subscription();
        this.subscriptionLangObservation$ = new Subscription();
        this.subscriptionHttpObservationDriving$ = new Subscription();
        this.subscriptionHttpObservationEmail$ = new Subscription();
        this.subscriptionHttpObservationError$ = new Subscription();
        this.window = this.document.defaultView;
        this.metaProperties = [
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
        this.subscriptionThemeObservation$ = this.observe.themeOption$.pipe(
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

        await this.auth.initSession(this.service);
        this.auth.sendInitRequest().subscribe(response => {
            // avoid refreshing token after reload of webpage
            if(this.navigation.getPreviousUrl() !== 'UNAVAILABLE') {
                this.tokenService.setToken(response.body?.body.token);
                this.snackbar.notify({
                    title: this.translate.currentLang === 'de'
                        ? this.mailTranslate.getTranslationDE(`modules.service.content.${this.service}.info.title`)
                        : this.mailTranslate.getTranslationEN(`modules.service.content.${this.service}.info.title`),
                    text: this.translate.currentLang === 'de'
                        ? this.mailTranslate.getTranslationDE(`modules.service.content.${this.service}.info.text`)
                        : this.mailTranslate.getTranslationEN(`modules.service.content.${this.service}.info.text`),
                    autoClose: false,
                    type: SnackbarOption.INFO
                })
                this.hasToken = true;
            } else {
                // reroute to service overview on refresh
                this.router.navigate(['/service']);
                this.hasToken = false;
            }
        });

        this.addMetaProperties2Form(this.metaForm);
        this.scrollAnchor = this.elRef.nativeElement.querySelector(`.tava-service-${this.service}`);
    }

    ngAfterViewInit() {
        this.subscriptionHttpObservationEmail$ = this.httpObserve.emailStatus$.pipe(
            // tap((status) => console.log('Before filter: ', status)),
            // HINT: BehaviorSubject(false) is ignored by !!x in filter
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.hasConfirmed = true;
                    this.httpObserve.setEmailStatus(false);
                    this.router.navigate([`/${BaseRoute.SERVICE}`]);
                } else if(!isStatus200) {
                    this.resetOrderStatus();
                }
            })
        ).subscribe();

        this.subscriptionHttpObservationError$ = this.httpObserve.errorStatus$.pipe(
            filter((x) => x && this.auth.getExceptionStatusCodes().includes(x.status.toString())),
            tap((response: any) => {
                if(this.auth.getExceptionCollection().includes(response.error.headers.error)) {
                    this.httpObserve.setErrorStatus(null);
                    this.router.navigate([`/${BaseRoute.SERVICE}`]);
                }
            })
        ).subscribe();
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

    restrictDatePickerStart(today: boolean): string {
        // used for limited time range like service golf/flatrate
        if(today) {
            return this.datetimeService.getTodayStartingTimestamp(true);
        } else {
            return this.datetimeService.getTodayStartingTimestamp(false, this.serviceForm.get('datetimeStart')?.value);
        }
    }

    getTermsCheckboxValue(event: any) {
        this.termCancellation = event.target?.checked;
    }

    getSurchargeParkingCheckboxValue(event: any) {
        this.termSurchargeParking = event.target?.checked;
    }

    getSurchargeFuelCheckboxValue(event: any) {
        this.termSurchargeFuel = event.target?.checked;
    }

    configPickupTimeByLanguage(lang: string) {
        const time = this.serviceForm.get('pickupTIME')?.value;
        if(time === '') {
            return;
        }

        this.pickupTimeByLang$.next(this.datetimeService.getTimeFromLanguage(time, lang));
    }

    getAddressDetails(event: any, option: AddressOptions) {
        if(option === AddressOptions.ORIGIN) {
            this.serviceForm.get('originDetails')?.setValue(event);
        } else if(option === AddressOptions.GOLFCOURSE) {
            this.serviceForm.get('golfcourseDetails')?.setValue(event);
        }else {
            this.serviceForm.get('destinationDetails')?.setValue(event);
        }
    }

    addMetaProperties2Form(form: FormGroup) {
        Object.values(this.metaProperties).forEach((element) => {
            if(element === 'email') {
                form.addControl(element, new FormControl('', [Validators.required, Validators.email]));
            } else if(element === 'phone') {
                form.addControl(element, new FormControl('', 
                    [Validators.required, CustomValidators.phoneRegExValidator()]
                ));
            } else if(element !== 'title' && element !== 'note') {
                form.addControl(element, new FormControl('', Validators.required));
            } else {
                form.addControl(element, new FormControl(''))
            }
        })
    }

    addResponseRouteData2Form(response: any) {
        this.serviceForm.get('distance')?.setValue(response.body?.body.routeData.distance);
        this.serviceForm.get('duration')?.setValue(this.datetimeService.getTimeFromTotalMinutes(response.body?.body.routeData.duration));
        this.serviceForm.get('price')?.setValue(response.body?.body.routeData.price);
    }

    checkDateEqualDate(): boolean {
        return this.datetimeService.hasSameDate(
            this.serviceForm.get('datetimeStart')?.value,
            this.serviceForm.get('datetimeEnd')?.value
        )
    }

    async onSubmitOrder() {
        // process step #2: get meta (customer) data
        this.metaForm.markAllAsTouched();

        if(this.metaForm.invalid) {
            return;
        }

        this.hasOrder = true;
        this.addMetaData2ServiceForm();
        this.editFinalOrder();
        await this.delay(100);
        this.scrollToTop();
    }

    addMetaData2ServiceForm() {
        Object.values(this.metaProperties).forEach((element) => {
            this.serviceForm.get(element)?.setValue(this.metaForm.get(element)?.value);
        })
    }

    editFinalOrder() {
        const title = this.serviceForm.get('title')?.value !== ''
            ? this.serviceForm.get('title')?.value + ' '
            : ''
        this.customer = ` ${title}${this.serviceForm.get('firstName')?.value} ${this.serviceForm.get('lastName')?.value}`;
    }

    async submitOrder() {
        // process step #3: send final order
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