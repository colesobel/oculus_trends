angular.module('myApp.navDirective', [])

.directive('navbar', [function() {
  return {
    restrict: 'E',
    templateUrl: '/partials/navbar.html',
    controller: function($scope, $http) {
      let nav = this
      $("#datepicker").datepicker();
      $("#datepicker2").datepicker();
      nav.search = function() {
        console.log('search pushed!')
      }
    }
  }
}])
