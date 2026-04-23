/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { Component, Input, TemplateRef } from "@angular/core";

@Component({
    selector: 'tava-carousel',
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.scss',
    imports: [
        CommonModule
    ],
    host: {
        '(window:keydown)': 'navByKeyInput($event)'
    }
})
export class CarouselComponent {

    @Input() slides: string[];
    @Input() slideTemplate?: TemplateRef<any>;
    @Input() isLoading: boolean;

    protected currentIndex: number;

    constructor() {
        this.slides = [];
        this.isLoading = false;
        this.currentIndex = 0;
    }

    getTransform() {
        return `translateX(${-this.currentIndex * 100}%)`
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    }

    navByKeyInput(event: KeyboardEvent) {
        if(event.key === 'ArrowLeft') {
            this.prev();
        } else if(event.key === 'ArrowRight') {
            this.next();
        }
    }
}