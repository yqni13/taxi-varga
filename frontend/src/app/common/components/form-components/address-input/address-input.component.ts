/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ValidationInputComponent } from "../validation-input/validation-input.component";
import { AbstractInputComponent } from "../abstract-input.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { AddressAPIService } from "../../../../shared/services/address-api.service";
import { v4 as uuidv4 } from 'uuid';
import { AddressAutocompleteResponse, AddressDetailsResponse } from "../../../../shared/interfaces/address-response.interface";
import * as CustomValidators from "../../../helper/custom-validators";
import { AddressFilterOptions } from "../../../../shared/enums/addressfilter-options.enum";

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
export class AddressInputComponent extends AbstractInputComponent implements OnInit, AfterViewInit, OnDestroy {

    @HostListener('window:click', ['$event'])
    override clickOutside($event: any) {
        if($event.target?.id !== `tava-${this.fieldName}`) {
            this.showOptions = false;
            this.isFocused = false;
        } else {
            this.showOptions = true;
            this.isFocused = true;
        }
    }

    @HostListener('window:keydown', ['$event'])
    override tabOutside($event: any) {
        if($event.key === 'Tab' && ($event.target?.id === `tava-${this.fieldName}`)) {
            this.isFocused = false;
        } else if($event.key === 'Escape') {
            this.showOptions = false;
        }
    }

    @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;
    @ViewChildren('optionRef') optionRefList!: QueryList<ElementRef<HTMLElement>>;

    @Input() fieldName: string;
    @Input() placeholder: string;
    @Input() formControl: FormControl;
    @Input() placeControl: FormControl;
    @Input() options: AddressAutocompleteResponse[];
    @Input() className: string;
    @Input() ngClass: string;
    @Input() exceptions: string[];
    @Input() maxVal: number;
    @Input() isReadonly: boolean;
    @Input() filterOption: AddressFilterOptions;
    @Input() set hasAutoFocus(value: boolean) {
        if(value) {
            this.focusOnInput();
            this.showOptions = true;
        } else {
            this.isFocused = false;
        }
    }

    @Output() byChange: EventEmitter<any>;
    @Output() byPlaceSelection: EventEmitter<AddressDetailsResponse>;

    protected showOptions: boolean;
    protected focusIndex: number;

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
        this.isReadonly = false;
        this.filterOption = AddressFilterOptions.NOSPEC;
        this.byChange = new EventEmitter<any>();
        this.byPlaceSelection = new EventEmitter<AddressDetailsResponse>();
        this.showOptions = false;
        this.focusIndex = -1;
        this.sessionToken = '';
        this.subscriptionFormControl$ = new Subscription();

        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    ngOnInit() {
        this.formControl.addValidators(CustomValidators.emptyAddressSelectValidator(this.placeControl));
        this.sessionToken = uuidv4();
        this.subscriptionFormControl$ = this.formControl.valueChanges.subscribe(changes => {
            if(this.placeControl?.value !== null && this.placeControl?.value.address !== this.formControl?.value) {
                this.sessionToken = uuidv4();
                this.placeControl.reset();
                this.byPlaceSelection.emit(this.placeControl?.value);
                if(this.formControl.value !== '') {
                    this.formControl.updateValueAndValidity();
                }
            }
            if(this.placeControl?.value !== null) {
                this.byPlaceSelection.emit(this.placeControl?.value);
            }
            if(this.placeControl?.value === null) {
                this.getOptions();
            }
            this.isFocused = true;
            this.byChange.emit(changes);
        });
    }

    ngAfterViewInit() {
        if(this.hasAutoFocus) {
            this.inputRef.nativeElement.focus();
        }
    }
    
    getOptions() {
        this.placeControl.reset();
        if(this.formControl?.value !== '' && !this.exceptions.includes(this.formControl?.value)) {
            const data = {
                address: this.formControl?.value,
                language: this.translate.currentLang,
                filter: this.filterOption,
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
        this.delay(50);
        this.options.length = 0;
        data.body?.body.placeData.suggestions.forEach((entry: any) => {
            this.options.push({
                descriptionFull: entry['placePrediction']['text']['text'],
                descriptionMain: entry['placePrediction']['structuredFormat']['mainText']['text'],
                placeId: entry['placePrediction']['placeId']
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
            this.placeControl?.setValue(this.getAddressDetailsFromResponse(data, id));
            this.formControl?.setValue(this.placeControl?.value.address);
            this.formControl.updateValueAndValidity();
            this.sessionToken = '';
            this.options.length = 0;
            this.showOptions = false;
            this.isFocused = false;
        })
    }

    getAddressDetailsFromResponse(data: any, id: string): AddressDetailsResponse {
        if(data.body?.body.placeData.status === 'INVALID_REQUEST') {
            return {
                address: '',
                zipCode: '',
                province: '',
                country: '',
                placeId: ''
            }
        }

        const array = data.body?.body.placeData.addressComponents;
        const types = data.body?.body.placeData.types;
        const route = data.body?.body.placeData.formattedAddress;
        const name = data.body?.body.placeData.displayName.text;
        const province = array.filter((entry: any) => entry.types[0] === 'administrative_area_level_1').map((entry: any) => entry.longText as string);
        const country = array.filter((entry: any) => entry.types[0] === 'country').map((entry: any) => entry.longText as string);
        const zipCode = array.filter((entry: any) => entry.types[0] === 'postal_code').map((entry: any) => entry.longText as string);
        const locality = array.filter((entry: any) => entry.types[0] === 'locality').map((entry: any) => entry.longText as string);
        const alternateAddress = `${name},${zipCode.length > 0 ? ' ' + zipCode : ''} ${province.length > 0 ? province : locality}`;

        return {
            address: types.includes('street_address') || types.includes('postal_code') ? route : alternateAddress,
            zipCode: zipCode[0] as string,
            province: province[0] as string,
            country: country[0] as string,
            placeId: id
        }
    }

    onInputKeyNav(event: KeyboardEvent) {
        if(event.key === 'ArrowDown' && this.options.length > 0) {
            event.preventDefault();
            this.focusIndex = 0;
            this.focusOnOption(this.focusIndex);
        } else if(event.key === 'Tab') {
            this.showOptions = false;
        }
    }

    onOptionKeyNav(event: KeyboardEvent, index: number) {
        if(event.key === 'ArrowDown') {
            event.preventDefault();
            if((index + 1) < this.options.length) {
                this.focusIndex = index + 1;
                this.focusOnOption(this.focusIndex);
            }
        } else if(event.key === 'ArrowUp') {
            event.preventDefault();
            if((index - 1) >= 0) {
                this.focusIndex = index - 1;
                this.focusOnOption(this.focusIndex);
            } else {
                this.focusIndex = -1;
                this.focusOnInput();
            }
        } else if(event.key === 'Enter') {
            this.selectPlace(this.options[index].placeId);
        } else if(event.key === 'Escape' && this.focusIndex !== -1) {
            this.focusIndex = -1;
            this.focusOnInput();
        } else if(event.key === 'Tab') {
            this.focusIndex = -1;
            this.showOptions = false;
        }
    }

    focusOnOption(index: number) {
        const optionList = this.optionRefList.toArray()[index];
        optionList?.nativeElement.focus();
    }

    focusOnInput() {
        this.inputRef?.nativeElement.focus();
        this.isFocused = true;
        // define input value length and set focus to last position of input
        const inputLength = this.inputRef.nativeElement.value.length;
        this.inputRef.nativeElement.setSelectionRange(inputLength, inputLength);
    }

    ngOnDestroy() {
        this.subscriptionFormControl$.unsubscribe();
    }
}