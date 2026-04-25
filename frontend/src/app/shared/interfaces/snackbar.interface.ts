export interface SnackbarMessage {
    title: string,
    text?: string,
    phone?: string,
    mail?: string,
    autoClose?: boolean,
    type: string,
    displayTime?: number,
    displayHandler?: any,
}