angular.module('app.filters', [])

.filter('percentage', function () {
  return input => {
    return input < 1 || isNaN(input) ? 0 + '%' : input + '%'
  }
})


.filter('nonsense', function() {
  return input => {
    return 'mothafucka!!'
  }
})


.filter('ratingImage', function() {
  return input => {
    imageMap = {
      0: 'zero_star.png',
      0.5: 'zero_star.png',
      1: 'one_star.png',
      1.5: 'one_half_star.png',
      2: 'two_star.png',
      2.5: 'two_half_star.png',
      3: 'three_star.png',
      3.5: 'three_half_star.png',
      4: 'four_star.png',
      4.5: 'four_half_star.png',
      5: 'five_star.png',
    }
    return imageMap[input]
  }
})