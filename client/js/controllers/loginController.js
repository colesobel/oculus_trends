angular.module('myApp.loginController', [])

.controller('loginController', ['$http', '$state', 'globalVars', function($http, $state, globalVars) {
  let login = this

  this.formMode = 'signup'

  this.submitSignup = () => {
    console.log('signing up')
    console.log(login.signupForm)
    $http.post(globalVars.apiUrl + 'signup', login.signupForm).then(user => {
      console.log('sucsess!')
      console.log(user.data)
    },
    error => {
      console.log('error in request')
    })
  }


  this.submitLogin = () => {
    console.log('submitting login')
    console.log(login.loginForm)
    console.log(globalVars.apiUrl)

    $http.post(globalVars.apiUrl + 'login', login.loginForm).then(user => {
      console.log('the request succeeded')
      console.log(user)
      },
      error => {
        console.log('The request failed')
        console.log(error)
      }
    )
  }





}])
