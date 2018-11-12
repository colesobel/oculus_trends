angular.module('app.chartController', [])


.controller('chartController', ['$scope', '$state', '$http', '$document', 'globalVars', 'userAuth', function($scope, $state, $http, $document, globalVars, userAuth) {
  $scope.newChart = {}  // Used for new chart form
  $scope.fuckthis = [{
    id: 1,
    name: 'fuck'
  },
  {
    id: 2,
    name: 'this'
  }]

  $scope.$apply(function() {
    $scope.databases = $scope.fuckthis
    $scope.selectedOption = $scope.fuckthis[0]
  })


  console.log($scope.selectedOption)
  // userAuth.getAccountInfo().then((accountInfo) => {
  //   $scope.$apply(() => {
  //     $scope.databases = accountInfo['dbcs']
  //     $scope.selectedOption = $scope.databases[0]
  //   })
  // })

  console.log('hi from chart controller')
}])
