(function(global) {
"use strict";

// --- class / interfaces ----------------------------------
function HSDraft() {
  var self = this;
  var ver = '1';

  function buildUrl(url) {
    return '/api/v' + ver + url;
  }

  function getCandidates(srcUrl, begin, done) {
    begin();
    $.getJSON(buildUrl(srcUrl))
    .done(done)
    .fail(function(jqXhr, status, errorThrown) {
      alert(status + '\n' + errorThrown);
    });
  }

  self.getCandidatesCard = function getCandidatesCard(name, begin, done) {
    getCandidates('/candidates/' + name + '/card', begin, done);
  };

  self.getCandidatesHero = function getCandidatesHero(begin, done) {
    getCandidates('/candidates/hero', begin, done);
  };
}

// --- exports ---------------------------------------------
module["exports"] = HSDraft;
})((this || 0).self || global);
