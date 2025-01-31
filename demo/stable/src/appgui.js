// namespaces
var dwvjq = dwvjq || {};
dwvjq.utils = dwvjq.utils || {};

/**
 * Application GUI.
 */

// Default colour maps.
dwv.luts = {
  plain: dwv.luts.plain,
  invPlain: dwv.luts.invPlain,
  rainbow: dwv.luts.rainbow,
  hot: dwv.luts.hot,
  hot_iron: dwv.luts.hot_iron,
  pet: dwv.luts.pet,
  hot_metal_blue: dwv.luts.hot_metal_blue,
  pet_20step: dwv.luts.pet_20step
};

// Default window level presets.
dwv.defaultpresets = {};
// Default window level presets for CT.
dwv.defaultpresets.CT = {
  mediastinum: {center: 40, width: 400},
  lung: {center: -500, width: 1500},
  bone: {center: 500, width: 2000},
  brain: {center: 40, width: 80},
  head: {center: 90, width: 350}
};

// tool toggle
function toggle(dialogId) {
  if ($(dialogId).dialog('isOpen')) {
    $(dialogId).dialog('close');
  } else {
    $(dialogId).dialog('open');
  }
}

// Toolbox
dwvjq.gui.ToolboxContainer = function (app, infoController) {
  var base = new dwvjq.gui.Toolbox(app);

  this.setup = function (list) {
    base.setup(list);

    // toolbar

    // open
    var openSpan = document.createElement('span');
    openSpan.className = 'ui-icon ui-icon-plus';
    var open = document.createElement('button');
    open.appendChild(openSpan);
    open.title = dwvjq.i18n.t('basics.open');
    open.onclick = function () {
      toggle('#openData');
    };
    // toolbox
    var toolboxSpan = document.createElement('span');
    toolboxSpan.className = 'ui-icon ui-icon-wrench';
    var toolbox = document.createElement('button');
    toolbox.appendChild(toolboxSpan);
    toolbox.title = dwvjq.i18n.t('basics.toolbox');
    toolbox.onclick = function () {
      toggle('#dwv-toolList');
    };
    // history
    var historySpan = document.createElement('span');
    historySpan.className = 'ui-icon ui-icon-clipboard';
    var history = document.createElement('button');
    history.appendChild(historySpan);
    history.title = dwvjq.i18n.t('basics.history');
    history.onclick = function () {
      toggle('#dwv-history');
    };
    // DICOM tags
    var tagsSpan = document.createElement('span');
    tagsSpan.className = 'ui-icon ui-icon-tag';
    var tags = document.createElement('button');
    tags.appendChild(tagsSpan);
    tags.title = dwvjq.i18n.t('basics.dicomTags');
    tags.onclick = function () {
      toggle('#dwv-tags');
    };
    // draw list
    var drawListSpan = document.createElement('span');
    drawListSpan.className = 'ui-icon ui-icon-pencil';
    var drawList = document.createElement('button');
    drawList.appendChild(drawListSpan);
    drawList.title = dwvjq.i18n.t('basics.drawList');
    drawList.onclick = function () {
      toggle('#dwv-drawList');
    };
    // image
    var imageSpan = document.createElement('span');
    imageSpan.className = 'ui-icon ui-icon-image';
    var image = document.createElement('button');
    image.appendChild(imageSpan);
    image.title = dwvjq.i18n.t('basics.image');
    image.onclick = function () {
      toggle('.layerDialog');
    };
    // info
    var infoSpan = document.createElement('span');
    infoSpan.className = 'ui-icon ui-icon-info';
    var info = document.createElement('button');
    info.appendChild(infoSpan);
    info.title = dwvjq.i18n.t('basics.info');
    info.onclick = function () {
      var infoLayer = document.getElementById('infoLayer');
      dwvjq.html.toggleDisplay(infoLayer);
      infoController.toggleListeners();
    };
    // help
    var helpSpan = document.createElement('span');
    helpSpan.className = 'ui-icon ui-icon-help';
    var help = document.createElement('button');
    help.appendChild(helpSpan);
    help.title = dwvjq.i18n.t('basics.help');
    help.onclick = function () {
      toggle('#dwv-help');
    };

    var node = document.getElementById('dwv-toolbar');
    node.appendChild(open);
    node.appendChild(toolbox);
    node.appendChild(history);
    node.appendChild(tags);
    node.appendChild(drawList);
    node.appendChild(image);
    node.appendChild(info);
    node.appendChild(help);

    // apply button style
    $('button').button();
  };

  this.display = function (flag) {
    base.display(flag);
  };
  this.initialise = function () {
    base.initialise();
  };
};

// special setup
dwvjq.gui.setup = function () {
  $('.toggleInfoLayer').button({
    icons: {primary: 'ui-icon-comment'},
    text: false,
    appendTo: '#dwv'
  });
  // create dialogs
  $('#openData').dialog({
    position: {my: 'left top', at: 'left top', of: '#pageMain'},
    appendTo: '#dwv'
  });
  $('#dwv-toolList').dialog({
    position: {my: 'left top+180', at: 'left top', of: '#pageMain'},
    appendTo: '#dwv'
  });
  $('#dwv-history').dialog({
    position: {my: 'left top+350', at: 'left top', of: '#pageMain'},
    appendTo: '#dwv'
  });
  $('#dwv-tags').dialog({
    position: {my: 'right top', at: 'right top', of: '#pageMain'},
    autoOpen: false,
    width: 500,
    height: 590,
    appendTo: '#dwv'
  });
  $('#dwv-drawList').dialog({
    position: {my: 'right top', at: 'right top', of: '#pageMain'},
    autoOpen: false,
    width: 500,
    height: 590,
    appendTo: '#dwv'
  });
  $('#dwv-help').dialog({
    position: {my: 'right top', at: 'right top', of: '#pageMain'},
    autoOpen: false,
    width: 500,
    height: 590,
    appendTo: '#dwv'
  });

  // image dialog
  $('.layerDialog').dialog({
    position: {my: 'left+320 top', at: 'left top', of: '#pageMain'},
    appendTo: '#dwv'
  });
  // default size
  // width: http://api.jqueryui.com/dialog/#option-width
  // "auto" is not documented but has an effect...
  $('.layerDialog').dialog({width: 'auto', resizable: true});
  // Resizable but keep aspect ratio
  // TODO it seems to add a border that bothers getting the cursor position...
  //$("#layerContainer").resizable({ aspectRatio: true });
};
