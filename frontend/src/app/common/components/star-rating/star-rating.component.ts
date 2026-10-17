import { CommonModule } from "@angular/common";
import { Component, computed, input, linkedSignal, output, signal } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'tava-starrating',
    imports: [
        CommonModule,
        TranslateModule
    ],
    templateUrl: './star-rating.component.html',
    styleUrl: './star-rating.component.scss',
})
export class StarRatingComponent {

    readonly startValue = input(0);

    readonly byChange = output<number>();

    protected readonly rawRating = linkedSignal(() => this.startValue());
    protected readonly selectedStar = computed(() => Math.round(this.rawRating()));
    
    protected readonly stars: number[] = [1, 2, 3, 4, 5];
    protected readonly hasNewRating = signal(false);

    protected onChange(event: Event) {
        const rating = Number((event.currentTarget as HTMLInputElement).value);
        this.hasNewRating.set(true);
        this.rawRating.set(rating);
        this.byChange.emit(rating);
    }
}