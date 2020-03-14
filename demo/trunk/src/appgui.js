// namespaces
var dwvjq = dwvjq || {};
dwvjq.utils = dwvjq.utils || {};

/**
 * Application GUI.
 */

// Default colour maps.
dwv.tool.colourMaps = {
    "plain": dwv.image.lut.plain,
    "invplain": dwv.image.lut.invPlain,
    "rainbow": dwv.image.lut.rainbow,
    "hot": dwv.image.lut.hot,
    "hotiron": dwv.image.lut.hot_iron,
    "pet": dwv.image.lut.pet,
    "hotmetalblue": dwv.image.lut.hot_metal_blue,
    "pet20step": dwv.image.lut.pet_20step
};
// Default window level presets.
dwv.tool.defaultpresets = {};
// Default window level presets for CT.
dwv.tool.defaultpresets.CT = {
    "mediastinum": {"center": 40, "width": 400},
    "lung": {"center": -500, "width": 1500},
    "bone": {"center": 500, "width": 2000},
    "brain": {"center": 40, "width": 80},
    "head": {"center": 90, "width": 350}
};

// dwv overrides -------------------------

// prompt
dwv.gui.prompt = dwvjq.gui.prompt;
// get element
dwv.gui.getElement = dwvjq.gui.getElement;

// [end] dwv overrides -------------------------

// tool toggle
function toggle(dialogId)
{
    if( $(dialogId).dialog('isOpen') ) {
        $(dialogId).dialog('close');
    }
    else {
        $(dialogId).dialog('open');
    }
}

// Toolbox
dwvjq.gui.ToolboxContainer = function (app, infoController)
{
    var base = new dwvjq.gui.Toolbox(app);

    this.setup = function (list)
    {
        base.setup(list);

        // toolbar

        // open
        var openSpan = document.createElement("span");
        openSpan.className = "ui-icon ui-icon-plus";
        var open = document.createElement("button");
        open.appendChild(openSpan);
        open.title = dwv.i18n("basics.open");
        open.onclick = function() { toggle(".openData"); };
        // toolbox
        var toolboxSpan = document.createElement("span");
        toolboxSpan.className = "ui-icon ui-icon-wrench";
        var toolbox = document.createElement("button");
        toolbox.appendChild(toolboxSpan);
        toolbox.title = dwv.i18n("basics.toolbox");
        toolbox.onclick = function() { toggle(".toolList"); };
        // history
        var historySpan = document.createElement("span");
        historySpan.className = "ui-icon ui-icon-clipboard";
        var history = document.createElement("button");
        history.appendChild(historySpan);
        history.title = dwv.i18n("basics.history");
        history.onclick = function() { toggle(".history"); };
        // DICOM tags
        var tagsSpan = document.createElement("span");
        tagsSpan.className = "ui-icon ui-icon-tag";
        var tags = document.createElement("button");
        tags.appendChild(tagsSpan);
        tags.title = dwv.i18n("basics.dicomTags");
        tags.onclick = function() { toggle(".tags"); };
        // draw list
        var drawListSpan = document.createElement("span");
        drawListSpan.className = "ui-icon ui-icon-pencil";
        var drawList = document.createElement("button");
        drawList.appendChild(drawListSpan);
        drawList.title = dwv.i18n("basics.drawList");
        drawList.onclick = function() { toggle(".drawList"); };
        // image
        var imageSpan = document.createElement("span");
        imageSpan.className = "ui-icon ui-icon-image";
        var image = document.createElement("button");
        image.appendChild(imageSpan);
        image.title = dwv.i18n("basics.image");
        image.onclick = function() { toggle(".layerDialog"); };
        // info
        var infoSpan = document.createElement("span");
        infoSpan.className = "ui-icon ui-icon-info";
        var info = document.createElement("button");
        info.appendChild(infoSpan);
        info.title = dwv.i18n("basics.info");
        info.onclick = function() {
            var infoLayer = app.getElement("infoLayer");
            dwvjq.html.toggleDisplay(infoLayer);
            infoController.toggleListeners();
        };
        // help
        var helpSpan = document.createElement("span");
        helpSpan.className = "ui-icon ui-icon-help";
        var help = document.createElement("button");
        help.appendChild(helpSpan);
        help.title = dwv.i18n("basics.help");
        help.onclick = function() { toggle(".help"); };

        var node = app.getElement("toolbar");
        node.appendChild(open);
        node.appendChild(toolbox);
        node.appendChild(history);
        node.appendChild(tags);
        node.appendChild(drawList);
        node.appendChild(image);
        node.appendChild(info);
        node.appendChild(help);

        // apply button style
        $("button").button();

        // save state button
        var saveButton = document.createElement("button");
        saveButton.appendChild(document.createTextNode(dwv.i18n("basics.downloadState")));
        // save state link
        var toggleSaveState = document.createElement("a");
        toggleSaveState.onclick = function () {
            var blob = new Blob([app.getState()], {type: 'application/json'});
            toggleSaveState.href = window.URL.createObjectURL(blob);
        };
        toggleSaveState.download = "state.json";
        toggleSaveState.id = "download-state";
        toggleSaveState.className += "download-state";
        toggleSaveState.appendChild(saveButton);
        // add to openData window
        node = app.getElement("openData");
        node.appendChild(toggleSaveState);
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
    $(".toggleInfoLayer").button({ icons:
        { primary: "ui-icon-comment" }, text: false,
        appendTo: "#dwv"
    });
    // create dialogs
    $(".openData").dialog({ position:
        {my: "left top", at: "left top", of: "#pageMain"},
        appendTo: "#dwv"
    });
    $(".toolList").dialog({ position:
        {my: "left top+180", at: "left top", of: "#pageMain"},
        appendTo: "#dwv"
    });
    $(".history").dialog({ position:
        {my: "left top+350", at: "left top", of: "#pageMain"},
        appendTo: "#dwv"
    });
    $(".tags").dialog({ position:
        {my: "right top", at: "right top", of: "#pageMain"},
        autoOpen: false, width: 500, height: 590,
        appendTo: "#dwv"
    });
    $(".drawList").dialog({ position:
        {my: "right top", at: "right top", of: "#pageMain"},
        autoOpen: false, width: 500, height: 590,
        appendTo: "#dwv"
    });
    $(".help").dialog({ position:
        {my: "right top", at: "right top", of: "#pageMain"},
        autoOpen: false, width: 500, height: 590,
        appendTo: "#dwv"
    });

    // image dialog
    $(".layerDialog").dialog({ position:
        {my: "left+320 top", at: "left top", of: "#pageMain"},
        appendTo: "#dwv"
    });
    // default size
    // width: http://api.jqueryui.com/dialog/#option-width
    // "auto" is not documented but has an effect...
    $(".layerDialog").dialog({ width: "auto", resizable: true });
    // Resizable but keep aspect ratio
    // TODO it seems to add a border that bothers getting the cursor position...
    //$("#layerContainer").resizable({ aspectRatio: true });
};
