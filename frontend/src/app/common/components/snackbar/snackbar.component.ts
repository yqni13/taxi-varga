import { Component, HostListener, Input, OnInit } from "@angular/core";
import { SnackbarMessageService } from "../../../shared/services/snackbar.service";
import { CommonModule } from "@angular/common";
import { SnackbarOption } from "../../../shared/enums/snackbar-options.enum";
import { SnackbarMessage } from "../../../shared/interfaces/snackbar.interface";

@Component({
    selector: 'tava-snackbar',
    templateUrl: './snackbar.component.html',
    styleUrl: './snackbar.component.scss',
    standalone: true,
    imports: [
        CommonModule
    ]
})
export class SnackbarComponent implements OnInit {

    @HostListener('window:keydown', ['$event'])
    closeOnEscape(event: KeyboardEvent) {        
        if(event.key === 'Escape' && this.isActive) {
            this.close();
        }
    }

    @Input() snackbarMsg: SnackbarMessage;
    protected snackbarOptions = SnackbarOption;
    protected snackbarClass: string;
    
    private isActive: boolean;

    constructor(private snackbarService: SnackbarMessageService) {
        this.snackbarMsg = {
            title: '',
            text: '',
            type: '',
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
    }
}