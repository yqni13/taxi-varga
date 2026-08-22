/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, inject, OnDestroy, OnInit } from "@angular/core";
import { ServiceImportsModule } from "../../../../common/helper/service-imports.helper";
import { BaseServiceComponent } from "../../../../common/components/base-service.component";
import { FormControl, Validators } from "@angular/forms";
import { ServiceRoute } from "../../../../api/routes/service.route.enum";
import { filter, Subscription, tap } from "rxjs";
import { DrivingQuickResponse } from "../../../../api/interfaces/driving-response.interface";
import { DistanceFormatPipe } from "../../../../common/pipes/distance-format.pipe";
import { QuickRouteOption } from "../../../../shared/enums/quickroute-option.enum";
import * as CustomValidators from "../../../../common/helper/custom-validators";
import { DatetimeOption } from "../../../../shared/enums/datetime-options.enum";
import { environment } from "../../../../../environments/environment";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import * as Utils from "../../../../common/helper/common.helper";
import { SnackbarOption } from "../../../../shared/enums/snackbar-options.enum";
import { InvalidBHValidatorParams } from "../../../../shared/interfaces/custom-validators.interface";
import { AddressAPIService } from "../../../../api/services/address.api.service";

@Component({
    selector: 'tava-service-quick',
    templateUrl: './service-quick.component.html',
    styleUrls: [
        '../../service.component.scss',
        './service-quick.component.scss'
    ],
    imports: [
        DistanceFormatPipe,
        ...ServiceImportsModule
    ]
})
export class ServiceQuickComponent extends BaseServiceComponent implements OnInit, AfterViewInit, OnDestroy {

    private readonly addressAPI = inject(AddressAPIService);
    private readonly domSanitizer = inject(DomSanitizer);

    protected callDirectNr = "+436644465466";
    protected originByGPS = false;

    protected browserGeolocationSupport = false;
    protected mapUrl: string | SafeResourceUrl | null = "";
    protected isLoading = false;
    protected isGeoChecked = false;
    protected isSelectingGPSOption = false;

    private originSubscription$: Subscription | undefined = new Subscription();

    constructor() {
        super();
    }

    override async ngOnInit() {
        this.service = ServiceRoute.QUICK;
        super.ngOnInit();
        this.initEdit();
    }

    override ngAfterViewInit() {
        super.ngAfterViewInit();
        this.subscriptionHttpObservationDriving$ = this.httpObserve.drivingQuickStatus$.pipe(
            filter((x) => x || !x),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.hasOffer = true;
                    this.mapMetaFormControls(this.serviceForm);
                    this.httpObserve.setDrivingQuickStatus(false);
                }
                this.loadOfferResponse = false;
            })
        ).subscribe();
    }

    private initForm() {
        const invalidBHValidatorParams: InvalidBHValidatorParams = {
            service: this.datetimeService,
            format: DatetimeOption.HHMM,
            startHour: 4,
            endHour: 12,
            isPickup: true
        };
        this.serviceForm = this.fb.group({
            service: new FormControl(''),
            originAddress: new FormControl('', Validators.required),
            originDetails: new FormControl(''),
            originAddressByGeocode: new FormControl(''),
            originDetailsByGeocode: new FormControl(''),
            destinationAddress: new FormControl('', Validators.required),
            destinationDetails: new FormControl(''),
            back2origin: new FormControl(''),
            pickupTIME: new FormControl('', [
                Validators.required,
                CustomValidators.invalidBusinessHoursValidator(invalidBHValidatorParams)
            ]),
            price: new FormControl(''),
            latency: new FormControl('', CustomValidators.maxLatencyValidator(this.datetimeService)),
            latencyTime: new FormControl(''),
            latencyCosts: new FormControl(''),
            servDist: new FormControl(''),
            servTime: new FormControl(''),
            returnTarget: new FormControl('')
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
            back2origin: false,
            pickupTIME: '00:00',
            price: null,
            latency: '00:00',
            latencyTime: '00:00',
            latencyCosts: null,
            servDist: null,
            servTime: null,
            returnTarget: null
        });
        this.toHandleIsNotUsingGPS();
    }

    getGeolocationCheckboxValue(event: any) {
        this.isSelectingGPSOption = event.target?.checked;
        this.isGeoChecked = event.target?.checked;
        this.getLocationByGPS(event.target?.checked);
    }

    getBack2OriginCheckboxValue(event: any) {
        this.serviceForm.get('back2origin')?.setValue(event.target?.checked);
        if(!event.target?.checked) {
            this.serviceForm.get('latencyTime')?.setValue('00:00');
        }
    }

    private async getLocationByGPS(isUsingGPS: boolean) {
        if(isUsingGPS) {
            this.isLoading = true;
            const success = (position: any) => {
                this.serviceForm.get('originAddress')?.clearValidators();
                this.serviceForm.get('originAddress')?.setValue('');
                this.serviceForm.get('originDetails')?.setValue(null);
                this.originByGPS = true;
                this.addressAPI.setDataGeolocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    language: this.translate.currentLang
                });
                this.addressAPI.sendGeolocationRequest().subscribe({
                    next: async (result: any) => {
                        if(Utils.isObjEmpty(result.body.body.placeData)) {
                            this.toHandleIsNotUsingGPS();
                            await this.delay(500);
                            this.browserGeolocationSupport = false;
                            this.isLoading = false;
                            return;
                        }
                        this.mapUrl = this.transformMapUrl(result.body.body.placeData.place_id);
                        this.transformOriginByGeocode(result.body.body.placeData);
                        await this.delay(500);
                        this.isLoading = false;
                    },
                    error: async (error) => {
                        console.log("Error processing Geolocation by 3rd level service", error);
                        await this.delay(500);
                        this.getGeolocationCheckboxValue({event: { target: { checked: false}}});
                        this.isLoading = false;
                    }
                })
            }
            const error = async () => {
                console.log("Unable to retrieve your location");
                await this.delay(500);
                this.browserGeolocationSupport = false;
                this.isLoading = false;
            }

            if(!navigator.geolocation) {
                console.log("Geolocation not supported on your browser");
                await this.delay(500);
                this.browserGeolocationSupport = false;
                this.isLoading = false;
            } else {
                navigator.geolocation.getCurrentPosition(success, error);
            }
        } else {
            this.toHandleIsNotUsingGPS();
        }
    }

    private toHandleIsNotUsingGPS() {
        this.originSubscription$ = new Subscription();
        this.originByGPS = false;
        this.mapUrl = '';
        this.transformOriginByGeocode(null);
        this.serviceForm.get('originAddress')?.setValidators(Validators.required);
        this.serviceForm.get('originAddress')?.setValue('');
        this.serviceForm.get('originAddress')?.markAsPristine();
        this.serviceForm.get('originAddress')?.markAsUntouched();
        this.serviceForm.get('originAddress')?.updateValueAndValidity({ onlySelf: true, emitEvent: false })
        this.originSubscription$ = this.serviceForm.get('originDetails')?.valueChanges.subscribe((value) => {
            if(value && !value.zipCode) {
                this.serviceForm.get('originAddress')?.setErrors({missingZipcode: true});
            } else if(value && !Utils.isQuickOriginValid(value.zipCode)) {
                this.serviceForm.get('originAddress')?.setErrors({invalidQuickOrigin: true});
            }
        })
    }

    private transformMapUrl(placeId: string): SafeResourceUrl {
        const url = `https://www.google.com/maps/embed/v1/place?key=${environment.GOOGLE_API_KEY}&q=place_id:${placeId}&maptype=satellite&zoom=17`;
        return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    }

    private transformOriginByGeocode(data: any | null) {
        if(data) {
            this.serviceForm.get('originAddressByGeocode')?.setValue(data.formatted_address);
            this.serviceForm.get('originDetailsByGeocode')?.setValue({
                placeId: data.place_id,
                address: data.formatted_address,
                province: data.address_components.find((entry: any) => {return entry.types.includes('administrative_area_level_1')})['long_name'],
                country: data.address_components.find((entry: any) => {return entry.types.includes('country')})['long_name'],
                zipCode: data.address_components.find((entry: any) => {return entry.types.includes('postal_code')})['long_name'] ?? null
            });
        } else {
            this.serviceForm.get('originAddressByGeocode')?.setValue('');
            this.serviceForm.get('originDetailsByGeocode')?.setValue(null);
        }
    }

    async onQuickSubmit() {
        this.serviceForm.markAllAsTouched();

        if(this.serviceForm.invalid) {
            return;
        }

        this.loadOfferResponse = true;
        this.drivingAPIService.setDataQuick(this.serviceForm.getRawValue(), this.originByGPS);
        this.drivingAPIService.sendQuickRequest().subscribe(data => {
            this.mapResponseQuickData(data.body);
        });
        await this.delay(100);
        this.scrollToTop();
    }

    private mapResponseQuickData(data: DrivingQuickResponse | null) {
        if(!data) {
            return;
        }

        this.serviceForm.get('price')?.setValue(data.body.routeData.price);
        this.serviceForm.get('latencyCosts')?.setValue(data.body.routeData.latency.costs);
        this.serviceForm.get('latencyTime')?.setValue(
            this.datetimeService.getTimeFromTotalMinutes(data.body.routeData.latency.time)
        );
        this.serviceForm.get('servDist')?.setValue(data.body.routeData.servDist);
        this.serviceForm.get('servTime')?.setValue(
            this.datetimeService.getTimeFromTotalMinutes(data.body.routeData.servTime)
        );
        switch(data.body.routeData.returnTarget) {
            case(QuickRouteOption.OR): {
                this.serviceForm.get('returnTarget')?.setValue('OR');
                break;
            }
            case(QuickRouteOption.DES): {
                this.serviceForm.get('returnTarget')?.setValue('DES');
                break;
            }
            case(QuickRouteOption.HOME): {
                this.serviceForm.get('returnTarget')?.setValue('H0');
                break;
            }
            default: 
                this.serviceForm.get('returnTarget')?.setValue('VB')
        }
    }

    displayGeolocationInfo() {
        this.snackbar.notify({
            title: 'modules.service.content.quick.snackbar-info.geolocation.title',
            text: 'modules.service.content.quick.snackbar-info.geolocation.text',
            autoClose: false,
            type: SnackbarOption.INFO
        })
    }

    override ngOnDestroy() {
        super.ngOnDestroy();
        this.originSubscription$?.unsubscribe();
    }
}