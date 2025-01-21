/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, forwardRef, HostListener, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ValidationInputComponent } from "../validation-input/validation-input.component";
import { AbstractInputComponent } from "../abstract-input.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { AddressAPIService } from "../../../../shared/services/address-api.service";
import { v4 as uuidv4 } from 'uuid';
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
        if($event.target.className.includes('tava-address-input-text')) {
            this.showOptions = true;
        } else if(!$event.target.className.includes('tava-address-wrapper')) {
            this.showOptions = false;
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

    private delay: any;
    private sessionToken: string;
    private subscriptionFormControl$: Subscription;

    constructor(
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
        this.sessionToken = '';
        this.subscriptionFormControl$ = new Subscription();

        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    ngOnInit() {
        this.sessionToken = uuidv4();
        this.subscriptionFormControl$ = this.formControl.valueChanges.subscribe(changes => {
            if(this.placeControl?.value !== null && this.placeControl?.value.address !== this.formControl?.value) {
                this.sessionToken = uuidv4();
                this.placeControl = new FormControl();
                this.byPlaceSelection.emit(this.placeControl?.value);
            }
            if(this.placeControl?.value !== null) {
                this.byPlaceSelection.emit(this.placeControl?.value);
            }
            if(this.placeControl?.value === null) {
                this.getOptions();
            }
            this.byChange.emit(changes);
        });
    }
    
    getOptions() {
        this.placeControl = new FormControl();
        if(this.formControl?.value !== '' && !this.exceptions.includes(this.formControl?.value)) {
            const data = {
                address: this.formControl?.value,
                language: this.translate.currentLang,
                sessionToken: this.sessionToken
            }
            this.addressApiService.setDataAutocomplete(data);
            this.addressApiService.sendAutocompleteRequest().subscribe(data => {
                if(data.body?.body.placeData.status !== 'ZERO_RESULTS') {
                    this.confOptions(data);
                } else {
                    this.options.length = 0;
                    this.showOptions = false;
                }
            })
        } else {
            this.showOptions = false;
        }
    }

    confOptions(data: any) {
        this.delay(100);
        this.options.length = 0;
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
            language: this.translate.currentLang,
            sessionToken: this.sessionToken
        }
        this.addressApiService.setDataDetails(data);
        this.addressApiService.sendDetailsRequest().subscribe(data => {
            this.placeControl?.setValue(this.getAddressDetailsFromResponse(data));
            this.formControl?.setValue(this.placeControl?.value.address);
            this.sessionToken = '';
            this.options.length = 0;
            this.showOptions = false;
        })
    }

    getAddressDetailsFromResponse(data: any): AddressDetailsResponse {
        if(data.body?.body.placeData.status === 'INVALID_REQUEST') {
            return {
                address: '',
                zipCode: '',
                province: '',
                country: ''
            }
        }

        const array = data.body?.body.placeData.result.address_components;
        const route = array.filter((entry: any) => entry.types[0] === 'route').map((entry: any) => entry.long_name);
        const name = data.body?.body.placeData.result.name;
        const address = data.body?.body.placeData.result.formatted_address;
        const province = array.filter((entry: any) => entry.types[0] === 'administrative_area_level_1').map((entry: any) => JSON.stringify(entry.long_name));
        const country = array.filter((entry: any) => entry.types[0] === 'country').map((entry: any) => entry.long_name as string);
        const zipCode = array.filter((entry: any) => entry.types[0] === 'postal_code').map((entry: any) => entry.long_name as string);

        return {
            address: route.length === 0 ? name : address,
            zipCode: zipCode[0] as string,
            province: province[0] as string,
            country: country[0] as string
        }
    }

    ngOnDestroy() {
        this.subscriptionFormControl$.unsubscribe();
    }
}