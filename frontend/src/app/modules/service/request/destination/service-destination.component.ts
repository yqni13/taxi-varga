import { AfterViewInit, Component, OnInit } from "@angular/core";
import { filter, tap } from "rxjs";
import { FormControl, Validators } from "@angular/forms";
import { DistanceFormatPipe } from "../../../../common/pipes/distance-format.pipe";
import * as CustomValidators from "../../../../common/helper/custom-validators";
import { ServiceRoute } from "../../../../api/routes/service.route.enum";
import { BaseServiceComponent } from "../../../../common/components/base-service.component";
import { ServiceImportsModule } from "../../../../common/helper/service-imports.helper";
import { DatetimeOption } from "../../../../shared/enums/datetime-options.enum";
import { InvalidBHValidatorParams } from "../../../../shared/interfaces/custom-validators.interface";

@Component({
    selector: 'tava-service-destination',
    templateUrl: './service-destination.component.html',
    styleUrls: [
        '../../service.component.scss',
        './service-destination.component.scss'
    ],
    imports: [
        DistanceFormatPipe,
        ...ServiceImportsModule
    ]
})
export class ServiceDestinationComponent extends BaseServiceComponent implements OnInit, AfterViewInit {

    constructor(
    ) {
        super();
    }

    override async ngOnInit() {
        this.service = ServiceRoute.DESTINATION;
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
                    this.mapMetaFormControls(this.serviceForm);
                    this.httpObserve.setDrivingDestinationStatus(false);
                }
                this.loadOfferResponse = false;
            })
        ).subscribe();
    }

    private initForm() {
        const invalidBHValidatorParams: InvalidBHValidatorParams = {
            service: this.datetimeService,
            format: DatetimeOption.FULL,
            startHour: 4,
            endHour: 17,
            isPickup: true
        };
        this.serviceForm = this.fb.group({
            service: new FormControl(''),
            originAddress: new FormControl('', Validators.required),
            originDetails: new FormControl(''),
            destinationAddress: new FormControl('', Validators.required),            
            destinationDetails: new FormControl(''),
            back2home: new FormControl(''),
            datetime: new FormControl('', [
                Validators.required,
                CustomValidators.negativeCurrentDateTimeValidator(this.datetimeService),
                CustomValidators.invalidBusinessHoursValidator(invalidBHValidatorParams)
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getBack2HomeCheckboxValue(event: any) {
        this.serviceForm.get('back2home')?.setValue(event.target?.checked);
        if(!event.target?.checked) {
            this.serviceForm.get('latency')?.setValue('00:00');
        }
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