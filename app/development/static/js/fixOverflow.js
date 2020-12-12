(function(global) {
"use strict";

  var isAndroid = window.navigator.userAgent.toLowerCase().indexOf('android') != -1;
  if (isAndroid) $('#deck-table').addClass('android');

})((this || 0).self || global);
