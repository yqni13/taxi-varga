/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse, HttpStatusCode } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";

export function appHttpInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    return next(req).pipe(
        tap((httpEvent) => {
            if((httpEvent as HttpResponse<any>).status === HttpStatusCode.Ok) {
                // const httpbody = (httpEvent as HttpResponse<any>);
                // if(httpbody.body.title && httpbody.body.text) {

                // }
                console.log('successful communication!');
            }
        }),
        catchError((response) => {
            console.log('response: ', response);
            if(response.status === 500 || response.status === 535) {
                console.log('snackbar?');
            }
            return of(response);
        })
    )
}