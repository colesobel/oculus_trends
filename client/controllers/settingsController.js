angular.module('app.settingsController', [])


.controller('settingsController', ['$http', 'auth', 'globalVars', function($http, auth, globalVars) {
  console.log('hi from settings controller')
  jwt = auth.getJwt()
  console.log('jwt: ')
  console.log(jwt)
  console.log('doing bad things...')
  $http.get(globalVars.apiUrl + 'testing').then(resp => {
    console.log('good resp')
  }, error => {
    console.log('bad resp')
  })
}])
