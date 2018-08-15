angular.module('myApp.loginController', [])

.controller('loginController', ['$http', '$state', '$cookies', 'globalVars', function($http, $state, $cookies, globalVars) {
  let login = this

  this.formMode = 'signup'

  this.submitSignup = () => {
    console.log('signing up')
    console.log(login.signupForm)
    $http.post(globalVars.apiUrl + 'signup', login.signupForm).then(account => {
      console.log('success!')
      console.log(account.data)
      jwt = account.headers('jwt')
      $cookies.put('jwt', jwt)
      console.log('cookies put!')


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
