angular.module('app.settingsController', [])


.controller('settingsController', ['$scope', '$state', '$http', '$document', 'globalVars', '$timeout', function($scope, $state, $http, $document, globalVars, $timeout) {
  let settings = $scope

  let dismissModal = (id) => {
    angular.element(document.getElementById(id)).modal('hide')
  }

  settings.submitDatabaseConnection = () => {
    console.log(settings.dbInfo)
    $http.post(globalVars.apiUrl + 'db_conn', settings.dbInfo).then(response => {
      if (response.status == 403) {
        dismissModal('dbConnectionModal')
        $timeout(() => {
          $state.go('login')
        }, 300)

      }

      console.log(response.data)

      dismissModal('dbConnectionModal')
    }, error => {
      console.log(error)
      console.log('error')
      dismissModal('dbConnectionModal')
    })

  }
}])
