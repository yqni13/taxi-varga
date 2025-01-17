/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { filter, Subject, Subscription, tap } from "rxjs";
import { ThemeOptions } from "../../../../shared/enums/theme-options.enum";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ObservationService } from "../../../../shared/services/observation.service";
import { CommonModule, DOCUMENT } from "@angular/common";
import { TextInputComponent } from "../../../../common/components/form-components/text-input/text-input.component";
import { CastAbstract2FormControlPipe } from "../../../../common/pipes/cast-abstract2form-control.pipe";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CurrencyFormatPipe } from "../../../../common/pipes/currency-format.pipe";
import { SelectInputComponent } from "../../../../common/components/form-components/select-input/select-input.component";
import { TextareaInputComponent } from "../../../../common/components/form-components/textarea-input/textarea-input.component";
import { DateTimeService } from "../../../../shared/services/datetime.service";
import { HttpObservationService } from '../../../../shared/services/http-observation.service';
import { DrivingAPIService } from "../../../../shared/services/driving-api.service";
import { DistanceFormatPipe } from "../../../../common/pipes/distance-format.pipe";
import { DurationFormatPipe } from "../../../../common/pipes/duration-format.pipe";
import { VarDirective } from "../../../../common/directives/ng-var.directive";
import * as CustomValidators from "../../../../common/helper/custom-validators";
import { MailAPIService } from "../../../../shared/services/mail-api.service";
import { Router } from "@angular/router";

@Component({
    selector: 'tava-service-destination',
    templateUrl: './service-destination.component.html',
    styleUrl: './service-destination.component.scss',
    standalone: true,
    imports: [
        CastAbstract2FormControlPipe,
        CurrencyFormatPipe,
        CommonModule,
        DistanceFormatPipe,
        DurationFormatPipe,
        ReactiveFormsModule,
        SelectInputComponent,
        TextareaInputComponent,
        TextInputComponent,
        TranslateModule,
        VarDirective
    ]
})
export class ServiceDestinationComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('originSearchInput', {static: true}) originSearchInput!: ElementRef;

    protected selectedBg: string;
    protected hasOffer: boolean;
    protected hasOrder: boolean;
    protected hasConfirmed: boolean;
    protected pickupTimeByLang$: Subject<string>;
    protected pickupTimeByLangStatic: string;

    protected serviceForm: FormGroup;
    protected customer: string;
    protected termCancellation: boolean;
    protected termSurchargeParking: boolean;
    protected termSurchargeFuel: boolean;
    protected loadOfferResponse: boolean;
    protected loadOrderResponse: boolean;

    private subscriptionThemeObservation$: Subscription;
    private subscriptionLangObservation$: Subscription;
    private subscriptionHttpObservationDriving$: Subscription;
    private subscriptionHttpObservationEmail$: Subscription;
    private window: any;
    private scrollAnchor!: HTMLElement;
    private delay: any;
    private customerData: string[];

    constructor(
        private readonly fb: FormBuilder,
        private readonly elRef: ElementRef,
        private readonly router: Router,
        private readonly translate: TranslateService,
        private readonly mailAPIService: MailAPIService,
        private readonly observation: ObservationService,
        private readonly drivingAPIService: DrivingAPIService,
        private readonly datetimeService: DateTimeService,
        private httpObservationService: HttpObservationService,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.selectedBg = '';
        this.hasOffer = false;
        this.hasOrder = false;
        this.hasConfirmed = false;
        this.pickupTimeByLang$ = new Subject<string>();
        this.pickupTimeByLangStatic = '';
        
        this.serviceForm = new FormGroup({});
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

        this.initEdit();
        this.scrollAnchor = this.elRef.nativeElement.querySelector(".tava-service-destination");
        // this.googlePlacesAutocomplete();
    }

    ngAfterViewInit() {
        this.subscriptionHttpObservationDriving$ = this.httpObservationService.drivingDestinationStatus$.pipe(
            filter((x) => x || !x),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.hasOffer = true;
                    this.addCustomerData2Form();
                    this.httpObservationService.setDrivingDestinationStatus(false);
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
    }

    private initForm() {
        this.serviceForm = this.fb.group({
            service: new FormControl(''),
            originAddress: new FormControl('', Validators.required),
            destinationAddress: new FormControl('', Validators.required),            
            back2home: new FormControl(''),
            datetime: new FormControl('', Validators.required),
            latency: new FormControl('', CustomValidators.maxLatencyValidator(this.datetimeService)),
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
            service: 'destination',
            originAddress: '',
            destinationAddress: '',
            back2home: false,
            latency: '00:00',
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

    getBack2HomeCheckboxValue(event: any) {
        this.serviceForm.get('back2home')?.setValue(event.target?.checked);
        if(!event.target?.checked) {
            this.serviceForm.get('latency')?.setValue('00:00');
        }
    }

    getTermsCheckboxValue(event: any) {
        this.termCancellation = event.target?.checked;
    }

    getSurchargeFuelCheckboxValue(event: any) {
        this.termSurchargeFuel = event.target?.checked;
    }

    getSurchargeParkingCheckboxValue(event: any) {
        this.termSurchargeParking = event.target?.checked;
    }

    // googlePlacesAutocomplete() {
    //     if((this.window as any).google) {
    //         new google.maps.places.Autocomplete(
    //             this.originSearchInput.nativeElement
    //         );
    //     } else {
    //         console.error('Google Maps API failed to load.');
    //     }
    // }

    async onSubmitOffer() {
        this.serviceForm.markAllAsTouched();

        if(this.serviceForm.invalid) {
            return;
        }

        this.configDateTimeData();
        this.drivingAPIService.setDataDestination(this.serviceForm.getRawValue());
        this.drivingAPIService.sendDestinationRequest().subscribe(data => {
            this.addResponseRouteData2Form(data);
        });
        this.loadOfferResponse = true;
        await this.delay(100);
        this.scrollToTop();
    }

    addResponseRouteData2Form(response: any) {
        this.serviceForm.get('price')?.setValue(response.body?.body.routeData.price);
        this.serviceForm.get('duration')?.setValue(response.body?.body.routeData.time);
        this.serviceForm.get('distance')?.setValue(response.body?.body.routeData.distance);
    }

    configDateTimeData() {
        const datetime = this.serviceForm.get('datetime')?.value;
        this.serviceForm.get('pickupDATE')?.setValue(this.datetimeService.getDateFromTimestamp(datetime));
        this.serviceForm.get('pickupTIME')?.setValue(this.datetimeService.getTimeFromTimestamp(datetime));
        this.serviceForm.get('latency')?.setValue(
            this.datetimeService.getRoundUpTime30MinSteps(this.serviceForm.get('latency')?.value, false)
        );
        
        this.pickupTimeByLangStatic = this.datetimeService.getTimeFromLanguage(
            this.serviceForm.get('pickupTIME')?.value,
            this.translate.currentLang
        );
    }

    configPickupTimeByLanguage(lang: string) {
        const time = this.serviceForm.get('pickupTIME')?.value;
        if(time === '') {
            return;
        }

        this.pickupTimeByLang$.next(this.datetimeService.getTimeFromLanguage(time, lang));
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
        this.termSurchargeFuel = false;
        this.loadOfferResponse = false;
        this.loadOrderResponse = false;
        this.hasOrder = false;
    }

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
        this.subscriptionLangObservation$.unsubscribe();
        this.subscriptionHttpObservationDriving$.unsubscribe();
        this.subscriptionHttpObservationEmail$.unsubscribe();
    }
}