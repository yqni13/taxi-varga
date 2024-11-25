import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'tava-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
    imports: [

    ]
})
export class HomeComponent implements OnInit {

    protected selectedVideo: string;

    constructor() {
        this.selectedVideo = '';
    }

    ngOnInit() {
        this.selectedVideo = 'assets/home-bg-light-trimmed.mp4';
    }
}