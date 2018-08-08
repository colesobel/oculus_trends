angular.module('myApp.resizableDirective', [])

.directive('resizable', function($document) {
  return function(scope, element, attrs) {
    var child = element.children()
    var childWidth = child.prop('offsetWidth')
    var childHeight = child.prop('offsetHeight')
    var width = childWidth
    var height = childHeight
    var psy, psx, xdiff, ydiff
    let border = 10
    let borderMultiplier = border * 2

    element.css({
     border: `${border}px solid green`,
     width: `${childWidth + borderMultiplier}px`,
     height: `${childHeight + borderMultiplier}px`
    });
    element.on('mousedown', function(event) {
      if (!event.target.hasAttribute('resizable')) {
        // Don't add resizable listeners if they haven't clicked specifically
        // on the reziable portion
        return
      }
      event.preventDefault();
      psx = event.screenX
      psy = event.screenY
      $document.on('mousemove', mousemove);
      $document.on('mouseup', mouseup);
    });

    function mousemove(event) {
      xdiff = event.screenX - psx
      ydiff = event.screenY - psy

      width = width + xdiff
      height = height + ydiff

      element.css({
        width: `${width + borderMultiplier}px`,
        height: `${height + borderMultiplier}px`
      });

      child.css({
        width: `${width}px`,
        height: `${height}px`
      });

      psx = event.screenX
      psy = event.screenY

    }

    function mouseup() {
      $document.off('mousemove', mousemove);
      $document.off('mouseup', mouseup);
    }
  };
});
