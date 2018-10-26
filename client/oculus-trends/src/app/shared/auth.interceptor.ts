import { Injectable } from '@angular/core'
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

import { AuthService } from '../services/auth.service'
import { GlobalService } from '../services/global.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, private globalService: GlobalService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = this.authService.getCookie(this.globalService.tokenKey)
        let newReq: HttpRequest<any>
        if (token) {
            newReq = req.clone({
               headers: req.headers.set('jwt', token)     
            })
        } else {
            newReq = req
        }
        return next.handle(newReq).pipe(tap(
            (response: HttpEvent<any>) => {
                // Do some response handling here
                return response
            }, 
            (error: any) => {
                console.log('Error in Response!')
                if (error instanceof HttpErrorResponse) {
                    console.log(error)
                    if (error.status === 401) {
                        this.authService.logOut()
                    } else if (error.status === 403) {
                        alert('You are not authorized to perform this action.')
                    }
                }
            }
        ))
    }
}

