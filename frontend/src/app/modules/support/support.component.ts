import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, ViewChild, DOCUMENT } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { TextInputComponent } from "../../common/components/form-components/text-input/text-input.component";
import { SelectInputComponent } from "../../common/components/form-components/select-input/select-input.component";
import { TextareaInputComponent } from "../../common/components/form-components/textarea-input/textarea-input.component";
import { VarDirective } from "../../common/directives/ng-var.directive";
import { SupportOption } from "../../api/enums/ticket-option.support.enum";
import { SupportDeviceOption } from "../../api/enums/device-option.support.enum";
import { filter, Subscription, tap } from "rxjs";
import { AuthService } from "../../api/services/auth.api.service";
import { SupportAPIService } from "../../api/services/support.api.service";
import { SnackbarMessageService } from "../../shared/services/snackbar.service";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { HttpResponse } from "@angular/common/http";
import { SupportRatingResponse } from "../../api/interfaces/support.interface";
import { SnackbarOption } from "../../shared/enums/snackbar-options.enum";
import { SupportInitEditParams, SupportFeedbackData, SupportTicketData } from "./support-form.interface";
import { CastAbstract2FormControlPipe } from "../../common/pipes/cast-abstract2form-control.pipe";
import { StarRatingComponent } from "../../common/components/star-rating/star-rating.component";
import { FileUploadService } from "../../shared/services/file-upload.service";
import { NavigationService } from "../../shared/services/navigation.service";


@Component({
    selector: 'app-support',
    templateUrl: './support.component.html',
    styleUrl: './support.component.scss',
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        TextInputComponent,
        SelectInputComponent,
        TextareaInputComponent,
        VarDirective,
        StarRatingComponent,
        CastAbstract2FormControlPipe
    ]
})
export class SupportComponent implements OnInit, AfterViewInit, OnDestroy{
    @ViewChild('fileInput') fileInput!: ElementRef;
    @ViewChild('sendBtn') sendBtn!: ElementRef;
    @ViewChild('resetBtn') resetBtn!: ElementRef;

    protected supportForm: FormGroup;
    protected isLoadingResponse: boolean;
    protected ticketOption = SupportOption;
    protected deviceOption = SupportDeviceOption;
    protected messageLength: number;
    protected defaultRatingValue: number;
    protected resetRatingValue: EventEmitter<number>;
    protected ticketOptionIcons: Record<string, string>;
    protected ticketOptionStylings: Record<string, Record<string, any>>;

    private subscriptionHttpObservationSupport$: Subscription;
    private subscriptionHttpObservationFeedback$: Subscription;
    private subscriptionHttpObservationRating$: Subscription;
    private subscriptionHttpObservationError$: Subscription;
    private fileMaxNumberLimit: number;
    private anchor!: HTMLElement;
    private window: any;
    private delay: any;

    constructor(
        private readonly fb: FormBuilder,
        private readonly auth: AuthService,
        private readonly elRef: ElementRef,
        @Inject(DOCUMENT) private document: Document,
        private readonly translate: TranslateService,
        private readonly navigation: NavigationService,
        private readonly supportApi: SupportAPIService,
        private readonly snackbar: SnackbarMessageService,
        private readonly httpObservation: HttpObservationService,
        public fileUpload: FileUploadService
    ) {
        this.supportForm = new FormGroup({});
        this.isLoadingResponse = false;
        this.messageLength = 0;
        this.defaultRatingValue = 5;
        this.resetRatingValue = new EventEmitter<number>();
        this.ticketOptionIcons = {
            [SupportOption.BUG]: 'icon-bug icon-base',
            [SupportOption.FEEDBACK]: 'icon-feedback icon-base',
            [SupportOption.SUPPORT]: 'icon-support icon-base'
        };
        this.ticketOptionStylings = {
            [SupportOption.BUG]: {'color': 'var(--theme-snackbar-error)'},
            [SupportOption.FEEDBACK]: {'color': 'var(--theme-snackbar-warning)'},
            [SupportOption.SUPPORT]: {'color': 'var(--theme-snackbar-info)'},
        }

        this.subscriptionHttpObservationSupport$ = new Subscription();
        this.subscriptionHttpObservationFeedback$ = new Subscription();
        this.subscriptionHttpObservationRating$ = new Subscription();
        this.subscriptionHttpObservationError$ = new Subscription();
        this.fileMaxNumberLimit = 5;
        this.window = this.document.defaultView;
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    ngOnInit() {
        this.anchor = this.elRef.nativeElement.querySelector(".tava-support");
        this.subscriptionHttpObservationRating$ = this.httpObservation.ratingStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setRatingStatus(false);
                    this.isLoadingResponse = false;
                }
            })
        ).subscribe();

        this.subscriptionHttpObservationError$ = this.httpObservation.errorStatus$.pipe(
            filter((x) => x),
            tap(async (response: any) => {
                if(this.auth.getExceptionCollection().includes(response.error.headers.error)) {
                    await this.delay(500);
                    this.httpObservation.setErrorStatus(false);
                }
                this.isLoadingResponse = false;
            })
        ).subscribe();
        this.initEdit();
    }

    ngAfterViewInit() {
        this.handleFileInput();
        this.subscriptionHttpObservationSupport$ = this.httpObservation.supportStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap(async (isStatus200: boolean) => {
                if(isStatus200) {
                    await this.delay(500);
                    this.isLoadingResponse = false;
                    this.httpObservation.setSupportStatus(false);
                    this.reset();
                }
                if(this.sendBtn) {
                    this.setButtonUseStatus(true);
                }
            })
        ).subscribe();

        this.subscriptionHttpObservationFeedback$ = this.httpObservation.feedbackStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap(async (isStatus200: boolean) => {
                if(isStatus200) {
                    await this.delay(500);
                    this.isLoadingResponse = false;
                    this.httpObservation.setFeedbackStatus(false);
                    this.reset();
                }
                if(this.sendBtn) {
                    this.setButtonUseStatus(true);
                }
            })
        ).subscribe();

        this.fileUpload.fileTransfer$.subscribe(data => {
            this.supportForm.get('attachment')?.setValue(data);
        })
    }

    private initForm() {
        this.supportForm = this.fb.group({
            attachment: new FormControl(null, Validators.maxLength(this.fileMaxNumberLimit)),
            userEmail: new FormControl('', [Validators.required, Validators.email]),
            option: new FormControl(null, Validators.required),
            rating: new FormControl(null),
            device: new FormControl(null),
            os: new FormControl(null),
            browser: new FormControl(null),
            title: new FormControl(''),
            message: new FormControl(''),
            termFeedback: new FormControl(null)
        });
    }

    private initEdit(params?: SupportInitEditParams) {
        this.initForm();
        this.supportForm.patchValue({
            attachment: null,
            userEmail: '',
            option: params?.option ? params.option : '',
            rating: this.defaultRatingValue,
            device: this.getPlaceholderByDeviceSuggestion(),
            os: '',
            browser: '',
            title: '',
            message: '',
            termFeedback: true
        });
    }

    private async initRating() {
        this.isLoadingResponse = true;
        this.supportApi.sendRatingRequest().subscribe((data: HttpResponse<SupportRatingResponse>) => {
            if(data.body && data.body.rating_average) {
                this.resetRatingValue.emit(data.body.rating_average);
                this.defaultRatingValue = data.body.rating_average;
            }
            this.isLoadingResponse = false;
        })
    }

    async updateFormOnOptionChange(option: Event) {
        const element = option.currentTarget as HTMLInputElement;
        this.reset();
        this.supportForm.get('option')?.setValue(element.value as SupportOption);
        this.resetValidationsOnOptionChange(element.value as SupportOption);
        if(element.value === this.ticketOption.FEEDBACK) {
            this.messageLength = 1000;
            this.resetRatingAutofill();
            await this.initRating();
        } else {
            this.messageLength = 5000;
            this.supportForm.get('rating')?.setValue(undefined);
        }
    }

    private getPlaceholderByDeviceSuggestion(): string {
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(this.window.navigator.userAgent)) {
            return this.deviceOption.MOBILE;
        } else if(/Chrome/i.test(this.window.navigator.userAgent)) {
            return this.deviceOption.COMPUTER;
        } else {
            return this.deviceOption.OTHER;
        }
    }

    getRatingInput(input: HTMLInputElement) {
        this.supportForm.get('rating')?.setValue(+input);
    }

    getFeedbackTerm(event: Event) {
        const input = event.target as HTMLInputElement;
        this.supportForm.get('termFeedback')?.setValue(input.checked);
    }

    private setButtonUseStatus(isReady: boolean) {
        if(isReady) {
            this.sendBtn.nativeElement.classList.remove('tava-readonly');
            this.resetBtn.nativeElement.classList.remove('tava-readonly');
        } else {
            this.sendBtn.nativeElement.classList.add('tava-readonly');
            this.resetBtn.nativeElement.classList.add('tava-readonly');
        }
    }

    onSubmit() {
        this.supportForm.markAllAsTouched();
        if(this.supportForm.invalid) {
            this.snackbar.notify({
                title: this.translate.instant('validation.frontend.form.check-data'),
                autoClose: true,
                type: SnackbarOption.WARNING,
                displayTime: 2000
            });
            this.navigation.scrollToTop(this.anchor, this.document);
            return;
        }

        this.setButtonUseStatus(false);
        this.isLoadingResponse = true;
        let data: any;
        if(this.supportForm.get('option')?.value === SupportOption.FEEDBACK) {
            data = this.toSupportFeedbackData(this.supportForm.getRawValue());
            this.supportApi.setFeedbackData(data);
            this.supportApi.sendFeedbackRequest().subscribe();
        } else {
            data = this.toSupportTicketData(this.supportForm.getRawValue());
            this.supportApi.setTicketData(data);
            this.supportApi.sendTicketRequest().subscribe();
        }
    }

    private toSupportTicketData(form: any): SupportTicketData {
        return {
            attachment: form.attachment,
            userEmail: form.userEmail,
            option: form.option,
            title: form.title,
            message: form.message,
            device: form.device,
            os: form.os,
            browser: form.browser,
        };
    }

    private toSupportFeedbackData(form: any): SupportFeedbackData {
        return {
            userEmail: form.userEmail,
            option: form.option,
            rating: form.rating,
            termFeedback: form.termFeedback,
            message: form.message
        };
    }

    private handleFileInput() {
        this.fileUpload.setValidations({
            maxNumberOfFiles: this.fileMaxNumberLimit,
            maxSizeEachFileInMB: 1,
            allowedFileTypes: [
                'application/pdf',
                'image/webp',
                'image/jpeg', // .jpe, .jpeg, .jpg, .pjpg, .jfif, .jfif-tbnl, .jif
                'image/png'
            ],
            allowedFileTypeIndicators: [
                'application/',
                'image/'
            ]
        });
    }

    handleFileReset() {
        // Needed to continue processing without stuck files interfering.
        this.fileInput = this.fileUpload.resetInput(this.fileInput);
    }

    private resetValidationsOnOptionChange(option: SupportOption) {
        if(option === SupportOption.FEEDBACK) {
            this.supportForm.get('message')?.clearValidators();
            this.supportForm.get('message')?.setValidators(Validators.maxLength(1000));
            this.supportForm.get('title')?.clearValidators();
            this.supportForm.get('device')?.clearValidators();
            this.supportForm.get('os')?.clearValidators();
            this.supportForm.get('browser')?.clearValidators();
        } else {
            this.supportForm.get('message')?.clearValidators();
            this.supportForm.get('message')?.setValidators([Validators.required, Validators.maxLength(5000)]);
            this.supportForm.get('title')?.setValidators([Validators.required, Validators.maxLength(100)]);
            this.supportForm.get('device')?.setValidators(Validators.maxLength(50));
            this.supportForm.get('os')?.setValidators(Validators.maxLength(100));
            this.supportForm.get('browser')?.setValidators(Validators.maxLength(100));
        }
    }

    private resetRatingAutofill() {
        this.resetRatingValue.emit(this.defaultRatingValue);
        this.supportForm.get('rating')?.setValue(this.defaultRatingValue);
    }

    async reset(loadingProcess: boolean = false) {
        if(loadingProcess) {
            this.isLoadingResponse = true;
            this.initEdit({ option: this.supportForm.get('option')?.value });
            this.resetRatingValue.emit(this.defaultRatingValue);
            this.supportForm.markAsUntouched();
            this.navigation.scrollToTop(this.anchor, this.document);
            await this.delay(750);
            this.isLoadingResponse = false;
        } else {
            this.initEdit();
            this.resetRatingValue.emit(this.defaultRatingValue);
            this.supportForm.markAsUntouched();
        }
    }

    ngOnDestroy() {
        this.subscriptionHttpObservationSupport$.unsubscribe();
        this.subscriptionHttpObservationFeedback$.unsubscribe();
        this.subscriptionHttpObservationRating$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}