angular.module('app.navDashDirective', [])

.directive('navbar', [function() {
  return {
    restrict: 'E',
    templateUrl: '/partials/navDash.html',
    scope: {
      dashName: '=',
      dashId: '='
    },
    controller: function($scope, $http) {

    }
  }
}])
