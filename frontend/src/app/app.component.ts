import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from './common/components/navigation/navigation.component';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    NavigationComponent,
    RouterOutlet
  ],
})
export class AppComponent implements OnInit {

  protected title = 'taxi-varga';

  private scrollAnchor!: HTMLElement;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private readonly elRef: ElementRef,
    private readonly router: Router
  ) {
    router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.scrollToTop();
      }
    })
  }

  ngOnInit() {
    this.scrollAnchor = this.elRef.nativeElement.querySelector(".tava-scroll-anchor");
    console.log();
  }

  scrollToTop() {
    if(this.scrollAnchor && this.document.scrollingElement !== null) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      HTMLElement.prototype.scrollTo = () => {};
      this.scrollAnchor.scrollTo(0,0);
      // need to kill the y-offset caused by navbar in mobile mode
      this.document.scrollingElement.scrollTop = 0;
    }
  }
}
