/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ValidationInputComponent } from "../validation-input/validation-input.component";
import { AbstractInputComponent } from "../abstract-input.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { AddressAPIService } from "../../../../shared/services/address-api.service";
import { AddressAutocompleteResponse, AddressDetailsResponse } from "../../../../shared/interfaces/address-response.interface";

@Component({
    selector: 'tava-addressinput',
    templateUrl: './address-input.component.html',
    styleUrl: './address-input.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        ValidationInputComponent
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AddressInputComponent),
            multi: true,
        }
    ]
})
export class AddressInputComponent extends AbstractInputComponent implements OnInit, OnDestroy {

    @HostListener('window:click', ['$event'])
    clickOutside($event: any) {
        if(!$event.target.className.includes('tava-address-wrapper') || !$event.target.className.includes('tava-address-input.origin')) {
            this.showOptions = false;
        } else if($event.target.className.includes('tava-address-wrapper') && this.options.length > 0) {
            this.showOptions = true;
        }
    }

    @Input() fieldName: string;
    @Input() placeholder: string;
    @Input() formControl: FormControl;
    @Input() placeControl: FormControl;
    @Input() options: AddressAutocompleteResponse[];
    @Input() className: string;
    @Input() ngClass: string;
    @Input() exceptions: string[];
    @Input() maxVal: number;

    @Output() byChange: EventEmitter<any>;
    @Output() byPlaceSelection: EventEmitter<AddressDetailsResponse>;

    protected showOptions: boolean;

    private subscriptionFormControl$: Subscription;

    constructor(
        private readonly elRef: ElementRef,
        private readonly translate: TranslateService,
        private readonly addressApiService: AddressAPIService,
    ) {
        super();

        this.fieldName = '';
        this.placeholder = '';
        this.formControl = new FormControl();
        this.placeControl = new FormControl();
        this.options = [];
        this.className = '';
        this.ngClass = '';
        this.exceptions = [];
        this.maxVal = 0;
        this.byChange = new EventEmitter<any>();
        this.byPlaceSelection = new EventEmitter<AddressDetailsResponse>();
        this.showOptions = false;
        this.subscriptionFormControl$ = new Subscription();
    }

    ngOnInit() {
        this.subscriptionFormControl$ = this.formControl.valueChanges.subscribe(changes => {
            // TODO(yqni13): remove byChange? not used so far..
            this.byChange.emit(changes);
            if(this.placeControl?.value !== null) {
                this.byPlaceSelection.emit(this.placeControl?.value);
            }
            if(this.placeControl?.value === null || this.placeControl?.value.address !== this.formControl?.value) {
                this.getOptions();
            }
        });

        // TODO(yqni13): save whole object in formControl and use value to display part of it?
    }
    
    getOptions() {
        this.options = [];
        this.placeControl = new FormControl();
        if(this.formControl?.value !== '' && !this.exceptions.includes(this.formControl?.value)) {
            const data = {
                address: this.formControl?.value,
                language: this.translate.currentLang
            }
            this.addressApiService.setDataAutocomplete(data);
            this.addressApiService.sendAutocompleteRequest().subscribe(data => {
                if(data.body?.body.placeData.status !== 'ZERO_RESULTS') {
                    this.confOptions(data);
                } else {
                    this.options = [];
                    this.showOptions = false;
                }
            })
        } else {
            this.showOptions = false;
        }
    }

    confOptions(data: any) {
        data.body?.body.placeData.predictions.forEach((entry: any) => {
            this.options.push({
                descriptionFull: entry['description'],
                descriptionMain: entry['structured_formatting']['main_text'],
                placeId: entry['place_id']
            })
        })
        this.showOptions = true;
    }

    selectPlace(id: string) {
        const data = {
            placeId: id,
            language: this.translate.currentLang
        }
        this.addressApiService.setDataDetails(data);
        this.addressApiService.sendDetailsRequest().subscribe(data => {
            // TODO(yqni13): fail case?
            this.placeControl?.setValue(this.getAddressDetailsFromResponse(data));
            this.formControl?.setValue(this.placeControl?.value.address);
            this.options = [];
            this.showOptions = false;
        })
    }

    getAddressDetailsFromResponse(data: any): AddressDetailsResponse {
        const array = data.body?.body.placeData.result.address_components;
        const street_number = array.filter((entry: any) => entry.types[0] === 'street_number').map((entry: any) => entry.long_name);
        const street = array.filter((entry: any) => entry.types[0] === 'route').map((entry: any) => entry.long_name);
        const city = array.filter((entry: any) => entry.types[0] === 'locality').map((entry: any) => entry.long_name);
        const province = array.filter((entry: any) => entry.types[0] === 'administrative_area_level_1').map((entry: any) => entry.long_name);
        const country = array.filter((entry: any) => entry.types[0] === 'country').map((entry: any) => entry.long_name);
        const zipCode = array.filter((entry: any) => entry.types[0] === 'postal_code').map((entry: any) => entry.long_name);

        // TODO(yqni13): adapt to responses without certain elements (eg Flughafen Wien)
        return {
            address: `${street} ${street_number}, ${zipCode} ${city}, ${country}`,
            zipCode: zipCode,
            province: province,
            country: country
        }
    }

    ngOnDestroy() {
        this.subscriptionFormControl$.unsubscribe();
    }
}