/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subscription, tap } from "rxjs";
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
export class ServiceDestinationComponent implements OnInit, OnDestroy {

    @ViewChild('originSearchInput', {static: true}) originSearchInput!: ElementRef;

    protected selectedBg: string;
    protected hasOffer: boolean;
    protected hasOrder: boolean;
    protected hasConfirmed: boolean;

    protected serviceForm: FormGroup;

    private subscriptionThemeObservation$: Subscription;
    private window: any;
    private customerData: string[];

    constructor(
        private readonly fb: FormBuilder,
        private readonly translate: TranslateService,
        private readonly observation: ObservationService,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.selectedBg = '';
        this.hasOffer = false;
        this.hasOrder = false;
        this.hasConfirmed = false;

        this.serviceForm = new FormGroup({});
    
        this.subscriptionThemeObservation$ = new Subscription();
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

    private initForm() {
        this.serviceForm = this.fb.group({
            originAddress: new FormControl('', Validators.required),
            destinationAddress: new FormControl('', Validators.required),            
            back2home: new FormControl(''),
            datetime: new FormControl('', Validators.required)
        });
    }

    private initEdit() {
        this.initForm();
        this.serviceForm.patchValue({
            originAddress: 'VIE',
            destinationAddress: '150',            
            back2home: false,
            datetime: '2024-12-23T00:04'
        });
        // this.serviceForm.patchValue({
        //     originAddress: '',
        //     destinationAddress: '',            
        //     back2home: false,
        //     datetime: ''
        // });
    }

    getCheckboxValue(event: any) {
        this.serviceForm.get('back2home')?.setValue(event.target?.checked);
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
        console.log(this.serviceForm);

        if(this.serviceForm.invalid) {
            return;
        }

        this.hasOffer = true;
        this.addCustomerData2Form();
    }

    addCustomerData2Form() {
        Object.values(this.customerData).forEach((element) => {
            if(element !== 'title' && element !== 'note') {
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
    }

    nextOrder() {
        console.log('continue with order');
        this.hasOrder = true;
    }

    nextConfirm() {
        console.log('offer confirmed');
        this.hasConfirmed = true;
    }

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
    }
}