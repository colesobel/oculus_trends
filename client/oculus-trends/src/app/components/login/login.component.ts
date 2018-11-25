// import {MatTooltipModule} from '@angular/material/tooltip'
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'

import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  submitted: Boolean = false
  invalidCreds: Boolean = false
  serverError: Boolean = false
  redirectPath: string[]

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if (this.activatedRoute.snapshot.params['redirect']) {
      let path = this.activatedRoute.snapshot.params['redirect'].split('/')
      this.redirectPath = path
    }
  }

  onSubmit(form: NgForm) {
    this.submitted = true
    this.authService.submitLogin(form.value).subscribe(response => {
      if (response.headers.has('jwt')) {
        let token = response.headers.get('jwt')
        this.authService.login(token, response.body['account_info'])
        if (this.redirectPath) {
          this.router.navigate(this.redirectPath)
        } else {
          this.router.navigate(['app', 'dashboards'])  
        }
      }
      this.submitted = false
      }, 
      error => {
        if (error.status === 401) {
          this.serverError = false
          this.invalidCreds = true
        } else {
          this.serverError = true
        }
        this.submitted = false
      }
    )
  
  }
}
