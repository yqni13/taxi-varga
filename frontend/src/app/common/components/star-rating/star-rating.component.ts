import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { Observable } from "rxjs";

@Component({
    selector: 'tava-starrating',
    templateUrl: './star-rating.component.html',
    styleUrl: './star-rating.component.scss',
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class StarRatingComponent implements OnInit, OnChanges {

    @ViewChild('star1Ref') star1Ref!: ElementRef;
    @ViewChild('star2Ref') star2Ref!: ElementRef;
    @ViewChild('star3Ref') star3Ref!: ElementRef;
    @ViewChild('star4Ref') star4Ref!: ElementRef;
    @ViewChild('star5Ref') star5Ref!: ElementRef;

    @Input() startValue: number;
    @Input() resetValue: Observable<number>;
    @Output() byChange: EventEmitter<any>;

    protected hasNewRating: boolean;
    protected rawRating: number;

    constructor() {
        this.startValue = 0;
        this.resetValue = new Observable();
        this.byChange = new EventEmitter<any>();
        
        this.hasNewRating = false;
        this.rawRating = this.startValue;
    }

    ngOnInit() {
        this.resetValue.subscribe(change => {
            this.rawRating = change;
            change = this.convertFloat2Int(change);
            switch(change) {
                case(1): {
                    this.star1Ref.nativeElement.checked = true;
                    break;
                }
                case(2): {
                    this.star2Ref.nativeElement.checked = true;
                    break;
                }
                case(3): {
                    this.star3Ref.nativeElement.checked = true;
                    break;
                }
                case(4): {
                    this.star4Ref.nativeElement.checked = true;
                    break;
                }
                case(5):
                default:
                    this.star5Ref.nativeElement.checked = true;
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