angular.module('app.customNavDirective', [])

.directive('customNav', [function() {
  return {
    restrict: 'E',
    templateUrl: '/partials/customNav.html',
    scope: {
      dashName: '=',
      dashId: '='
    },
    controller: function($scope, $http) {

    }
  }
}])
