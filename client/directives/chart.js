angular.module('myApp.chartDirective', [])

.directive('chart', ['$document', '$timeout', 'chartService', function($document, $timeout, chartService) {
  return {
    restrict: 'E',
    templateUrl: '/partials/chart.html',
    scope: {
      chartInfo: '='
    },
    controller: function($scope, $http) {
      $scope.renderedWidth = $scope.chartInfo.width * window.outerWidth
      $scope.renderedHeight = $scope.chartInfo.height * window.outerHeight

    },
    link: function(scope, element, attrs) {
      let screenWidth = window.outerWidth
      let screenHeight = window.outerHeight
      let parent = element.parent()



      //Resizable Code
      let border = element.children()
      var width = scope.renderedWidth
      var height = scope.renderedHeight
      var psy, psx, xdiff, ydiff
      let borderSize = 10
      let borderMultiplier = borderSize * 2
      // console.log(screen.width)
      // console.log(screen.height)

      border.css({
        width: `${scope.renderedWidth + borderMultiplier}px`,
        height: `${scope.renderedHeigh + borderMultiplier}px`
      })

      border.on('mousedown', function(event) {
        // console.log(event.target)
        if (!event.target.hasAttribute('chart-border')) {
          return
        }
        event.preventDefault()
        psx = event.screenX
        psy = event.screenY
        $document.on('mousemove', resize);
        $document.on('mouseup', stopResize);
      })

      function resize(event) {
        xdiff = event.screenX - psx
        ydiff = event.screenY - psy

        width = width + xdiff
        height = height + ydiff
        // console.log(`width: ${width}`)
        // console.log(`height: ${height}`)

        element.css({
          width: `${width + borderMultiplier}px`,
          height: `${height + borderMultiplier}px`
        })

        scope.$apply(function() {
          scope.renderedWidth = width
          scope.renderedHeight = height
          scope.chartInfo.width = (width / window.outerWidth).toFixed(2)
          scope.chartInfo.height = (height / window.outerHeight).toFixed(2)
          console.log(scope.chartInfo.width)
          console.log(scope.chartInfo.height)
        })

        border.css({
          width: `${width + borderMultiplier}px`,
          height: `${width + borderMultiplier}px`
        })


        psx = event.screenX
        psy = event.screenY

      }

      function stopResize() {
        $document.off('mousemove', resize)
        $document.off('mouseup', stopResize)
        chartService.saveChartPosition(scope.chartInfo.chartId, scope.chartInfo.width, scope.chartInfo.height, x, y)
      }


      //Draggable Code
      var startX = 0, startY = 0
      var x = scope.chartInfo.x * window.outerWidth
      var y = scope.chartInfo.y * window.outerHeight

      parent.css({
        position: 'relative',
        top: y + 'px',
        left:  x + 'px',
      })

      console.log(`start x ${x}`)
      console.log(`start y ${y}`)


      element.on('mousedown', function(event) {

        if (!(event.target.tagName === 'rect')) {
          return
        }

        event.preventDefault()
        console.log(parent)
        console.log(`screenx ${event.screenX}`)
        console.log(`screeny ${event.screenY}`)

        startX = event.screenX - x;
        startY = event.screenY - y;
        $document.on('mousemove', drag);
        $document.on('mouseup', stopDrag);
      });

      function drag(event) {
        y = event.screenY - startY
        x = event.screenX - startX

        console.log(`new x ${x}`)
        console.log(`new y ${y}`)

        parent.css({
          position: 'relative',
          top: y + 'px',
          left:  x + 'px',
        })
      }

      function stopDrag() {
        $document.off('mousemove', drag)
        $document.off('mouseup', stopDrag)
        chartService.saveChartPosition(scope.chartInfo.chartId, scope.chartInfo.width, scope.chartInfo.height, x, y)
      }

    }
  }
}])
