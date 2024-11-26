import { Component, OnInit } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'tava-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
    imports: [
        TranslateModule
    ]
})
export class HomeComponent implements OnInit {

    protected selectedVideo: string;

    constructor(private translate: TranslateService) {
        this.selectedVideo = '';
    }

    ngOnInit() {
        this.selectedVideo = 'assets/home-bg-light-trimmed.mp4';
    }
}