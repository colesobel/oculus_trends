var app = angular.module('app', [
  'ui.router',
  'ngMaterial',
  // 'chart.js',
  'app.homeController',
  'app.dashController',
  'app.loginController',
  'app.settingsController',
  'app.navDirective',
  'ng-fusioncharts',
  'app.chartDirective',
  'app.services',
  'app.filters',
  '720kb.datepicker',
  'ngCookies'
])

app.config(['$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  '$httpProvider',
  '$injector',
  function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $injector) {
  $urlRouterProvider.otherwise('/')
  $stateProvider
    .state('dash', {
      url: '/dash',
      templateUrl: '/partials/dash.html',
      controller: 'dashController',
      controllerAs: 'dash'
    })
    .state('login', {
      url: '/login',
      templateUrl: '/partials/login.html',
      controller: 'loginController',
      controllerAs: 'login'
    })
    .state('settings', {
      url: '/settings',
      templateUrl: '/partials/settings.html',
      controller: 'settingsController',
      controllerAs: 'settings'
    })
    .state('home', {
      url: '/',
      templateUrl: '/partials/home.html',
      controller: 'homeController',
      controllerAs: 'home'
    })
    // $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('authInterceptor')

}])
