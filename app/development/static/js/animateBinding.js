(function(global) {
"use strict";

var effects = require('./effects.js');

//cubic-bezier
var swiftOut = [0.55, 0, 0.1, 1];

var options = {
  delay: 0,
  duration: 300,
  easing: swiftOut
};

ko.bindingHandlers.animateVisible = {
  init: function(e, valueAccessor, binding, vm, context) {
    var hide = binding.get('init') || false;
    binding.options = {};
    binding.options.duration = binding.get('duration') || options.duration;
    binding.options.delay = binding.get('delay') || options.delay;
    binding.options.easing = binding.get('easing') || options.easing;
    binding.effect = effects[binding.get('animation')];
    if (hide) $(e).hide();
  },

  update: function(e, valueAccessor, binding, vm, context) {
    var value = ko.unwrap(valueAccessor());
    if (value) binding.effect($(e), binding.options);
  }
};

module['exports'] = options;

})((this || 0).self || global);
