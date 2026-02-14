import { Routes } from "@angular/router";
import { ServiceComponent } from "./service.component";
import { ServiceAirportComponent } from "./request/airport/service-airport.component";
import { ServiceDestinationComponent } from "./request/destination/service-destination.component";
import { ServiceFlatrateComponent } from "./request/flatrate/service-flatrate.component";
import { ServiceRoute } from "../../api/routes/service.route.enum";
import { ServiceGolfComponent } from "./request/golf/service-golf.component";
import { AssetsPreloadGuard } from "../../common/guards/assets-preload.guard";
import { ServiceQuickComponent } from "./request/quick/service-quick.component";

export const serviceRoutes: Routes = [
    {
        path: '',
        component: ServiceComponent,
        canActivate: [AssetsPreloadGuard],
        data: {
            preloadImages: [
                'assets/service/service-airport.webp',
                'assets/service/service-destination.webp',
                'assets/service/service-golf.webp',
                'assets/service/service-flatrate.webp',
                'assets/service/service-quick.webp',
                'assets/UI/google_on_white.png'
            ]
        }
    },
    {
        path: ServiceRoute.AIRPORT,
        component: ServiceAirportComponent
    },
    {
        path: ServiceRoute.DESTINATION,
        component: ServiceDestinationComponent
    },
    {
        path: ServiceRoute.GOLF,
        component: ServiceGolfComponent
    },
    {
        path: ServiceRoute.FLATRATE,
        component: ServiceFlatrateComponent
    },
    {
        path: ServiceRoute.QUICK,
        component: ServiceQuickComponent
    }
]