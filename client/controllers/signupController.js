angular.module('app.signupController', [])

.controller('signupController', ['$http', '$state', '$cookies', 'globalVars', 'userAuth', function($http, $state, $cookies, globalVars, userAuth) {
  let signup = this

  this.submitSignup = () => {
    console.log('signing up')
    console.log(signup.signupForm)
    $http.post(globalVars.apiUrl + 'signup', signup.signupForm).then(account => {
      console.log(account.data)
      jwt = account.headers('jwt')
      userAuth.setJwt(jwt)
      $state.go('settings')
    },
    error => {
      console.log('error in request')
    })
  }
}])
