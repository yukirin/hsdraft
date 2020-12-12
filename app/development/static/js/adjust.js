(function(global) {
  "use strict";

  function adjust() {
    var timer = false;

    $(window).resize(function() {
      var self = this;
      if (timer !== false) {
        clearTimeout(timer);
      }
      timer = setTimeout(function() {
        $(self).trigger('adjust');
      }, 200);
    });
  }
  adjust();
})((this || 0).self || global);
