import { Component, ElementRef, Inject, OnInit, Renderer2 } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from './common/components/navigation/navigation.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FooterComponent } from './common/components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    NavigationComponent,
    FooterComponent,
    RouterOutlet
  ],
})
export class AppComponent implements OnInit {

  protected title = 'taxi-varga';

  private scrollAnchor!: HTMLElement;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private readonly elRef: ElementRef,
    private readonly router: Router,
    private readonly renderer2: Renderer2
  ) {
    router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.scrollToTop();
      }
    });

    // this.addGoogleAPIScript();
  }
  
  ngOnInit() {
    this.scrollAnchor = this.elRef.nativeElement.querySelector(".tava-scroll-anchor");
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

  // addGoogleAPIScript() {
  //   return new Promise((resolve, reject) => {
  //     const script = this.renderer2.createElement('script');
  //     script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.GOOGLE_API_KEY}&libraries=places&loading=async&callback=Function.prototype`;
  //     script.type = 'text/javascript';
  //     script.defer = true;
  //     script.async = true;
  //     script.onload = resolve;
  //     script.onerror = reject;
  //     this.renderer2.appendChild(this.document.body, script);
  //   });
  // }
}
