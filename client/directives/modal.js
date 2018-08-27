angular.module('app.modalDirective', [])

.directive('modal', function() {
   return {
     restrict: 'A',
     link: function(scope, element, attr) {
       console.log('hi from modal')
       console.log(scope)
       scope.settings.dismissModal = function() {
           element.modal('hide');
       }
     }
   }
})
