import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from './common/components/navigation/navigation.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FooterComponent } from './common/components/footer/footer.component';
import { SnackbarComponent } from './common/components/snackbar/snackbar.component';
import { SnackbarMessageService } from './shared/services/snackbar.service';
import { ServiceOptions } from './shared/enums/service-options.enum';
import { TokenService } from './shared/services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    NavigationComponent,
    FooterComponent,
    RouterOutlet,
    SnackbarComponent
  ],
})
export class AppComponent implements OnInit {

  protected title = 'taxi-varga';

  private scrollAnchor!: HTMLElement;

  constructor(
    protected readonly snackbarService: SnackbarMessageService,
    @Inject(DOCUMENT) private document: Document,
    private readonly tokenService: TokenService,
    private readonly elRef: ElementRef,
    private readonly router: Router,
  ) {
    router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.scrollToTop();

        // destroy session (token) leaving a service mask
        const servicePaths = Object.values(ServiceOptions) as string[];
        const currentPath = event.url.startsWith('/') ? event.url.replace('/', '') : event.url;
        if(!servicePaths.includes(currentPath)) {
          this.tokenService.removeToken();
        }
      }
    });
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
}
