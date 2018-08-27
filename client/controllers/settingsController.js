angular.module('app.settingsController', [])


.controller('settingsController', ['$state', '$http', '$document', 'globalVars', '$timeout', function($state, $http, $document, globalVars, $timeout) {
  // $http.get(globalVars.apiUrl + 'testing').then(resp => {
  //   console.log('good resp')
  //   console.log(resp)
  // }, error => {
  //   console.log('bad resp')
  // })
  let settings = this

  settings.submitDatabaseConnection = () => {
    console.log(settings.dbInfo)
    $http.post(globalVars.apiUrl + 'db_conn', settings.dbInfo).then(response => {
      if (response.status == 403) {
        console.log('dismissing modal')
        settings.dismissModal()
        $timeout(() => {
          $state.go('login')
        }, 500)

      }

      console.log(response.data)

      settings.dismissModal()
    }, error => {
      console.log(error)
      console.log('error')
      settings.dismissModal()
    })

  }
}])
