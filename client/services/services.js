angular.module('myApp.services', [])

.service('getDate', function() {
  this.getIso = function(date) {
    date = new Date(date).toISOString()
    let matches = date.split('T')[0].toString().match(/(\d{4})-(\d{2})-(\d{2})/)
    return `${matches[2]}-${matches[3]}-${matches[1]}`
  }
})
