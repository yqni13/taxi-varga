import { Component, ElementRef, Inject, OnInit, DOCUMENT } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavigationComponent } from './common/components/navigation/navigation.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { SnackbarComponent } from './common/components/snackbar/snackbar.component';
import { SnackbarMessageService } from './shared/services/snackbar.service';
import { ServiceRoute } from './api/routes/service.route.enum';
import { TokenService } from './shared/services/token.service';
import { NavigationService } from './shared/services/navigation.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	imports: [
		NavigationComponent,
		FooterComponent,
		RouterOutlet,
		SnackbarComponent
	]
})
export class AppComponent implements OnInit {

	protected title = 'taxi-varga';

	private scrollAnchor!: HTMLElement;

	constructor(
		protected readonly snackbarService: SnackbarMessageService,
		private readonly navigation: NavigationService,
		@Inject(DOCUMENT) private document: Document,
		private readonly tokenService: TokenService,
		private readonly elRef: ElementRef,
		private readonly router: Router,
	) {
		this.router.events.subscribe(event => {
			if(event instanceof NavigationEnd) {
				this.navigation.scrollToTop(this.scrollAnchor, this.document);
				// destroy session (token) leaving a service mask
				const servicePaths = Object.values(ServiceRoute) as string[];
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
}
