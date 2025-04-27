/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, Inject, OnInit } from "@angular/core";
import { filter, tap } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { ObservationService } from "../../../../shared/services/observation.service";
import { DOCUMENT } from "@angular/common";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { DateTimeService } from "../../../../shared/services/datetime.service";
import { HttpObservationService } from '../../../../shared/services/http-observation.service';
import { DrivingAPIService } from "../../../../shared/services/driving-api.service";
import { DistanceFormatPipe } from "../../../../common/pipes/distance-format.pipe";
import * as CustomValidators from "../../../../common/helper/custom-validators";
import { MailAPIService } from "../../../../shared/services/mail-api.service";
import { Router } from "@angular/router";
import { AuthService } from "../../../../shared/services/auth.service";
import { TokenService } from "../../../../shared/services/token.service";
import { ServiceOptions } from "../../../../shared/enums/service-options.enum";
import { NavigationService } from "../../../../shared/services/navigation.service";
import { MailTranslateService } from "../../../../shared/services/mail-translate.service";
import { SnackbarMessageService } from "../../../../shared/services/snackbar.service";
import { BaseServiceComponent } from "../../../../common/components/base-service.component";
import { ServiceImportsModule } from "../../../../common/helper/service-imports.helper";

@Component({
    selector: 'tava-service-destination',
    templateUrl: './service-destination.component.html',
    styleUrls: [
        '../../service.component.scss',
        './service-destination.component.scss'
    ],
    standalone: true,
    imports: [
        DistanceFormatPipe,
        ...ServiceImportsModule
    ]
})
export class ServiceDestinationComponent extends BaseServiceComponent implements OnInit, AfterViewInit {

    protected termSurchargeFuel: boolean;

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
        super(router, fb, auth, elRef, tokenService, translate, observe, navigation, mailAPIService, datetimeService, snackbar, mailTranslate, httpObserve, document, drivingAPIService)
        
        this.termSurchargeFuel = false;
    }

    override async ngOnInit() {
        this.service = ServiceOptions.DESTINATION;
        super.ngOnInit();
        this.initEdit();
    }

    override ngAfterViewInit() {
        super.ngAfterViewInit();
        this.subscriptionHttpObservationDriving$ = this.httpObserve.drivingDestinationStatus$.pipe(
            filter((x) => x || !x),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.hasOffer = true;
                    this.addMetaProperties2Form(this.serviceForm);
                    this.httpObserve.setDrivingDestinationStatus(false);
                }
                this.loadOfferResponse = false;
            })
        ).subscribe();
    }

    private initForm() {
        this.serviceForm = this.fb.group({
            service: new FormControl(''),
            originAddress: new FormControl('', Validators.required),
            originDetails: new FormControl(''),
            destinationAddress: new FormControl('', Validators.required),            
            destinationDetails: new FormControl(''),
            back2home: new FormControl(''),
            datetime: new FormControl('', [
                Validators.required,
                CustomValidators.negativeDateTimeValidator(this.datetimeService)
            ]),
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
            service: this.service,
            originAddress: '',
            originDetails: null,
            destinationAddress: '',
            destinationDetails: null,
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

    getBack2HomeCheckboxValue(event: any) {
        this.serviceForm.get('back2home')?.setValue(event.target?.checked);
        if(!event.target?.checked) {
            this.serviceForm.get('latency')?.setValue('00:00');
        }
    }

    getSurchargeFuelCheckboxValue(event: any) {
        this.termSurchargeFuel = event.target?.checked;
    }

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

    override resetOrderStatus() {
        super.resetOrderStatus();
        this.termSurchargeParking = false;
        this.termSurchargeFuel = false;
    }
}