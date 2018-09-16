var app = angular.module('app', [
  'ui.router',
  'ngMaterial',
  // 'chart.js',
  'app.homeController',
  'app.dashController',
  'app.loginController',
  'app.signupController',
  'app.settingsController',
  'app.navDirective',
  'app.modalDirective',
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
      url: '/dash/:dashId/:dashName',
      templateUrl: '/partials/dash.html',
      controller: 'dashController',
      controllerAs: 'dash',
      resolve: {
        _authenticate: ['$injector', function($injector) {
          let userAuth = $injector.get('userAuth')
          userAuth.authenticate(true)
        }]
      }

    })
    .state('login', {
      url: '/login',
      templateUrl: '/partials/login.html',
      controller: 'loginController',
      controllerAs: 'login'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: '/partials/signup.html',
      controller: 'signupController',
      controllerAs: 'signup'
    })
    .state('settings', {
      url: '/settings',
      templateUrl: '/partials/settings.html',
      controller: 'settingsController',
      controllerAs: 'settings',
      resolve: {
        _authenticate: ['$injector', function($injector) {
          let userAuth = $injector.get('userAuth')
          userAuth.authenticate(true)
        }]
      }
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


app.run(['userAuth', '$rootScope', '$state', '$transitions', 'globalVars', function(userAuth, $rootScope, $state, $transitions, globalVars) {
  userAuth.authenticate(false)
}])
