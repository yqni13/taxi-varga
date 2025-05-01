import { Routes } from "@angular/router";
import { ServiceComponent } from "./service.component";
import { ServiceAirportComponent } from "./request/airport/service-airport.component";
import { ServiceDestinationComponent } from "./request/destination/service-destination.component";
import { ServiceFlatrateComponent } from "./request/flatrate/service-flatrate.component";
import { ServiceOptions } from "../../shared/enums/service-options.enum";
import { ServiceGolfComponent } from "./request/golf/service-golf.component";

export const serviceRoutes: Routes = [
    {
        path: '',
        component: ServiceComponent,
        
    },
    {
        path: ServiceOptions.AIRPORT,
        component: ServiceAirportComponent
    },
    {
        path: ServiceOptions.DESTINATION,
        component: ServiceDestinationComponent
    },
    {
        path: ServiceOptions.GOLF,
        component: ServiceGolfComponent
    },
    {
        path: ServiceOptions.FLATRATE,
        component: ServiceFlatrateComponent
    }
]