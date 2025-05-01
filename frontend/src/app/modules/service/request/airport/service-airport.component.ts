import { AfterViewInit, Component, ElementRef, Inject, OnInit } from "@angular/core";
import { filter, tap } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { ObservationService } from "../../../../shared/services/observation.service";
import { DOCUMENT } from "@angular/common";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { DrivingAPIService } from "../../../../shared/services/driving-api.service";
import { DateTimeService } from "../../../../shared/services/datetime.service";
import { HttpObservationService } from "../../../../shared/services/http-observation.service";
import { DistanceFormatPipe } from "../../../../common/pipes/distance-format.pipe";
import * as CustomValidators from "../../../../common/helper/custom-validators";
import { MailAPIService } from "../../../../shared/services/mail-api.service";
import { Router } from "@angular/router";
import { AuthService } from "../../../../shared/services/auth.service";
import { ServiceOptions } from "../../../../shared/enums/service-options.enum";
import { TokenService } from "../../../../shared/services/token.service";
import { NavigationService } from "../../../../shared/services/navigation.service";
import { SnackbarMessageService } from "../../../../shared/services/snackbar.service";
import { MailTranslateService } from "../../../../shared/services/mail-translate.service";
import { BaseServiceComponent } from "../../../../common/components/base-service.component";
import { ServiceImportsModule } from "../../../../common/helper/service-imports.helper";
import { AirportOptions } from "../../../../shared/enums/airport-options.enum";

@Component({
    selector: 'tava-service-airport',
    templateUrl: './service-airport.component.html',
    styleUrls: [
        '../../service.component.scss',
        './service-airport.component.scss'
    ],
    standalone: true,
    imports: [
        DistanceFormatPipe,
        ...ServiceImportsModule
    ]
})
export class ServiceAirportComponent extends BaseServiceComponent implements OnInit, AfterViewInit {

    protected directionOptions = AirportOptions;

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
                    this.addMetaProperties2Form(this.serviceForm);
                    this.httpObserve.setDrivingAirportStatus(false);
                }
                this.loadOfferResponse = false;
            })
        ).subscribe();
    }

    private initForm() {
        this.serviceForm = this.fb.group({
            service: new FormControl(''),
            airportMode: new FormControl('', Validators.required),
            originAddress: new FormControl(''),
            originDetails: new FormControl(''),
            destinationAddress: new FormControl(''),  
            destinationDetails: new FormControl(''),
            datetime: new FormControl('', [
                Validators.required,
                CustomValidators.priorityValidator([
                    CustomValidators.negativeDateTimeValidator(this.datetimeService),
                    CustomValidators.invalidBusinessHoursValidator(this.datetimeService)
                ])
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
            service: this.service,
            airportMode: null,
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
    getDirectionRadioValue() {
        /**
         * $event = native DOM event !== value from FormControl
         * even property binding [value]="..." can result "on" (default radio value)
         * radio select changes FormControl val => (change) triggers process
         */
        this.configAddressFields(this.serviceForm.get('airportMode')?.value);
    }

    configAddressFields(direction: AirportOptions) {
        if(direction === AirportOptions.ARRIVAL) {
            this.serviceForm.get('originAddress')?.setValue('vie-schwechat');
            this.serviceForm.get('destinationAddress')?.setValue('');
            this.serviceForm.get('destinationAddress')?.setValidators(Validators.required);
            this.serviceForm.get('destinationAddress')?.markAsUntouched();
        } else if(direction === AirportOptions.DEPARTURE) {
            this.serviceForm.get('destinationAddress')?.setValue('vie-schwechat');
            this.serviceForm.get('originAddress')?.setValue('');
            this.serviceForm.get('originAddress')?.setValidators(Validators.required);
            this.serviceForm.get('originAddress')?.markAsUntouched();
        }
    }

    async onSubmitOffer() {
        this.serviceForm.markAllAsTouched();

        if(this.serviceForm.invalid) {
            if(this.serviceForm.get('airportMode')?.value === null) {
                this.serviceForm.get('originAddress')?.markAsUntouched();
                this.serviceForm.get('destinationAddress')?.markAsUntouched();
                this.serviceForm.get('datetime')?.markAsUntouched();
            }
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