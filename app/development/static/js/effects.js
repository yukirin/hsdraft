(function(global) {
"use strict";

var effects = {};
function factoryEffects(name) {
  return function(e, option) {
    return e.velocity(name, $.extend({}, option));
  };
}
effects['slideUp'] = factoryEffects('slideUp');
effects['fadeIn'] = factoryEffects('fadeIn');

// --- exports ---------------------------------------------
module["exports"] = effects;

})((this || 0).self || global);
