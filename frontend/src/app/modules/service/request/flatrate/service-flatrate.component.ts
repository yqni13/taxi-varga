/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { Subscription, tap } from "rxjs";
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

@Component({
    selector: 'tava-service-flatrate',
    templateUrl: './service-flatrate.component.html',
    styleUrl: './service-flatrate.component.scss',
    standalone: true,
    imports: [
        CastAbstract2FormControlPipe,
        CommonModule,
        CurrencyFormatPipe,
        ReactiveFormsModule,
        SelectInputComponent,
        TextareaInputComponent,
        TextInputComponent,
        TranslateModule
    ]
})
export class ServiceFlatrateComponent implements OnInit, OnDestroy {

    protected selectedBg: string;
    protected hasOffer: boolean;
    protected hasOrder: boolean;
    protected hasConfirmed: boolean;

    protected serviceForm: FormGroup;
    protected maxTenancyStamp: string;
    protected customer: string;
    protected termsAcceptance: boolean;
    protected surchargeParkingAcceptance: boolean;
    protected loadOfferResponse: boolean;
    protected loadOrderResponse: boolean;

    private subscriptionThemeObservation$: Subscription;
    private subscriptionHttpObservationEmail$: Subscription;

    private window: any;
    private customerData: string[];

    constructor(
        private readonly fb: FormBuilder,
        private readonly translate: TranslateService,
        private readonly observation: ObservationService,
        private readonly datetimeService: DateTimeService,
        private httpObservationService: HttpObservationService,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.selectedBg = '';
        this.hasOffer = false;
        this.hasOrder = false;
        this.hasConfirmed = false;

        this.serviceForm = new FormGroup({});
        this.maxTenancyStamp = '';
        this.customer = '';
        this.termsAcceptance = false;
        this.surchargeParkingAcceptance = false;
        this.loadOfferResponse = false;
        this.loadOrderResponse = false;
    
        this.subscriptionThemeObservation$ = new Subscription();
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
    }

    private initForm() {
        this.serviceForm = this.fb.group({
            originAddress: new FormControl('', Validators.required),
            destinationAddress: new FormControl('', Validators.required),
            tenancy: new FormControl('', [
                CustomValidators.invalidTenancyValueValidator(),
                CustomValidators.requiredTenancyValueValidator(),
                CustomValidators.invalidTenancyLimitValidator(),
            ]),
            datetimeStart: new FormControl('', Validators.required),
            datetimeEnd: new FormControl('', Validators.required),
            pickupDATE: new FormControl(''),
            pickupTIME: new FormControl(''),
            price: new FormControl(''),
        });
    }

    private initEdit() {
        this.initForm();
        this.serviceForm.patchValue({
            originAddress: 'Gerichtsweg 43, 2540 Bad Vöslau',
            destinationAddress: 'Kröpfelsteigstraße 8, 2371 Hinterbrühl',
            tenancy: '3',
            datetimeStart: '',
            datetimeEnd: '',
            pickupDATE: this.datetimeService.getDateFromTimestamp('2025-01-31T11:27'),
            pickupTIME: this.datetimeService.getTimeFromTimestamp('2025-01-31T11:27'),
            price: 210
        })
    }

    restrictDatePickerStart(): string {
        return this.datetimeService.getTodayStartingTimestamp();
    }

    restrictDatePickerEnd() {
        // TODO(yqni13): maxValString must subscribe to changes of value
        this.maxTenancyStamp = this.datetimeService.get24HoursRestrictionTimestamp(this.serviceForm.get('datetimeStart')?.value);
    }

    getTermsCheckboxValue(event: any) {
        this.termsAcceptance = event.target?.checked;
    }

    getSurchargeParkingCheckboxValue(event: any) {
        this.surchargeParkingAcceptance = event.target?.checked;
    }

    onSubmitOffer() {
        this.serviceForm.markAllAsTouched();

        if(this.serviceForm.invalid) {
            return;
        }

        this.addCustomerData2Form();
        this.hasOffer = true;
        this.loadOfferResponse = true;
        setTimeout(() => {
            this.loadOfferResponse = false;
        }, 1500);
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

    onSubmitOrder() {
        this.serviceForm.markAllAsTouched();

        if(this.serviceForm.invalid) {
            return;
        }

        this.hasOrder = true;
        this.editFinalOrder();
    }

    editFinalOrder() {
        const title = this.serviceForm.get('title')?.value !== ''
            ? this.serviceForm.get('title')?.value + ' '
            : ''
        this.customer = ` ${title}${this.serviceForm.get('firstName')?.value} ${this.serviceForm.get('lastName')?.value}`;
    }

    submitOrder() {
        if(!this.termsAcceptance) {
            return;
        }

        this.loadOrderResponse = true;
        setTimeout(() => {
            this.hasConfirmed = true;
            this.loadOrderResponse = false;
        }, 1500);
    }

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
        this.subscriptionHttpObservationEmail$.unsubscribe();
    }
}