import { Component, Input, OnInit, ChangeDetectionStrategy, inject } from "@angular/core";
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
    changeDetection: ChangeDetectionStrategy.Eager,
    host: {
        '(window:keydown.escape)': 'closeOnEscape()'
    }
})
export class SnackbarComponent implements OnInit {

    private readonly snackbarService = inject(SnackbarMessageService);

    @Input() snackbarMsg: SnackbarMessage;

    protected snackbarOptions = SnackbarOption;
    protected snackbarClass = '';

    private isActive = false;

    constructor() {
        this.snackbarMsg = {
            title: '',
            text: '',
            type: '',
            phone: undefined,
            mail: undefined
        }
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