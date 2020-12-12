(function(global) {
"use strict";

require('jquery');
require('materialize');
require('velocity');
require('knockout');
require('chart');
require('footerFixed');
require('waitForImages');
require('./fixOverflow.js');
require('./adjust.js');

var animation = require('./animateBinding.js');
var Arena = require('./arena.js');
var ar = new Arena(animation.duration);
ko.applyBindings(ar);

var deckNumber = $('#deck-number');
var deckData = $('#deck-data');
var deckTable = $('#deck-table');

function getHeight() {
  var heightDeckNumber = deckNumber.outerHeight(true);
  var heightDeckData = deckData.outerHeight(true);
  var margin = 20;
  return (heightDeckData - heightDeckNumber - margin) + 'px';
}

$(window).on('adjust', function() {
  setTimeout(function() {
  deckTable.css('height', getHeight());
  }, 0);
});

$('.button-collapse').sideNav();
$('#tabs').tabs();
ar.getCandidatesHero(true);
})((this || 0).self || global);
