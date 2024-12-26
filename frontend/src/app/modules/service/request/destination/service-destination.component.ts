/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { filter, Subscription, tap } from "rxjs";
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
import { ConvertingService } from "../../../../shared/services/converting.service";
import { HttpObservationService } from '../../../../shared/services/http-observation.service';
import { DrivingAPIService } from "../../../../shared/services/driving-api.service";

@Component({
    selector: 'tava-service-destination',
    templateUrl: './service-destination.component.html',
    styleUrl: './service-destination.component.scss',
    standalone: true,
    imports: [
        CastAbstract2FormControlPipe,
        CurrencyFormatPipe,
        CommonModule,
        ReactiveFormsModule,
        SelectInputComponent,
        TextareaInputComponent,
        TextInputComponent,
        TranslateModule
    ]
})
export class ServiceDestinationComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('originSearchInput', {static: true}) originSearchInput!: ElementRef;

    protected selectedBg: string;
    protected hasOffer: boolean;
    protected hasOrder: boolean;
    protected hasConfirmed: boolean;

    protected serviceForm: FormGroup;
    protected customer: string;
    protected termsAcceptance: boolean;
    protected loadOfferResponse: boolean;
    protected loadOrderResponse: boolean;

    private subscriptionThemeObservation$: Subscription;
    private subscriptionHttpObservationDriving$: Subscription;
    private subscriptionHttpObservationEmail$: Subscription;
    private window: any;
    private customerData: string[];

    constructor(
        private readonly fb: FormBuilder,
        private readonly translate: TranslateService,
        private readonly observation: ObservationService,
        private readonly drivingAPIService: DrivingAPIService,
        private readonly convertingService: ConvertingService,
        private httpObservationService: HttpObservationService,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.selectedBg = '';
        this.hasOffer = false;
        this.hasOrder = false;
        this.hasConfirmed = false;

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
        // this.googlePlacesAutocomplete();
    }

    ngAfterViewInit() {
        this.subscriptionHttpObservationDriving$ = this.httpObservationService.drivingDestinationStatus$.pipe(
            filter((x) => x || !x),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.hasOffer = true;
                } else {
                    // TODO(yqni13): set form invalid or show general error message
                }
                this.loadOfferResponse = false;
            })
        ).subscribe();

        this.subscriptionHttpObservationEmail$ = this.httpObservationService.emailStatus$.pipe(
            filter((x) => !!x),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    // do what needs and get to last message in process
                }
                this.loadOrderResponse = false;
            })
        ).subscribe();
    }

    private initForm() {
        this.serviceForm = this.fb.group({
            originAddress: new FormControl('', Validators.required),
            destinationAddress: new FormControl('', Validators.required),            
            back2home: new FormControl(''),
            datetime: new FormControl('', Validators.required),
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
            originAddress: 'Vienna International Airport',
            destinationAddress: 'Anton Bruckner-Gasse 11, 2544 Leobersdorf',
            back2home: false,
            datetime: '2024-12-23T01:38',
            pickupDATE: this.convertingService.getDateFromTimestamp('2024-12-23T01:38'),
            pickupTIME: this.convertingService.getTimeFromTimestamp('2024-12-23T01:38'),
            distance: '49.6 km',
            duration: '36 min',
            price: '72'
        });
        // this.serviceForm.patchValue({
        //     originAddress: '',
        //     destinationAddress: '',            
        //     back2home: false,
        //     datetime: '',
        //     pickupDATE: '',
        //     pickupTIME: '',
        //     distance: '',
        //     duration: '',
        //     price: ''
        // });
    }

    getBack2HomeCheckboxValue(event: any) {
        this.serviceForm.get('back2home')?.setValue(event.target?.checked);
    }

    getTermsCheckboxValue(event: any) {
        this.termsAcceptance = event.target?.checked;
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

    onSubmitOffer() {
        this.serviceForm.markAllAsTouched();

        if(this.serviceForm.invalid) {
            return;
        }

        this.addCustomerData2Form();
        this.drivingAPIService.setDataDestination(this.serviceForm.getRawValue());
        this.drivingAPIService.sendDestinationRequest().subscribe(data => {
            console.log('response data: ', data);
        });
        this.loadOfferResponse = true;
        // setTimeout(() => {
        //     this.loadOfferResponse = false;
        // }, 1500);
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
        this.subscriptionHttpObservationDriving$.unsubscribe();
        this.subscriptionHttpObservationEmail$.unsubscribe();
    }
}