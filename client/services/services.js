angular.module('app.services', [])

.service('getDate', function() {
  this.getIso = function(date) {
    date = new Date(date).toISOString()
    let matches = date.split('T')[0].toString().match(/(\d{4})-(\d{2})-(\d{2})/)
    return `${matches[2]}-${matches[3]}-${matches[1]}`
  }
})

.service('chartService', ['$http', function($http) {
  this.saveChartPosition = function(chartId, width, height, x, y) {
    // This function saves the size and placement of charts
    console.log(`${chartId}, ${width}, ${height}, ${x}, ${y}`)
    return 'hi from chartservice'
  }
}])


.service('globalVars', ['$http', function() {
  this.apiUrl = 'http://localhost:5000/'
}])


.service('auth', ['$cookies', function($cookies) {
  let authContext = this
  this.getJwt = () => {
    return $cookies.get('jwt')
  }

  this.setJwt = (jwt) => {
    $cookies.put('jwt', jwt)
  }

  this.setAccountInfo = (accountInfo) => {
    authContext.accountInfo = accountInfo
  }

  this.getAccountInfo = () => {
    return authContext.accountInfo
  }

}])

.factory('authInterceptor', ['$q','$state', 'auth', function ($q, $state, auth) {
  return {
    'response': function(response) {
      console.log(response.status)
      return response
    },
    'responseError': function(error) {
      console.log(error)
      if (error.status == 403 & (!error.config.url.includes('db_conn'))) {
        console.log('Unauthorized. Redirecting to login.')
        $state.go('login')
      }
      return error
    },
    'request': function(config) {
      config.headers.jwt = auth.getJwt()
      console.log(config)
      return config
    }
  }
}])
