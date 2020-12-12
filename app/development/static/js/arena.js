(function(global) {
"use strict";

// --- class / interfaces ----------------------------------
function Arena(delay) {
  var Deck = require('./deck.js');
  var HsChart = require('./hschart.js');
  var ImageLoader = require('./imageLoader');
  var HSDraft = require('./service/hsdraft.js');

  var hsDraft = new HSDraft();
  var deck = new Deck();
  var hsChart = new HsChart();
  var imageLoader = new ImageLoader(function() {
    for (var i = 0; i < 3; i++) {
      rawCandidates[i](candidateCards[i]);
    }
  }, function() {
    self.doneFadeOut(false);
    self.getSuccessful(false);
    self.cardShown(true);
  });

  var self = this;
  var dummyData = {
    name: '', cardimage: '/static/img/heroes/dummy.png',
    iconimage: '/static/img/heroes/dummy.png'
  };

  self.deck = deck;
  self.cardShown = ko.observable(false);
  self.hero = ko.observable(dummyData);
  self.completed = ko.observable(false);
  self.doneFadeOut = ko.observable(false);
  self.getSuccessful = ko.observable(false);
  self.candidates = ko.observableArray([
    ko.observable(dummyData), ko.observable(dummyData), ko.observable(dummyData)
  ]);

  var rawCandidates = self.candidates();
  var candidateCards = [];

  ko.computed(function() {
    if (self.doneFadeOut() && self.getSuccessful()) imageLoader.load();
  });

  self.info = ko.computed(function() {
    if (self.completed()) return "Your Deck is Complete!";
    if (self.hero().name) return "Choose a Card";
    return "Choose your Hero";
  });

  self.deckBuilderUrl = ko.computed(function() {
    if (!self.completed()) return '';
    var cardCount = deck.cardCount;
    var hearthPwnUrl =
      'http://www.hearthpwn.com/deckbuilder/' + self.hero.peek().name.toLowerCase() + '#';
    var deckCards = ko.utils.arrayMap(deck.cards.peek(), function(item) {
      return item.cardimage.match(/\d+/)[0] + ':' + cardCount[item.name].peek();
    }).join(';');
    return hearthPwnUrl + deckCards + ';';
  });

  var done = function(json) {
    candidateCards = json.candidates;
    self.getSuccessful(true);
  };

  var begin = function(noDelay) {
    return function() {
      setTimeout(function() { self.doneFadeOut(true); }, noDelay ? 0 : delay);
    };
  };

  self.getCandidatesCard = function getCandidatesCard() {
    hsDraft.getCandidatesCard(self.hero().name, begin(), done);
  };

  self.getCandidatesHero = function getCandidateshero(noDelay) {
    hsDraft.getCandidatesHero(begin(), done);
  };

  self.update = function update() {
    if (!self.cardShown()) return; //prevent double click
    self.cardShown(false);
    if (!self.hero().name) {
      self.hero(this);
      setTimeout(function() {
        $(window).trigger('adjust');
      }, 50);
      self.getCandidatesCard();
      return;
    }
    deck.addCard(this);
    hsChart.update(this);
    if (deck.len() < 30) {
      self.getCandidatesCard();
      return;
    }
    self.completed(true);
  };

  self.shuffle = function shuffle() {
    if (!self.cardShown()) return;
    self.cardShown(false);
    self.getCandidatesHero();
  };
}
// --- exports ---------------------------------------------
module['exports'] = Arena;
})((this || 0).self || global);
