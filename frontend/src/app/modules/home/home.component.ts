import { Component, OnInit } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import * as translateContent from "../../../../public/assets/i18n/en.json";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'tava-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class HomeComponent implements OnInit {

    protected selectedVideo: string;
    protected homeContentLength: number;

    constructor(private translate: TranslateService) {
        this.selectedVideo = '';
        this.homeContentLength = Object.keys(translateContent["modules"]["home"]["content"]).length;
    }

    ngOnInit() {
        this.selectedVideo = 'assets/home-bg-light-trimmed.mp4';
    }
}