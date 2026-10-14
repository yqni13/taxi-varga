import { CommonModule } from "@angular/common";
import { Component, TemplateRef, ChangeDetectionStrategy, input } from "@angular/core";

@Component({
    selector: 'tava-carousel',
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.scss',
    imports: [
        CommonModule
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    host: {
        '(window:keydown)': 'navByKeyInput($event)'
    }
})
export class CarouselComponent {

    readonly slides = input.required<string[]>();
    readonly isLoading = input(false);
    protected readonly slideTemplate = input<TemplateRef<any>>();

    protected currentIndex = 0;

    getTransform() {
        return `translateX(${-this.currentIndex * 100}%)`
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.slides().length;
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.slides().length) % this.slides().length;
    }

    navByKeyInput(event: KeyboardEvent) {
        if(event.key === 'ArrowLeft') {
            this.prev();
        } else if(event.key === 'ArrowRight') {
            this.next();
        }
    }
}