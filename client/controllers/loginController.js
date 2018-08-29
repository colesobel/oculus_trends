angular.module('app.loginController', [])

.controller('loginController', ['$http', '$state', '$cookies', 'globalVars', 'auth', function($http, $state, $cookies, globalVars, auth) {
  let login = this

  this.submitLogin = () => {
    console.log('submitting login')
    console.log(login.loginForm)

    $http.post(globalVars.apiUrl + 'login', login.loginForm).then(user => {
      console.log('login request succeeded')
      console.log(user)
      jwt = user.headers('jwt')
      auth.setJwt(jwt)
      $state.go('dash', {'dashId': '1', 'dashName': 'hello'})
      },
      error => {
        console.log('login request failed')
        console.log(error)
      }
    )
  }





}])
