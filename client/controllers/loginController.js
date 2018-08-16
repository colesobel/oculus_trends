angular.module('app.loginController', [])

.controller('loginController', ['$http', '$state', '$cookies', 'globalVars', 'auth', function($http, $state, $cookies, globalVars, auth) {
  let login = this

  this.formMode = 'signup'

  this.submitSignup = () => {
    console.log('signing up')
    console.log(login.signupForm)
    $http.post(globalVars.apiUrl + 'signup', login.signupForm).then(account => {
      console.log(account.data)
      jwt = account.headers('jwt')
      auth.setJwt(jwt)
      $state.go('settings')

    },
    error => {
      console.log('error in request')
    })
  }


  this.submitLogin = () => {
    console.log('submitting login')
    console.log(login.loginForm)

    $http.post(globalVars.apiUrl + 'login', login.loginForm).then(user => {
      console.log('the request succeeded')
      console.log(user)
      jwt = user.headers('jwt')
      auth.setJwt(jwt)
      $state.go('dash')
      },
      error => {
        console.log('The request failed')
        console.log(error)
      }
    )
  }





}])
