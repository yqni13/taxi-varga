import { Component, OnInit, ChangeDetectionStrategy, inject, input, signal } from "@angular/core";
import { SnackbarMessageService } from "../../../shared/services/snackbar.service";
import { CommonModule } from "@angular/common";
import { SnackbarOption } from "../../../shared/enums/snackbar-options.enum";
import { SnackbarMessage } from "../../../shared/interfaces/snackbar.interface";

@Component({
    selector: 'tava-snackbar',
    imports: [
        CommonModule
    ],
    templateUrl: './snackbar.component.html',
    styleUrl: './snackbar.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    host: {
        '(window:keydown.escape)': 'closeOnEscape()'
    }
})
export class SnackbarComponent implements OnInit {

    private readonly snackbarService = inject(SnackbarMessageService);

    readonly snackbarMsg = input.required<SnackbarMessage>();

    private readonly isActive = signal(false);

    protected snackbarOptions = SnackbarOption;
    protected snackbarClass = '';

    getActiveStatus(): boolean {
        return this.isActive();
    }

    ngOnInit() {
        this.snackbarClass = this.snackbarMsg().type || SnackbarOption.INFO;
        this.isActive.set(true);
    }

    close() {
        this.snackbarService.close(this.snackbarMsg());
        this.isActive.set(false);
        this.scrollToTop();
    }

    scrollToTop() {
        if(document.scrollingElement !== null) {
            document.scrollingElement.scrollTop = 0;
        }
    }

    closeOnEscape() {        
        if(this.isActive() && !this.snackbarMsg().autoClose) {
            this.close();
        }
    }
}