(function(global) {
"use strict";

var gOptions = Chart.defaults.global;
gOptions.responsive = true;
gOptions.scaleShowLabels = false;
gOptions.scaleFontSize = 16;
gOptions.tooltipTemplate = '<%= value %>';
gOptions.animationSteps = 30;

function HSChart() {
  var self = this;
  var limit = 7;
  var data = [0, 0, 0, 0, 0, 0, 0, 0];
  var manaDatas = {
    label: 'Cost',
    fillColor: 'rgba(21,101,192,0.5)',
    strokeColor: 'rgba(13,71,161,0.8)',
    highlightFill: 'rgba(21,101,192,0.75)',
    highlightStroke: 'rgba(13,71,161,1)',
    data: data
  };

  var hpDatas = {
    label: 'Atk',
    fillColor: 'rgba(198,40,40,0.5)',
    strokeColor: 'rgba(183,28,28,0.8)',
    highlightFill: 'rgba(198,40,40,0.75)',
    highlightStroke: 'rgba(183,28,28,1)',
    data: data
  };

  var atkDatas = {
    label: 'Health',
    fillColor: 'rgba(249,168,37,0.5)',
    strokeColor: 'rgba(245,127,23,0.8)',
    highlightFill: 'rgba(249,168,37,0.75)',
    highlightStroke: 'rgba(245,127,23,1)',
    data: data
  };

  function initChart(id, datas) {
    var ctx = $('#' + id).get(0).getContext('2d');
    var data = {
      labels: ['0', '1', '2', '3', '4', '5', '6', '7+'],
      datasets: [datas]
    };
    self[id] = new Chart(ctx).Line(data, {
      scaleShowHorizontalLines: false,
    });
    self[id.replace('curve', 'data')] = self[id].datasets[0].points;
  }

  initChart('manacurve', manaDatas);
  initChart('hpcurve', hpDatas);
  initChart('atkcurve', atkDatas);

  self.update = function update(card) {
    var cc = card.cost;
    var cost = cc > limit ? limit : cc;
    self.manadata[cost].value += 1;
    self.manacurve.update();

    if (card['Type'] == 'Minion') {
      var ca = card.atk;
      var ch = card.hp;
      var atk = ca > limit ? limit : ca;
      var hp = ch > limit ? limit : ch;
      self.atkdata[atk].value += 1;
      self.hpdata[hp].value += 1;
      self.atkcurve.update();
      self.hpcurve.update();
    }
  };

  function reDraw() {
    self.manacurve.resize(self.manacurve.render, true);
    self.atkcurve.resize(self.atkcurve.render, true);
    self.hpcurve.resize(self.hpcurve.render, true);
  }

  $(window).on('adjust', reDraw);
}
module['exports'] = HSChart;
})((this || 0).self || global);
