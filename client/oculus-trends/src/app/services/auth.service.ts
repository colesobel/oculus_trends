import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'
import { Subject } from 'rxjs'

import { GlobalService } from './global.service';
import { CookieService } from 'ngx-cookie-service';
import { LoginFormInterface } from '../models/login-form.model';
import { SignupFormInterface } from '../models/signup-form.model';
import { AccountOverviewInterface, DashboardInterface } from '../models/account-overview.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticated: Boolean = false
  initializationComplete: Boolean = false
  accountOverview = null
  accountOverviewChanged = new Subject<object>()

  constructor(
    private http: HttpClient, 
    private injector: Injector,
    private globalService: GlobalService, 
    private cookieService: CookieService
  ) {}

  fireAccountOverviewSubject() {
    this.accountOverviewChanged.next(this.accountOverview)
  }

  updateDbcs(dbcs) {
    // todo try JSON.parse(JSON.stringify(a))
    this.accountOverview.dbcs = dbcs
    this.fireAccountOverviewSubject()
  }

  addToDbcs(dbc) {
    this.accountOverview.dbcs.push(dbc)
    this.fireAccountOverviewSubject()
  }

  updateDashboards(dashboard: DashboardInterface) {
    this.accountOverview.dashboards.push(dashboard)
    console.log(this.accountOverview)
  }
  
  submitLogin(formData: LoginFormInterface) {
    return this.http.post(
      this.globalService.apiUrl + 'login', 
      formData, 
      {observe: 'response'}
    )
  }

  toAccountOverview(overview: object): AccountOverviewInterface {
    return {
      firstName: overview['first_name'], 
      userId: overview['user_id'], 
      accountName: overview['account_name'], 
      accountId: overview['account_id'], 
      roleId: overview['role_id'],
      dashboards: overview['dashboards'], 
      dbcs: overview['dbcs']
    }
  }

  login(token: string, accountOverview: AccountOverviewInterface) {
    this.setCookie(this.globalService.tokenKey, token)
    this.accountOverview = this.toAccountOverview(accountOverview)
    this.authenticated = true
  }

  logOut() {
    let router = this.injector.get(Router)
    this.accountOverview = null
    this.removeCookie(this.globalService.tokenKey)
    this.authenticated = false
    router.navigate(['login'])
  }

  submitSignup(formData: SignupFormInterface) {
    return this.http.post(
      this.globalService.apiUrl + 'signup', 
      formData, 
      {observe: 'response'}
    )
  }

  getCookie(key) {
    return this.cookieService.get(key)
  }

  setCookie(key, value) {
    this.removeCookie(key)
    this.cookieService.set(key, value, null, '/')
  }

  removeCookie(key) {
    this.cookieService.delete(key, '/')
  }

  getAccountOverview(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.get(this.globalService.apiUrl + 'startup', {observe: 'response'}).subscribe(response => {
        this.accountOverview = this.toAccountOverview(response.body)
        console.log(this.accountOverview)
        this.authenticated = true
        this.fireAccountOverviewSubject()
        resolve(true)
      }, 
      error => {
        reject(false)
      })
    }) 
  }

  getUsersForAccount() {
    return new Promise((resolve, reject) => {
      let accountId = this.accountOverview.accountId
      this.http.get(this.globalService.apiUrl + 'users', {observe: 'response'}).subscribe(response => {
        console.log(response)
        resolve(response.body)
      }, 
      error => {
        console.log('there was an error getting users')
        console.log(error)
        reject(error)
      })
    })
    
  }

}