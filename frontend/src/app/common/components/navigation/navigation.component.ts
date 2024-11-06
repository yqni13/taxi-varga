import { AfterViewInit, Component, OnInit } from "@angular/core";

@Component({
    selector: 'tava-navigation',
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss',
    standalone: true,
    imports: [
        
    ]
})
export class NavigationComponent implements OnInit, AfterViewInit {

    constructor() {
        //
    }

    ngOnInit() {
        console.log();
    }

    ngAfterViewInit() {
        console.log();
    }
}