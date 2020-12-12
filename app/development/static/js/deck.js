(function(global) {
"use strict";

// --- class / interfaces ----------------------------------
function Deck() {
  var self = this;

  function updateStats(card) {
    self.len(self.len() + 1);
    ko.utils.arrayForEach(self.infoKeys, function(item, index) {
      updateCardInfo(item, card);
    });
  }

  function updateCardInfo(info, card) {
    var ci = card[info];
    if (!ci) return;
    var si = self.info[info];
    si[ci](si[ci]() + 1);
  }
  
  self.infoData = {Type: ['Minion', 'Spell', 'Equipment'],
    Race: ['Dragon', 'Mech', 'Demon', 'Pirate', 'Murloc', 'Totem', 'Beast'],
    Rarity: ['Common', 'Free', 'Rare', 'Epic', 'Legendary'],
    Exp: ['Basic', 'Classic', 'Naxxramas', 'GvG', 'Reward', 'Promo']
  };
  self.infoKeys = ['Race', 'Type', 'Rarity', 'Exp'];
  self.cards = ko.observableArray();
  self.cardCount = {};
  self.len = ko.observable(0);
  (function () {
    self.info = {};
    ko.utils.arrayForEach(self.infoKeys, function(item, index) {
      self.info[item] = {};
      ko.utils.arrayForEach(self.infoData[item], function(item2, index) {
        self.info[item][item2] = ko.observable(0);
      });
    });
  })();

  self.cards.sortedPush = function sortedPush(item) {
    var ary = this();
    var num = item.cost, len = ary.length;
    var pivot = Math.floor(len / 2);
    var head = 0, tail = len - 1;

    while ((tail - head) > 0 && ary[pivot].cost != num) {
      if (ary[pivot].cost > num) {
        tail = pivot;
      }
      if (ary[pivot].cost < num) {
        head = pivot + 1;
      }
      pivot = Math.floor(((tail - head) / 2) + head);
    }

    while (len > pivot && ary[pivot].cost <= num) {
      pivot+=1;
    }

    this.splice(pivot, 0, item);
  };

  self.addCard = function addCard(card) {
    updateStats(card);
    var name = card.name;
    if (name in self.cardCount) {
      var cardCount = self.cardCount[name];
      cardCount(cardCount() + 1);
      return;
    }
    self.cardCount[name] = ko.observable(1);
    self.cards.sortedPush(card);
  };
}

// --- exports ---------------------------------------------
module['exports'] = Deck;

})((this || 0).self || global);
