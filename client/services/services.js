angular.module('app.services', [])

.service('globalVars', [function() {
  this.apiUrl = 'http://localhost:5000/'
}])

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


.service('userAuth', ['$http', '$cookies', '$state', 'globalVars', function($http, $cookies, $state, globalVars) {
  let authContext = this
  this.authenticated = false
  this.accountInfo = undefined

  // this.authenticate = (redirect) => {
  //   if (!authContext.authenticated) {
  //     jwt = authContext.getJwt()
  //
  //     if (jwt != undefined) {
  //       $http.get(globalVars.apiUrl + 'startup').then(response => {
  //         console.log(response.data)
  //         if (response.data) {
  //           authContext.setAccountInfo(response.data)
  //           authContext.authenticated = true
  //         }
  //         else {
  //           // No User data found
  //           if (redirect) {
  //             $state.go('login')
  //           }
  //         }
  //       }, error => {
  //         console.log("Authentication did not return 200")
  //         if (redirect) {
  //           $state.go('login')
  //         }
  //       })
  //     } else {
  //       // jwt undefined
  //       if (redirect) {
  //         $state.go('login')
  //       }
  //     }
  //   }
  // }

  this.authenticate = (redirect) => {
    return new Promise((resolve, reject) => {
      if (!authContext.authenticated) {
        jwt = authContext.getJwt()

        if (jwt != undefined) {
          $http.get(globalVars.apiUrl + 'startup').then(response => {
            console.log(response.data)
            if (response.data) {
              authContext.setAccountInfo(response.data)
              authContext.authenticated = true
              resolve()
            } else {
              // No User data found
              if (redirect) {
                $state.go('login')
              }
              resolve()
            }
          }, error => {
            console.log("Authentication did not return 200")
            if (redirect) {
              $state.go('login')
            }
            resolve()
          })
        } else {
          // jwt undefined
          if (redirect) {
            $state.go('login')
          }
          resolve()
        }
      }
    })
  }

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
    return new Promise((resolve, reject) => {
      if (authContext.accountInfo == undefined) {
        authContext.authenticate(false).then(() => {
          resolve(authContext.accountInfo)
        })
      } else {
        resolve(authContext.accountInfo)
      }
    })
  }

  this.logOut = () => {
    $cookies.remove('jwt')
    authContext.accountInfo = undefined
    authContext.authenticated = false
    $state.go('login')
  }
}])

.factory('authInterceptor', ['$q','$state', '$cookies', function ($q, $state, $cookies) {
  return {
    'response': function(response) {
      console.log(response.status)
      return response
    },
    'responseError': function(error) {
      console.log(error)
      if (error.status == 401 && (!error.config.url.includes('db_conn'))) {
        console.log('Unauthorized. Redirecting to login.')
        $state.go('login')
        return $q.reject(error)
      } else {
          return $q.reject(error)
      }

    },
    'request': function(config) {
      config.headers.jwt = $cookies.get('jwt')
      console.log(config)
      return config
    }
  }
}])
