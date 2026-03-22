import { Injectable } from "@angular/core";
import { SnackbarOption } from "../enums/snackbar-options.enum";
import { Subject } from "rxjs";
import { SnackbarMessage } from "../interfaces/snackbar.interface";
import { CustomTranslateService } from "./custom-translate.service";

@Injectable({
    providedIn: 'root'
})
export class SnackbarMessageService {

    snackbarCollection: SnackbarMessage[];
    subject: Subject<boolean>;
    isActive: boolean;

    constructor(
        private readonly customTranslate: CustomTranslateService
    ) {
        this.snackbarCollection = [];
        this.subject = new Subject<boolean>();
        this.isActive = false;
    }

    onNotify() {
        this.subject.next(true);
    }

    notify(snackbar: SnackbarMessage) {
        snackbar.type = snackbar.type || SnackbarOption.INFO;

        snackbar.title = this.customTranslate.apply(snackbar.title);
        if(snackbar.text) {
            snackbar.text = this.customTranslate.apply(snackbar.text);
        }

        if(!snackbar.autoClose) {
            snackbar.displayTime = 0;
        }

        if(snackbar.displayTime === undefined || snackbar.displayTime === 0) {
            snackbar.displayTime = 3000;
        }

        if(snackbar.autoClose) {
            snackbar.displayHandler = setTimeout(() => this.close(snackbar), snackbar.displayTime);
        }

        this.isActive = true;
        // Avoid redundant display of same error multiple times.
        if(!this.snackbarCollection.find((entry) => entry.title === snackbar.title && entry?.text === snackbar?.text)) {
            this.snackbarCollection.push(snackbar);
        }
    }

    close(snackbar: SnackbarMessage) {
        const displayedSnackbarIndex = this.snackbarCollection.indexOf(snackbar);
        if(displayedSnackbarIndex !== -1) {
            this.snackbarCollection.splice(displayedSnackbarIndex, 1);
        }
        this.isActive = this.snackbarCollection.length === 0 ? false : true;
    }
}