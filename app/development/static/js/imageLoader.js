(function(global) {
"use strict";

function ImageLoader(begin, complete) {
  var self = this;
  var elemCandidates = $('#candidates-cards');
  var userAgent = window.navigator.userAgent.toLowerCase();
  var isFireFox = userAgent.indexOf('firefox') != -1;

  function getHeight() {
    return elemCandidates.css('height');
  }

  function fixFireFox() {
    var height = parseInt(getHeight()) * 0.999;
    return height + 'px';
  }

  var candidatesHeight = isFireFox ? fixFireFox : getHeight;
  self.load = function load() {
    elemCandidates.css('min-height', candidatesHeight());
    begin();

    elemCandidates.waitForImages()
    .done(function(instance) {
      elemCandidates.css('min-height', '0px');
      complete();
    });
  };
}
module['exports'] = ImageLoader;

})((this || 0).self || global);
