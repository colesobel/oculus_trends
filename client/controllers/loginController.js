angular.module('app.loginController', [])

.controller('loginController', ['$http', '$state', '$cookies', 'globalVars', 'userAuth', function($http, $state, $cookies, globalVars, userAuth) {
  let login = this

  this.submitLogin = () => {
    console.log('submitting login')
    console.log(login.loginForm)

    $http.post(globalVars.apiUrl + 'login', login.loginForm).then(user => {
      console.log('login request succeeded')
      console.log(user)
      jwt = user.headers('jwt')
      userAuth.setJwt(jwt)
      $state.go('dash', {'dashId': '1', 'dashName': 'hello'})
      },
      error => {
        console.log('login request failed')
        console.log(error)
      }
    )
  }





}])
