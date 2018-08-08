angular.module('myApp.draggableDirective', [])

.directive('draggable', function($document) {
  return {
    link: function(scope, element, attr) {
      var startX = 0, startY = 0, x = 0, y = 0;
      element.css({
       position: 'relative',
       border: '1px solid red',
       backgroundColor: 'lightgrey',
       cursor: 'move',
       display: 'block',
       width: '65px'
      });
      element.on('mousedown', function(event) {
        console.log('draggable code running')
        event.preventDefault();
        parent = element.parent()

        startX = event.screenX - x;
        startY = event.screenY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {

        y = event.screenY - startY;
        x = event.screenX - startX;

        parent.css({
          position: 'relative',
          top: y + 'px',
          left:  x + 'px',
        });
      }

      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }
    }
  }
});
