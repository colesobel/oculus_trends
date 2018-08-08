angular.module('myApp.eventDirective', [])

.directive('event', [function() {
  return {
    restrict: 'E',
    templateUrl: '/partials/event.html',
    scope: {
      eventInfo: '='
    },
    controller: function($scope, $http) {

    }
  }
}])
