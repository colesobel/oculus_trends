import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { GlobalService } from '../services/global.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService, private globalService: GlobalService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let redirectPath = state.url.replace(/\/$/, '').replace(/^\/+/g, '')
    return new Promise((resolve, reject) => {
      if (this.authService.authenticated) {
        resolve(true)
      } else {
        let token = this.authService.getCookie(this.globalService.tokenKey)
        if (token) {
          this.authService.getAccountOverview().then(response => {
            resolve(true)
          })
          .catch(error => {
            this.router.navigate(['login', {redirect: redirectPath}])
            reject(false)
          })
        } else {
          this.router.navigate(['login', {redirect: redirectPath}])
          reject(false)
        }
      }
    })
  }
}
