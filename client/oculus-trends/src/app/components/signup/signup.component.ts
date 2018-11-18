import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'

import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }
  submitted: Boolean = false
  password: string
  passwordConfirm: string

  passwordsMatch() {
    return this.passwordConfirm == this.password
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    console.log(form.value)
    this.authService.submitSignup(form.value).subscribe(
      response => {
        console.log('Success!')
        console.log(response)
        if (response.headers.has('jwt')) {
          let token = response.headers.get('jwt')
          this.authService.login(token, response.body['account_info'])
          this.router.navigate(['app', 'account'])
        } else {
          console.log('no jwt present. Add error handling')
        }

      }, 
      error => {
        console.log(error)
        console.log('There was an error')
      }
    )
  }

}
