import { Component, ElementRef, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
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
	imports: [
		NavigationComponent,
		FooterComponent,
		RouterOutlet,
		SnackbarComponent
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class AppComponent implements OnInit {

	private readonly router = inject(Router);
	private readonly elRef = inject(ElementRef);
	private readonly tokenService = inject(TokenService);
	private readonly navigation = inject(NavigationService);
	protected readonly snackbarService = inject(SnackbarMessageService);

	// TODO(yqni13): check all components for correct changeDetection

	protected title = 'taxi-varga';

	private scrollAnchor!: HTMLElement;

	ngOnInit() {
		this.router.events.subscribe(event => {
			if(event instanceof NavigationEnd) {
				this.navigation.scrollToTop(this.scrollAnchor, document);

				// Destroy session (token) leaving a service mask.
				const servicePaths = Object.values(ServiceRoute) as string[];
				const currentPath = event.url.startsWith('/') ? event.url.replace('/', '') : event.url;
				if(!servicePaths.includes(currentPath)) {
					this.tokenService.removeToken();
				}
			}
		});
		this.scrollAnchor = this.elRef.nativeElement.querySelector(".tava-scroll-anchor");
	}
}
