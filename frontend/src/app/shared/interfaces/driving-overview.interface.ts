import { ServiceRoute } from "../../api/routes/service.route.enum";

export interface DrivingServiceBase {
    title: string,
    subtitle: string,
    text: string,
    imgPath: string,
    service: ServiceRoute,
    authorPath: string
}