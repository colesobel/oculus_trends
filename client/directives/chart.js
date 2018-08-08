angular.module('myApp.chartDirective', [])

.directive('chart', ['$document', '$timeout', 'chartService', function($document, $timeout, chartService) {
  return {
    restrict: 'E',
    templateUrl: '/partials/chart.html',
    scope: {
      chartInfo: '='
    },
    controller: function($scope, $http) {

    },
    link: function(scope, element, attrs) {
      //Resizable Code
      let screenWidth = screen.width
      let screenHeight = screen.height
      var child = element.children()
      var childWidth = scope.chartInfo.width
      var childHeight = scope.chartInfo.height
      var width = childWidth
      var height = childHeight
      var psy, psx, xdiff, ydiff
      let border = 10
      let borderMultiplier = border * 2
      console.log(screen.width)
      console.log(screen.height)

      child.css({
        width: `${scope.chartInfo.width + borderMultiplier}px`,
        height: `${scope.chartInfo.height + borderMultiplier}px`
      })

      child.on('mousedown', function(event) {
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

        element.css({
          width: `${width + borderMultiplier}px`,
          height: `${height + borderMultiplier}px`
        });
        child.css({
          width: `${scope.chartInfo.width + borderMultiplier}px`,
          height: `${scope.chartInfo.height + borderMultiplier}px`
        })

        scope.$apply(function() {
          scope.chartInfo.width = width
          scope.chartInfo.height = height
        })

        psx = event.screenX
        psy = event.screenY

      }

      function stopResize() {
        $document.off('mousemove', resize)
        $document.off('mouseup', stopResize)
        chartService.saveChartPosition(scope.chartInfo.chartId, width, height, x, y)
      }


      //Draggable Code
      var startX = 0, startY = 0, x = 0, y = 0;
      element.on('mousedown', function(event) {

        if (!(event.target.tagName === 'rect')) {
          return
        }

        event.preventDefault()
        parent = element.parent()

        startX = event.screenX - x;
        startY = event.screenY - y;
        $document.on('mousemove', drag);
        $document.on('mouseup', stopDrag);
      });

      function drag(event) {
        y = event.screenY - startY;
        x = event.screenX - startX;

        parent.css({
          position: 'relative',
          top: y + 'px',
          left:  x + 'px',
        });
      }

      function stopDrag() {
        $document.off('mousemove', drag)
        $document.off('mouseup', stopDrag)
        chartService.saveChartPosition(scope.chartInfo.chartId, width, height, x, y)
      }

    }
  }
}])
