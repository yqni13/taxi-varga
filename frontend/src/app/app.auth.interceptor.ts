import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from './shared/services/token.service';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
    const tokenService = inject(TokenService);
    const token = tokenService.getToken();

    if (!token) {
        return next(req);
    }

    const reqClone = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(reqClone);
};