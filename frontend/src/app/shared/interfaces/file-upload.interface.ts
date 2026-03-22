export interface FileUploadValidations {
    maxSizeEachFileInMB: number,
    maxNumberOfFiles: number,
    allowedFileTypes: string[],
    allowedFileTypeIndicators: string[] // Used to modify types for notification message.
}