/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { Component, Input, TemplateRef } from "@angular/core";

@Component({
    selector: 'tava-carousel',
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.scss',
    standalone: true,
    imports: [
        CommonModule
    ]
})
export class CarouselComponent {
    
    @Input() slides: string[];
    @Input() slideTemplate?: TemplateRef<any>;
    
    protected currentIndex: number;

    constructor() {
        this.slides = [];
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
}