import { ElementRef, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { SnackbarMessageService } from "./snackbar.service";
import { SnackbarOption } from "../enums/snackbar-options.enum";
import { FileUploadValidations } from "../interfaces/file-upload.interface";

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {

    private maxSizeEachInBytes: number;
    private maxNumber: number;
    private allowedTypes: string[];
    private allowedTypesIndicators: string[];
    private fileTransfer = new Subject<any>();

    protected selectedFiles: File[];
    fileTransfer$ = this.fileTransfer.asObservable();

    constructor(
        private readonly snackbar: SnackbarMessageService,
    ) {
        this.selectedFiles = [];

        this.maxSizeEachInBytes = 0;
        this.maxNumber = 0;
        this.allowedTypes = [];
        this.allowedTypesIndicators = [];
    }

    selectFiles(event: any) {
        let newFiles: File[] = Array.from(event.target.files);

        newFiles = this.validateMaxNumberOfFiles(newFiles);
        newFiles = this.validateAllowedFileTypes(newFiles);
        newFiles = this.validateMaxSizeOfEachFile(newFiles);

        this.selectedFiles = [
            ...this.selectedFiles,
            ...newFiles
        ];
        this.fileTransfer.next(this.selectedFiles);
    }

    setValidations(validations: FileUploadValidations) {
        this.maxNumber = validations.maxNumberOfFiles;
        this.maxSizeEachInBytes = validations.maxSizeEachFileInMB * 1024 * 1024;
        this.allowedTypes = validations.allowedFileTypes;
        this.allowedTypesIndicators = validations.allowedFileTypeIndicators;
    }

    private validateMaxNumberOfFiles(uncheckedFiles: File[]): File[] {
        // Check if new files are added to existing files.
        const numberOfExistingFiles = this.selectedFiles.length;
        if(uncheckedFiles.length > (this.maxNumber - numberOfExistingFiles)) {
            this.notifyInfo(
                'validation.frontend.file-upload.title.max-number-total',
                `validation.frontend.file-upload.text.max-number-total#maxNumber!${this.maxNumber}`,
            );
            return uncheckedFiles.filter((file, idx) => idx < (this.maxNumber - numberOfExistingFiles));
        }
        return uncheckedFiles;
    }

    private validateMaxSizeOfEachFile(uncheckedFiles: File[]): File[] {
        const checkedFiles: File[] = [];
        uncheckedFiles.forEach((item: File) => {
            if(item.size <= this.maxSizeEachInBytes) {
                checkedFiles.push(item);
            }
        })
        if(checkedFiles.length !== uncheckedFiles.length) {
            this.notifyInfo(
                'validation.frontend.file-upload.title.max-size-each',
                `validation.frontend.file-upload.text.max-size-each#maxSizeEach!${this.maxSizeEachInBytes/1024/1024}`,
            );
        }
        return checkedFiles;
    }

    private validateAllowedFileTypes(uncheckedFiles: File[]): File[] {
        const checkedFiles: File[] = [];
        uncheckedFiles.forEach((item: File) => {
            if(this.allowedTypes.includes(item.type)) {
                checkedFiles.push(item);
            }
        })
        if(checkedFiles.length !== uncheckedFiles.length) {
            // Modify allowedTypes-string to show ".pdf" instead "application/pdf" for easier readability.
            let notificationVal: string = `${this.allowedTypes}`;
            this.allowedTypesIndicators.forEach((indicator: string) => {
                notificationVal = notificationVal.replaceAll(indicator, " .");
            })
            this.notifyInfo(
                'validation.frontend.file-upload.title.allowed-types',
                `validation.frontend.file-upload.text.allowed-types#${notificationVal}`,
            );
        }
        return checkedFiles;
    }

    removeFile(pos: number) {
        this.selectedFiles.splice(pos, 1);
    }

    resetInput(fileInput: ElementRef): ElementRef {
        if(!fileInput?.nativeElement) {
            return fileInput;
        }
        fileInput.nativeElement.value = '';
        fileInput.nativeElement.files = new DataTransfer().files;
        return fileInput;
    }

    private notifyInfo(titlePath: string, textPath: string) {
        this.snackbar.notify({
            title: titlePath,
            text: textPath,
            autoClose: false,
            type: SnackbarOption.INFO
        })
    }
}