angular.module('app.customNavDirective', [])

.directive('customNav', [function() {
  return {
    restrict: 'E',
    templateUrl: '/partials/customNav.html',
    scope: {
      dashName: '=',
      dashId: '='
    },
    controller: ['$scope', '$http', '$state', '$stateParams', '$timeout', 'userAuth', 'globalVars', function($scope, $http, $state, $stateParams, $timeout, userAuth, globalVars) {
      userAuth.getAccountInfo().then((accountInfo) => {
        $scope.$apply(function() {
          $scope.allDashboards = accountInfo['dashboards']
        })
      })
      $scope.routeParams = $stateParams
      $scope.newDashboard = {}  // For newDashboard form
      $scope.newChart = {}  // For newChart form
      $scope.createChartStateName = 'dash'
      $scope.stateName = $state.current.name

      let dismissModal = (id) => {
        return new Promise((resolve, reject) => {
          angular.element(document.getElementById(id)).modal('hide')
          $timeout(() => {
            resolve()
          }, 250)
        })
      }

      $scope.createNewChart = () => {
        console.log('Creating new chart')
        $http.post(globalVars.apiUrl + 'chart', $scope.newChart).then(dashboard => {

        },
        error => {
          console.log('Error in new chart request')
        })
        dismissModal('chartModal')
      }

      $scope.createNewDashboard = () => {
        console.log('Creating new dashboard')
        $http.post(globalVars.apiUrl + 'dashboard', $scope.newDashboard).then(dashboard => {
          console.log(dashboard)
          let data = dashboard.data
          let userData = data['record']['startup_info']
          userAuth.setAccountInfo(userData)
          $scope.allDashboards = userAuth.getAccountInfo()['dashboards']
          let dash = data['record']['dashboard']

          dismissModal('dashboardModal').then(() => {
            $state.go('dash', {'dashId': dash['id'], 'dashName': dash['url_alias']})
          })

        },
        error => {
          console.log('Error creating dashboard')
          dismissModal('dashboardModal')
        })


      }

      $scope.logOut = () => {
        userAuth.logOut()
      }

    }],

  }
}])
