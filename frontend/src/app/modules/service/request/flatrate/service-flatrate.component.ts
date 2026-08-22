/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { filter, Subject, tap } from "rxjs";
import { FormControl, Validators } from "@angular/forms";
import * as CustomValidators from "../../../../common/helper/custom-validators";
import { ServiceRoute } from "../../../../api/routes/service.route.enum";
import { BaseServiceComponent } from "../../../../common/components/base-service.component";
import { ServiceImportsModule } from "../../../../common/helper/service-imports.helper";
import { InvalidBHValidatorParams } from "../../../../shared/interfaces/custom-validators.interface";
import { DatetimeOption } from "../../../../shared/enums/datetime-options.enum";

@Component({
    selector: 'tava-service-flatrate',
    templateUrl: './service-flatrate.component.html',
    styleUrls: [
        '../../service.component.scss',
        './service-flatrate.component.scss'
    ],
    imports: [
        ...ServiceImportsModule
    ]
})
export class ServiceFlatrateComponent extends BaseServiceComponent implements OnInit, AfterViewInit {

    protected dropoffTimeByLang$ = new Subject<string>();
    protected dropoffTimeByLangStatic = "";
    protected minTenancyStamp$ = new Subject<string>();
    protected maxTenancyStamp$ = new Subject<string>();

    constructor() {
        super()
    }

    override async ngOnInit() {
        this.service = ServiceRoute.FLATRATE;
        super.ngOnInit();
        this.initEdit();
    }

    override ngAfterViewInit() {
        super.ngAfterViewInit();
        this.subscriptionHttpObservationDriving$ = this.httpObserve.drivingFlatrateStatus$.pipe(
            filter((x) => x || !x),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.hasOffer = true;
                    this.mapMetaFormControls(this.serviceForm);
                    this.httpObserve.setDrivingFlatrateStatus(false);
                }
                this.loadOfferResponse = false;
            })
        ).subscribe();
    }

    private initForm() {
        const invalidBHValidatorParamsStart: InvalidBHValidatorParams = {
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
            tenancy: new FormControl(''),
            datetimeStart: new FormControl('', [
                Validators.required,
                CustomValidators.negativeCurrentDateTimeValidator(this.datetimeService),
                CustomValidators.invalidBusinessHoursValidator(invalidBHValidatorParamsStart)
            ]),
            datetimeEnd: new FormControl(''),
            pickupDATE: new FormControl(''),
            pickupTIME: new FormControl(''),
            dropOffDATE: new FormControl(''),
            dropOffTIME: new FormControl(''),
            price: new FormControl(''),
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
            tenancy: null,
            datetimeStart: '',
            datetimeEnd: '',
            pickupDATE: '',
            pickupTIME: '',
            dropOffDATE: '',
            dropOffTIME: '',
            price: null
        })
    }

    configDateTimeEnd($event: any) {
        const restrictDateTime = this.datetimeService.getRestrictionTimestampByDateAndTime($event, '20:00:00');
        const invalidBHValidatorParamsStart: InvalidBHValidatorParams = {
            service: this.datetimeService,
            format: DatetimeOption.FULL,
            startHour: 4,
            endHour: 20,
            isPickup: false
        };
        this.minTenancyStamp$.next(this.datetimeService.getTodayStartingTimestamp(false, $event));
        this.maxTenancyStamp$.next(restrictDateTime);
        this.serviceForm.get('datetimeEnd')?.clearValidators();
        this.serviceForm.get('datetimeEnd')?.setValidators([
            CustomValidators.requiredTenancyValidator(),
            CustomValidators.priorityValidator([
                CustomValidators.negativeFixedDateTimeValidator(
                    this.datetimeService,
                    this.serviceForm.get('datetimeStart')?.value
                ),
                CustomValidators.invalidZeroTenancyValidator(
                    this.datetimeService,
                    this.serviceForm.get('datetimeStart')?.value
                )
            ]),
            CustomValidators.invalidBusinessHoursValidator(invalidBHValidatorParamsStart)
        ]);
        this.serviceForm.get('datetimeEnd')?.setValue('');
        this.serviceForm.get('datetimeEnd')?.markAsUntouched();
    }

    async onSubmitOffer() {
        this.serviceForm.markAllAsTouched();

        if(this.serviceForm.invalid) {
            return;
        }

        this.configDateTimeData();
        this.drivingAPIService.setDataFlatrate(this.serviceForm.getRawValue());
        this.drivingAPIService.sendFlatrateRequest().subscribe(data => {
            this.addResponseRouteData2Form(data);
        })
        this.loadOfferResponse = true;
        await this.delay(100);
        this.scrollToTop();
    }

    configDateTimeData() {
        this.serviceForm.get('tenancy')?.setValue(this.datetimeService.getTimeDifferenceAsString(
            this.serviceForm.get('datetimeStart')?.value,
            this.serviceForm.get('datetimeEnd')?.value
        ));
        
        this.serviceForm.get('pickupDATE')?.setValue(this.datetimeService.getDateFromTimestamp(
            this.serviceForm.get('datetimeStart')?.value
        ));
        this.serviceForm.get('pickupTIME')?.setValue(this.datetimeService.getTimeFromTimestamp(
            this.serviceForm.get('datetimeStart')?.value
        ));
        this.serviceForm.get('dropOffDATE')?.setValue(this.datetimeService.getDateFromTimestamp(
            this.serviceForm.get('datetimeEnd')?.value
        ));
        this.serviceForm.get('dropOffTIME')?.setValue(this.datetimeService.getTimeFromTimestamp(
            this.serviceForm.get('datetimeEnd')?.value
        ));

        this.pickupTimeByLangStatic = this.datetimeService.getTimeFromLanguage(
            this.serviceForm.get('pickupTIME')?.value,
            this.translate.currentLang
        );
        this.dropoffTimeByLangStatic = this.datetimeService.getTimeFromLanguage(
            this.serviceForm.get('dropOffTIME')?.value,
            this.translate.currentLang
        );
    }

    override configPickupTimeByLanguage(lang: string) {
        const time = this.serviceForm.get('pickupTIME')?.value;
        if(time === '') {
            return;
        }

        this.pickupTimeByLang$.next(this.datetimeService.getTimeFromLanguage(time, lang));
        this.dropoffTimeByLang$.next(this.datetimeService.getTimeFromLanguage(time, lang));
    }

    override addResponseRouteData2Form(response: any) {
        const newTenancy = this.datetimeService.getTimeFromTotalMinutes(response.body?.body.routeData.tenancy);
        this.serviceForm.get('tenancy')?.setValue(newTenancy);
        this.serviceForm.get('price')?.setValue(response.body?.body.routeData.price);
    }

    override resetOrderStatus() {
        super.resetOrderStatus();
        this.termSurchargeParking = false;
    }
}