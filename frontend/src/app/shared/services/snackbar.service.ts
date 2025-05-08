import { Inject, Injectable } from "@angular/core";
import { SnackbarOption } from "../enums/snackbar-options.enum";
import { Subject } from "rxjs";
import { SnackbarMessage } from "../interfaces/snackbar.interface";
import { DOCUMENT } from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class SnackbarMessageService {

    snackbarCollection: SnackbarMessage[];
    subject: Subject<boolean>;
    isActive: boolean;

    constructor(@Inject(DOCUMENT) private document: Document) {
        this.snackbarCollection = [];
        this.subject = new Subject<boolean>();
        this.isActive = false;
    }

    onNotify() {
        this.subject.next(true);
    }

    notify(snackbar: SnackbarMessage) {
        snackbar.type = snackbar.type || SnackbarOption.INFO;

        if(snackbar.title.length === 0) {
            snackbar.title = 'No title selected.'
        }

        if(!snackbar.autoClose) {
            snackbar.displayTime = 0;
        }

        if(snackbar.displayTime === undefined || snackbar.displayTime === 0) {
            snackbar.displayTime = 3000;
        }

        if(snackbar.autoClose) {
            // this.document.body.style.setProperty('': '')
            snackbar.displayHandler = setTimeout(() => this.close(snackbar), snackbar.displayTime);
        }

        this.isActive = true;
        this.snackbarCollection.push(snackbar);
    }

    close(snackbar: SnackbarMessage) {
        const displayedSnackbarIndex = this.snackbarCollection.indexOf(snackbar);
        if(displayedSnackbarIndex !== -1) {
            this.snackbarCollection.splice(displayedSnackbarIndex, 1);
        }
        this.isActive = this.snackbarCollection.length === 0 ? false : true;
    } 
}