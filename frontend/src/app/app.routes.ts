import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { AboutComponent } from './modules/about/about.component';
import { ImprintComponent } from './modules/imprint/imprint.component';
import { SamplesComponent } from './modules/samples/samples.component';
import { PrivacyComponent } from './modules/privacy/privacy.component';
import { BaseRoute } from './api/routes/base.route.enum';
import { AssetsPreloadGuard } from './common/guards/assets-preload.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: `/${BaseRoute.HOME}`,
        pathMatch: 'full'
    },
    {
        path: BaseRoute.HOME,
        component: HomeComponent,
        canActivate: [AssetsPreloadGuard],
        data: {
            title: BaseRoute.HOME,
            showInNavbar: true,
            showInFooter: false,
            icon: 'icon-home icon-base',
            preloadImages: [
                'assets/UI/home_profile.webp'
            ],
            preloadVideos: [
                'assets/home-bg-light-trimmed.mp4'
            ]
        }
    },
    {
        path: BaseRoute.ABOUT,
        component: AboutComponent,
        data: {title: BaseRoute.ABOUT, showInNavbar: true, showInFooter: false, icon: 'icon-about icon-base'}
    },
    {
        path: BaseRoute.SERVICE,
        data: {title: BaseRoute.SERVICE, showInNavbar: true, showInFooter: false, icon: 'icon-service icon-base'},
        loadChildren: () => import('./modules/service/service.routes').then(feature => feature.serviceRoutes)
    },
    {
        path: BaseRoute.IMPRINT,
        component: ImprintComponent,
        data: {title: BaseRoute.IMPRINT, showInNavbar: false, showInFooter: true, icon: 'icon-imprint'}
    },
    {
        path: BaseRoute.SAMPLES,
        component: SamplesComponent,
        data: {title: BaseRoute.SAMPLES, showInNavbar: true, showInFooter: false, icon: 'icon-samples icon-base'}
    },
    {
        path: BaseRoute.PRIVACY,
        component: PrivacyComponent,
        data: {title: BaseRoute.PRIVACY, showInNavbar: false, showInFooter: true, icon: 'icon-privacy'}
    },
    {
        path: '**',
        redirectTo: '/home',
    }
];
