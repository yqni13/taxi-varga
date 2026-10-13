import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export abstract class AbstractApiServiceClass {

    protected isDevEnv = environment.BUILD_MODE.trim() === 'development';
}