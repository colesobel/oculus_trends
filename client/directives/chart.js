angular.module('app.chartDirective', [])

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
      $scope.refreshIcon = '/images/refresh.png'

    },
    link: function(scope, element, attrs) {
      let screenWidth = window.outerWidth
      let screenHeight = window.outerHeight

      //Resizable Code
      let resizeIcon = element.children()  // Will exit if not resize icon
      var width = scope.renderedWidth
      var height = scope.renderedHeight
      var psy, psx, xdiff, ydiff

      resizeIcon.on('mousedown', function(event) {
        console.log()
        if (! event.target.classList.contains('resize')) {
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

        scope.$apply(function() {
          scope.renderedWidth = width
          scope.renderedHeight = height
          scope.chartInfo.width = (width / screenWidth).toFixed(3)
          scope.chartInfo.height = (height / screenHeight).toFixed(3)
        })

        psx = event.screenX
        psy = event.screenY

      }

      function stopResize() {
        $document.off('mousemove', resize)
        $document.off('mouseup', stopResize)
        chartService.saveChartPosition(scope.chartInfo.chartId, scope.chartInfo.width, scope.chartInfo.height, scope.chartInfo.x, scope.chartInfo.y)
      }



      //Draggable Code
      var startX = 0, startY = 0
      var x = scope.chartInfo.x * screenWidth
      var y = scope.chartInfo.y * screenHeight

      element.css({
        position: 'absolute',
        top: y + 'px',
        left:  x + 'px',
      })

      element.on('mousedown', function(event) {

        if (!(event.target.tagName === 'rect')) {
          return
        }

        event.preventDefault()
        psx = event.screenX
        psy = event.screenY

        $document.on('mousemove', drag);
        $document.on('mouseup', stopDrag);
      });

      function drag(event) {
        xdiff = event.screenX - psx
        ydiff = event.screenY - psy

        x = Math.max((x + xdiff), 0)
        y = Math.max((y + ydiff), 0)


        element.css({
          top: y + 'px',
          left:  x + 'px',
        })

        psx = event.screenX
        psy = event.screenY

          scope.chartInfo.x = (x / screenWidth).toFixed(3)
          scope.chartInfo.y = (y / screenHeight).toFixed(3)

      }

      function stopDrag() {
        $document.off('mousemove', drag)
        $document.off('mouseup', stopDrag)
        chartService.saveChartPosition(scope.chartInfo.chartId, scope.chartInfo.width, scope.chartInfo.height, scope.chartInfo.x, scope.chartInfo.y)
      }

    }
  }
}])
