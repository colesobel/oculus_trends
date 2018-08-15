var app = angular.module('myApp', [
  'ui.router',
  'ngMaterial',
  // 'chart.js',
  'myApp.dashboardController',
  'myApp.loginController',
  'myApp.navDirective',
  'myApp.eventDirective',
  'myApp.draggableDirective',
  'myApp.resizableDirective',
  'myApp.resizeDrag',
  'ng-fusioncharts',
  'myApp.chartDirective',
  'myApp.services',
  'myApp.filters',
  '720kb.datepicker',
  'ngCookies'
])

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/')
  $stateProvider
    .state('dash', {
      url: '/',
      templateUrl: '/partials/dashboard.html',
      controller: 'dashboardController',
      controllerAs: 'dash'
    })
    .state('login', {
      url: '/login',
      templateUrl: '/partials/login.html',
      controller: 'loginController',
      controllerAs: 'login'
    })
    // $locationProvider.html5Mode(true);
}])
