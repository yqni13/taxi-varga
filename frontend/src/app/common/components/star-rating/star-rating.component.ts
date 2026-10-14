import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ChangeDetectionStrategy, viewChild } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { Observable } from "rxjs";

@Component({
    selector: 'tava-starrating',
    imports: [
        CommonModule,
        TranslateModule
    ],
    templateUrl: './star-rating.component.html',
    styleUrl: './star-rating.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class StarRatingComponent implements OnInit, OnChanges {

    private readonly star1Ref = viewChild<ElementRef>('star1Ref');
    private readonly star2Ref = viewChild<ElementRef>('star2Ref');
    private readonly star3Ref = viewChild<ElementRef>('star3Ref');
    private readonly star4Ref = viewChild<ElementRef>('star4Ref');
    private readonly star5Ref = viewChild<ElementRef>('star5Ref');

    @Input() startValue = 0;
    @Input() resetValue: Observable<number>;
    @Output() byChange: EventEmitter<any>;

    protected hasNewRating = false;
    protected rawRating = this.startValue;

    constructor() {
        this.resetValue = new Observable();
        this.byChange = new EventEmitter<any>();
    }

    ngOnInit() {
        this.resetValue.subscribe(change => {
            this.rawRating = change;
            change = this.convertFloat2Int(change);
            switch(change) {
                case(1): {
                    this.star1Ref()?.nativeElement.checked.set(true);
                    break;
                }
                case(2): {
                    this.star2Ref()?.nativeElement.checked.set(true);
                    break;
                }
                case(3): {
                    this.star3Ref()?.nativeElement.checked.set(true);
                    break;
                }
                case(4): {
                    this.star4Ref()?.nativeElement.checked.set(true);
                    break;
                }
                case(5):
                default:
                    this.star5Ref()?.nativeElement.checked.set(true);
            }
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes['startValue']) {
            this.startValue = this.convertFloat2Int(changes['startValue']['currentValue']);
            this.rawRating = changes['startValue']['currentValue'];
        }
    }

    private convertFloat2Int(raw: number) {
        return (raw - Math.floor(raw)) >= 0.5 ? Math.ceil(raw) : Math.floor(raw);
    }

    onChange(event: Event) {
        const input = event.currentTarget as HTMLInputElement;
        this.byChange.emit(input.value);
        this.rawRating = +input.value;
        this.hasNewRating = true;
    }
}