/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, Inject, OnInit } from "@angular/core";
import { filter, tap } from "rxjs";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ObservationService } from "../../../../shared/services/observation.service";
import { CommonModule, DOCUMENT } from "@angular/common";
import { CastAbstract2FormControlPipe } from "../../../../common/pipes/cast-abstract2form-control.pipe";
import { CurrencyFormatPipe } from "../../../../common/pipes/currency-format.pipe";
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
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
import { AuthService } from "../../../../shared/services/auth.service";
import { ServiceOptions } from "../../../../shared/enums/service-options.enum";
import { TokenService } from "../../../../shared/services/token.service";
import { NavigationService } from "../../../../shared/services/navigation.service";
import { SnackbarMessageService } from "../../../../shared/services/snackbar.service";
import { MailTranslateService } from "../../../../shared/services/mail-translate.service";
import { BaseServiceComponent } from "../../../../common/components/base-service.component";

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
export class ServiceAirportComponent extends BaseServiceComponent implements OnInit, AfterViewInit {

    protected direction: string;

    constructor(
        router: Router,
        fb: FormBuilder,
        auth: AuthService,
        elRef: ElementRef,
        tokenService: TokenService,
        observe: ObservationService,
        translate: TranslateService,
        navigation: NavigationService,
        mailAPIService: MailAPIService,
        snackbar: SnackbarMessageService,
        datetimeService: DateTimeService,
        mailTranslate: MailTranslateService,
        httpObserve: HttpObservationService,
        @Inject(DOCUMENT) document: Document,
        drivingAPIService: DrivingAPIService,
    ) {
        super(router, fb, auth, elRef, tokenService, translate, observe, navigation, mailAPIService, datetimeService, snackbar, mailTranslate, httpObserve, document, drivingAPIService);
        this.direction = '';
    }

    override async ngOnInit() {
        this.service = ServiceOptions.AIRPORT;
        super.ngOnInit();
        this.initEdit();
    }

    override ngAfterViewInit() {
        super.ngAfterViewInit();
        this.subscriptionHttpObservationDriving$ = this.httpObserve.drivingAirportStatus$.pipe(
            filter((x) => x || !x),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.hasOffer = true;
                    this.addCustomerData2Form();
                    this.httpObserve.setDrivingAirportStatus(false);
                }
                this.loadOfferResponse = false;
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

    getDirectionRadioValue(event: any) {
        this.direction = event.target?.value;
        this.configAddressFields(this.direction);
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

    configDateTimeData() {
        const datetime = this.serviceForm.get('datetime')?.value;
        this.serviceForm.get('pickupDATE')?.setValue(this.datetimeService.getDateFromTimestamp(datetime));
        this.serviceForm.get('pickupTIME')?.setValue(this.datetimeService.getTimeFromTimestamp(datetime));
        this.pickupTimeByLangStatic = this.datetimeService.getTimeFromLanguage(
            this.serviceForm.get('pickupTIME')?.value,
            this.translate.currentLang
        );
    }
}