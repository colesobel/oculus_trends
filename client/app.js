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
      controllerAs: 'dash'
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


app.run(['auth', '$http', '$rootScope', '$state', '$transitions', 'globalVars', function(auth, $http, $rootScope, $state, $transitions, globalVars) {
  jwt = auth.getJwt()
  if (jwt) {
    $http.get(`${globalVars.apiUrl}startup`).then(response => {
      console.log("successful startup response")
      console.log(response.data)
      if (response.data) {
        auth.setAccountInfo(response.data)
        console.log(auth.getAccountInfo())
      }
    }, error => {
      console.log("error in startup response")
    })
  }

  $transitions.onStart({ to: '**' }, function(trans) {
    // var auth = trans.injector().get('AuthService');
    // if (!auth.isAuthenticated()) {
    //   // User isn't authenticated. Redirect to a new Target State
    //   return trans.router.stateService.target('login');
    // }
    console.log('THE STATE HAS CHANGED')
  });

}])
