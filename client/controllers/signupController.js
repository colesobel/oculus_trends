angular.module('app.signupController', [])

.controller('signupController', ['$http', '$state', '$cookies', 'globalVars', 'auth', function($http, $state, $cookies, globalVars, auth) {
  let signup = this

  this.submitSignup = () => {
    console.log('signing up')
    console.log(signup.signupForm)
    $http.post(globalVars.apiUrl + 'signup', signup.signupForm).then(account => {
      console.log(account.data)
      jwt = account.headers('jwt')
      auth.setJwt(jwt)
      $state.go('settings')

    },
    error => {
      console.log('error in request')
    })
  }
}])
