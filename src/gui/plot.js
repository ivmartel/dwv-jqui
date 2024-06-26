// namespaces
var dwvjq = dwvjq || {};
dwvjq.gui = dwvjq.gui || {};
dwvjq.gui.info = dwvjq.gui.info || {};

/**
 * Plot info layer.
 * @constructor
 * @param {Object} div The HTML element to add colourMap info to.
 * @param {Object} app The associated application.
 */
dwvjq.gui.info.Plot = function (div, app) {
  /**
   * Create the plot info.
   */
  this.create = function () {
    // clean div
    if (div) {
      dwvjq.html.cleanNode(div);
    }
    // plot
    const dataId0 = app.getDataIds()[0];
    plot(div, app.getImage(dataId0).getHistogram());
  };

  /**
   * Update plot.
   * @param {Object} event The windowing change event containing the new values.
   * Warning: expects the plot to exist (use after createPlot).
   */
  this.update = function (event) {
    var wc = event.wc;
    var ww = event.ww;

    var half = parseInt((ww - 1) / 2, 10);
    var center = parseInt(wc - 0.5, 10);
    var min = center - half;
    var max = center + half;

    var markings = [
      {color: '#faa', lineWidth: 1, xaxis: {from: min, to: min}},
      {color: '#aaf', lineWidth: 1, xaxis: {from: max, to: max}}
    ];

    // plot
    const dataId0 = app.getDataIds()[0];
    plot(div, app.getImage(dataId0).getHistogram(), {markings: markings});
  };

  /**
   * Plot some data in a given div using the Flot jquery plugin.
   * @param {Object} div The HTML element to add WindowLevel info to.
   * @param {Array} data The data array to plot.
   * @param {Object} options Plot options.
   */
  function plot(div, data, options) {
    var plotOptions = {
      bars: {show: true},
      grid: {backgroundcolor: null},
      xaxis: {show: true},
      yaxis: {show: false}
    };
    if (
      typeof options !== 'undefined' &&
      typeof options.markings !== 'undefined'
    ) {
      plotOptions.grid.markings = options.markings;
    }
    // call flot
    $.plot(div, [data], plotOptions);
  }
}; // class dwvjq.gui.info.Plot
