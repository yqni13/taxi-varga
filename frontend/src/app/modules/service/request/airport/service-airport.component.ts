/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit } from "@angular/core";
import { filter, Subscription, tap } from "rxjs";
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
import { DurationFormatPipe } from "../../../../common/pipes/duration-format.pipe";
import { VarDirective } from "../../../../common/directives/ng-var.directive";
import * as CustomValidators from "../../../../common/helper/custom-validators";
import { MailAPIService } from "../../../../shared/services/mail-api.service";
import { Router } from "@angular/router";

@Component({
    selector: 'tava-service-airport',
    templateUrl: './service-airport.component.html',
    styleUrl: './service-airport.component.scss',
    standalone: true,
    imports: [
        CastAbstract2FormControlPipe,
        CommonModule,
        CurrencyFormatPipe,
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
export class ServiceAirportComponent implements OnInit, AfterViewInit, OnDestroy {

    protected selectedBg: string;
    protected hasOffer: boolean;
    protected hasOrder: boolean;
    protected hasConfirmed: boolean;
    protected direction: string;

    protected serviceForm: FormGroup;
    protected customer: string;
    protected termsAcceptance: boolean;
    protected loadOfferResponse: boolean;
    protected loadOrderResponse: boolean;

    private subscriptionThemeObservation$: Subscription;
    private subscriptionHttpObservationDriving$: Subscription;
    private subscriptionHttpObservationEmail$: Subscription;
    private window: any;
    private scrollAnchor!: HTMLElement;
    private customerData: string[];
    private delay: any;

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
        this.direction = '';
    
        this.serviceForm = new FormGroup({});
        this.customer = '';
        this.termsAcceptance = false;
        this.loadOfferResponse = false;
        this.loadOrderResponse = false;
    
        this.subscriptionThemeObservation$ = new Subscription();
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

        this.initEdit();
        this.scrollAnchor = this.elRef.nativeElement.querySelector(".tava-service-flatrate");
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
            filter((x) => !!x),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.hasConfirmed = true;
                    this.httpObservationService.setEmailStatus(false);
                    this.router.navigate(['/service']);
                }
                this.loadOrderResponse = false;
            })
        ).subscribe();
    }

    private initForm() {
        this.serviceForm = this.fb.group({
            service: new FormControl(''),
            airport: new FormControl('', Validators.required),
            originAddress: new FormControl(''),
            destinationAddress: new FormControl(''),  
            datetime: new FormControl('', [
                Validators.required,
                CustomValidators.invalidAirportTimeValidator(this.datetimeService)
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
            destinationAddress: '',
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
        this.termsAcceptance = event.target?.checked;
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

    addResponseRouteData2Form(response: any) {
        const datetime = this.serviceForm.get('datetime')?.value;        
        this.serviceForm.get('distance')?.setValue(response.body?.body.routeData.distance);
        this.serviceForm.get('duration')?.setValue(this.datetimeService.getTimeFromTotalMinutes(response.body?.body.routeData.duration));
        this.serviceForm.get('price')?.setValue(response.body?.body.routeData.price);
        this.serviceForm.get('pickupDATE')?.setValue(this.datetimeService.getDateFromTimestamp(datetime));
        this.serviceForm.get('pickupTIME')?.setValue(this.datetimeService.getTimeFromTimestamp(datetime));
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
        if(!this.termsAcceptance) {
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

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
        this.subscriptionHttpObservationDriving$.unsubscribe();
        this.subscriptionHttpObservationEmail$.unsubscribe();
    }
}