angular.module('app.navDirective', [])

.directive('navbar', [function() {
  return {
    restrict: 'E',
    templateUrl: '/partials/navbar.html',
    controller: function($scope, $http) {
      let nav = this
      nav.search = function() {
        console.log('search pushed!')
      }
    }
  }
}])
