angular.module('myApp.resizeDrag', [])

.directive('resizeDrag', function($document) {
  return {
    templateUrl: '/partials/resizeDragChart.html',
    scope: {
      chartInfo: '='
    },
    controller: function($scope, $timeout) {
      $scope.message = 'hi there'
      $timeout(function() {
        $scope.chartInfo.width = 900
        $scope.chartInfo.height = 600
        console.log('ready')
      }, 5000)
      console.log($scope.chartInfo)
    },
    link: function(scope, element, attrs) {
      console.log('this is the link function')
      console.log(scope)
      element.on('click', function(event) {
        console.log('Youve clicked the element!')
      })
    }
  }
});
