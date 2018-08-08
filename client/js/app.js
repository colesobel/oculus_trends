var app = angular.module('myApp', [
  'ui.router',
  'ngMaterial',
  // 'chart.js',
  'myApp.homeController',
  'myApp.testController',
  'myApp.navDirective',
  'myApp.eventDirective',
  'myApp.draggableDirective',
  'myApp.resizableDirective',
  'myApp.resizeDrag',
  'ng-fusioncharts',
  'myApp.chartDirective',
  'myApp.services',
  'myApp.filters',
  '720kb.datepicker'
])

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/')
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/partials/home.html',
      controller: 'homeController',
      controllerAs: 'home'
    })
    .state('test', {
      url: '/test',
      templateUrl: '/partials/test.html',
      controller: 'testController',
      controllerAs: 'test'
    })
    // $locationProvider.html5Mode(true);
}])
