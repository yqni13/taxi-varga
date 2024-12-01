import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { AboutComponent } from './modules/about/about.component';
import { ImprintComponent } from './modules/imprint/imprint.component';
import { SamplesComponent } from './modules/samples/samples.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        data: {title: 'home', showInNavbar: true, showInFooter: false, icon: 'icon-home'}
    },
    {
        path: 'about',
        component: AboutComponent,
        data: {title: 'about', showInNavbar: true, showInFooter: false, icon: 'icon-about'}
    },
    {
        path: 'service',
        data: {title: 'service', showInNavbar: true, showInFooter: false, icon: 'icon-service'},
        loadChildren: () => import('./modules/service/service.routes').then(feature => feature.serviceRoutes)
    },
    {
        path: 'imprint',
        component: ImprintComponent,
        data: {title: 'imprint', showInNavbar: false, showInFooter: true, icon: 'icon-imprint'}
    },
    {
        path: 'samples',
        component: SamplesComponent,
        data: {title: 'samples', showInNavbar: true, showInFooter: false, icon: 'icon-samples'}
    },
    // {
    //     path: 'contact',
    //     component: ContactComponent,
    //     data: {title: 'contact', showInNavbar: false, showInFooter: true, icon: 'icon-contact'}
    // },
    // {
    //     path: 'privacy',
    //     component: PrivacyComponent,
    //     data: {title: 'privacy', showInNavbar: false, showInFooter: true, icon: 'icon-privacy'}
    // }
];
