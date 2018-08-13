angular.module('myApp.draggableDirective', [])

.directive('draggable', function($document) {
  return {
    link: function(scope, element, attr) {
      console.log('hello')
      //Draggable Code
      // var startX = 0, startY = 0
      // var x = scope.chartInfo.x * window.outerWidth
      // var y = scope.chartInfo.y * window.outerHeight
      //
      // parent.css({
      //   position: 'relative',
      //   top: y + 'px',
      //   left:  x + 'px',
      // })
      //
      // console.log(`start x ${x}`)
      // console.log(`start y ${y}`)
      //
      //
      // element.on('mousedown', function(event) {
      //
      //   if (!(event.target.tagName === 'rect')) {
      //     return
      //   }
      //
      //   event.preventDefault()
      //   console.log(parent)
      //   console.log(`screenx ${event.screenX}`)
      //   console.log(`screeny ${event.screenY}`)
      //
      //   startX = event.screenX - x;
      //   startY = event.screenY - y;
      //   $document.on('mousemove', drag);
      //   $document.on('mouseup', stopDrag);
      // });
      //
      // function drag(event) {
      //   y = event.screenY - startY
      //   x = event.screenX - startX
      //
      //   console.log(`new x ${x}`)
      //   console.log(`new y ${y}`)
      //
      //   parent.css({
      //     position: 'relative',
      //     top: y + 'px',
      //     left:  x + 'px',
      //   })
      // }
      //
      // function stopDrag() {
      //   $document.off('mousemove', drag)
      //   $document.off('mouseup', stopDrag)
      //   chartService.saveChartPosition(scope.chartInfo.chartId, scope.chartInfo.width, scope.chartInfo.height, x, y)
      // }

      // }
      }
    }

});
