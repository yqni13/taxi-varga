import { Routes } from "@angular/router";
import { ServiceComponent } from "./service.component";
import { ServiceAirportComponent } from "./request/airport/service-airport.component";
import { ServiceDestinationComponent } from "./request/destination/service-destination.component";
import { ServiceFlatrateComponent } from "./request/flatrate/service-flatrate.component";

export const serviceRoutes: Routes = [
    {
        path: '',
        component: ServiceComponent,
        
    },
    {
        path: 'airport',
        component: ServiceAirportComponent
    },
    {
        path: 'flatrate',
        component: ServiceFlatrateComponent
    },
    {
        path: 'destination',
        component: ServiceDestinationComponent
    }
]