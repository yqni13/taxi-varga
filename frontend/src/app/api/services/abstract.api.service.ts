import { inject, Injectable } from "@angular/core";
import { UtilsService } from "../../shared/services/utils.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export abstract class AbstractApiServiceClass {

    protected readonly http = inject(HttpClient);
    protected readonly utils = inject(UtilsService);

    protected isDevEnv = this.utils.isDeveloperEnvironment();
}