import { Component, Input, OnInit } from "@angular/core";
import { SnackbarMessageService } from "../../../shared/services/snackbar.service";
import { CommonModule } from "@angular/common";
import { SnackbarOption } from "../../../shared/enums/snackbar-options.enum";
import { SnackbarMessage } from "../../../shared/interfaces/snackbar.interface";

@Component({
    selector: 'tava-snackbar',
    templateUrl: './snackbar.component.html',
    styleUrl: './snackbar.component.scss',
    imports: [
        CommonModule
    ],
    host: {
        '(window:keydown.escape)': 'closeOnEscape()'
    }
})
export class SnackbarComponent implements OnInit {

    @Input() snackbarMsg: SnackbarMessage;
    protected snackbarOptions = SnackbarOption;
    protected snackbarClass: string;

    private isActive: boolean;

    constructor(private snackbarService: SnackbarMessageService) {
        this.snackbarMsg = {
            title: '',
            text: '',
            type: '',
            phone: undefined,
            mail: undefined
        }
        this.snackbarClass = '';
        this.isActive = false;
    }

    getActiveStatus(): boolean {
        return this.isActive;
    }

    ngOnInit() {
        this.snackbarClass = this.snackbarMsg.type || SnackbarOption.INFO;
        this.isActive = true;
    }

    close() {
        this.snackbarService.close(this.snackbarMsg);
        this.isActive = false;
        this.scrollToTop();
    }

    scrollToTop() {
        if(document.scrollingElement !== null) {
            document.scrollingElement.scrollTop = 0;
        }
    }

    closeOnEscape() {        
        if(this.isActive && !this.snackbarMsg.autoClose) {
            this.close();
        }
    }
}