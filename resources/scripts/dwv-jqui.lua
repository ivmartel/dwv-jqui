--
-- dwv-jqui (medical viewer using DWV and jQuery UI) lua script
--  for integration in a Conquest PACS server.
--
-- Usage:
-- 1. copy this file onto your web server
-- 2. in the 'dicom.ini' of your web server, create the dwv-jqui viewer:
-- >> [dwv-jqui]
-- >> source = dwv-jqui.lua
-- And set it as the default viewer:
-- >> [webdefaults]
-- >> ...
-- >> viewer = dwv-jqui
-- 3. copy the dwv-jqui source code from one of its release available at
-- https://github.com/ivmartel/dwv-jqui/releases
-- in a 'dwv-jqui' folder in the web folder of your web server. 
-- It should be accessible via '[server address]/dwv-jqui'.
--
-- This script relies on the 'kFactorFile', 'ACRNemaMap' and 'Dictionary'
-- variables being set correctly.

-- Get ids

local patientid = string.gsub(series2, ':.*$', '')
local seriesuid = string.gsub(series2, '^.*:', '')

-- Functions declaration

function getstudyuid()
  local a, b, s
  s = servercommand('get_param:MyACRNema')
  b = newdicomobject()
  b.PatientID = patientid
  b.SeriesInstanceUID = seriesuid
  b.StudyInstanceUID = ''
  a = dicomquery(s, 'SERIES', b)
  return a[0].StudyInstanceUID
end

function queryimages()
  local images, imaget, b, s
  s = servercommand('get_param:MyACRNema')
  b = newdicomobject()
  b.PatientID = patientid
  b.SeriesInstanceUID = seriesuid
  b.SOPInstanceUID = ''
  images = dicomquery(s, 'IMAGE', b)

  imaget={}
  for k=0,#images-1 do
    imaget[k+1]={}
    imaget[k+1].SOPInstanceUID = images[k].SOPInstanceUID
  end
  table.sort(imaget, function(a,b) return a.SOPInstanceUID < b.SOPInstanceUID end)

  return imaget
end

-- Main

local studyuid = getstudyuid()
local images = queryimages()
-- create the url lua array
local urlRoot = webscriptadress
urlRoot = urlRoot .. '?requestType=WADO&contentType=application/dicom'
urlRoot = urlRoot .. '&seriesUID=' .. seriesuid
urlRoot = urlRoot .. '&studyUID=' .. studyuid
local urls = {}
for i=1, #images do
  urls[i] = urlRoot .. '&objectUID=' .. images[i].SOPInstanceUID
end

-- Generate html

HTML('Content-type: text/html\n\n')

-- paths with extra /dwv
print([[
<!DOCTYPE html>
<html>

<head>
<title>DICOM Web Viewer</title>
<meta charset="UTF-8">
]])

print([[
<link type="text/css" rel="stylesheet" href="/dwv-jqui/css/style.css">
<link type="text/css" rel="stylesheet" href="/dwv-jqui/ext/jquery-ui/themes/ui-darkness/jquery-ui-1.12.1.min.css">
<style type="text/css" >
.ui-widget-content { background-color: #222; background-image: url();}
</style>
]])

print([[
<!-- Third party (dwv) -->
<script type="text/javascript" src="/dwv-jqui/node_modules/i18next/i18next.min.js"></script>
<script type="text/javascript" src="/dwv-jqui/node_modules/i18next-xhr-backend/i18nextXHRBackend.min.js"></script>
<script type="text/javascript" src="/dwv-jqui/node_modules/i18next-browser-languagedetector/i18nextBrowserLanguageDetector.min.js"></script>
<script type="text/javascript" src="/dwv-jqui/node_modules/jszip/dist/jszip.min.js"></script>
<script type="text/javascript" src="/dwv-jqui/node_modules/konva/konva.min.js"></script>
<script type="text/javascript" src="/dwv-jqui/node_modules/magic-wand-js/js/magic-wand-min.js"></script>
]])

print([[
<!-- Third party (viewer) -->
<script type="text/javascript" src="/dwv-jqui/node_modules/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="/dwv-jqui/ext/jquery-ui/jquery-ui-1.12.1.min.js"></script>
<script type="text/javascript" src="/dwv-jqui/ext/flot/jquery.flot.min.js"></script>
]])

print([[
<!-- Decoders -->
<script type="text/javascript" src="/dwv-jqui/node_modules/dwv/decoders/pdfjs/jpx.js"></script>
<script type="text/javascript" src="/dwv-jqui/node_modules/dwv/decoders/pdfjs/util.js"></script>
<script type="text/javascript" src="/dwv-jqui/node_modules/dwv/decoders/pdfjs/arithmetic_decoder.js"></script>
<script type="text/javascript" src="/dwv-jqui/node_modules/dwv/decoders/pdfjs/jpg.js"></script>
<script type="text/javascript" src="/dwv-jqui/node_modules/dwv/decoders/rii-mango/lossless-min.js"></script>
]])

print([[
<!-- dwv -->
<script type="text/javascript" src="/dwv-jqui/node_modules/dwv/dist/dwv.min.js"></script>
<!-- Launch the app -->
<script type="text/javascript" src="/dwv-jqui/src/appgui.js"></script>
]])

print([[
<script type="text/javascript">
// start app function
function startApp() {
    // gui setup
    dwv.gui.setup();
    // main application
    var myapp = new dwv.App();
    // initialise the application
    var options = {
        "containerDivId": "dwv",
        "fitToWindow": true,
        "gui": ["tool", "load", "help", "undo", "version", "tags", "drawList"],
        "loaders": ["File", "Url"],
        "tools": ["Scroll", "WindowLevel", "ZoomAndPan", "Draw", "Livewire", "Filter", "Floodfill"],
        "filters": ["Threshold", "Sharpen", "Sobel"],
        "shapes": ["Arrow", "Ruler", "Protractor", "Rectangle", "Roi", "Ellipse", "FreeHand"],
        "isMobile": false,
        "helpResourcesPath": "/dwv-jqui/resources/help",
        "skipLoadUrl": true
    };
    if ( dwv.browser.hasInputDirectory() ) {
        options.loaders.splice(1, 0, "Folder");
    }
    myapp.init(options);
    // help
    // TODO Seems accordion only works when at end...
    $("#accordion").accordion({ collapsible: "true", active: "false", heightStyle: "content" });
]])
-- create javascript url array
print([[
    var inputUrls = [
]])
for i=1, #images do
  print('      "'..urls[i]..'",')
end
print([[
    ];
]])
-- load data
print([[
    if( inputUrls && inputUrls.length > 0 ) myapp.loadURLs(inputUrls);
}; // end startApp
]])

print([[
// Image decoders (for web workers)
dwv.image.decoderScripts = {
    "jpeg2000": "/dwv-jqui/node_modules/dwv/decoders/pdfjs/decode-jpeg2000.js",
    "jpeg-lossless": "/dwv-jqui/node_modules/dwv/decoders/rii-mango/decode-jpegloss.js",
    "jpeg-baseline": "/dwv-jqui/node_modules/dwv/decoders/pdfjs/decode-jpegbaseline.js"
};
// status flags
var domContentLoaded = false;
var i18nInitialised = false;
// launch when both DOM and i18n are ready
function launchApp() {
    if ( domContentLoaded && i18nInitialised ) {
        startApp();
    }
}
// i18n ready?
dwv.i18nOnInitialised( function () {
    // call next once the overlays are loaded
    var onLoaded = function (data) {
        dwv.gui.info.overlayMaps = data;
        i18nInitialised = true;
        launchApp();
    };
    // load overlay map info
    $.getJSON( dwv.i18nGetLocalePath("overlays.json"), onLoaded )
    .fail( function () {
        console.log("Using fallback overlays.");
        $.getJSON( dwv.i18nGetFallbackLocalePath("overlays.json"), onLoaded );
    });
});
]])

print([[
// check browser support
dwv.browser.check();
// initialise i18n
dwv.i18nInitialise("auto", "/dwv-jqui/node_modules/dwv");
// DOM ready?
$(document).ready( function() {
    domContentLoaded = true;
    launchApp();
});
]])

print([[
</script>
]])

print([[
</head>

<body>

<!-- DWV -->
<div id="dwv">

<div id="pageHeader">

<!-- Title -->
<h1>DWV <span class="dwv-version"></span></h1>

<!-- Toolbar -->
<div class="toolbar"></div>

</div><!-- /pageHeader -->

<div id="pageMain">

<!-- Open file -->
<div class="openData" title="File">
<div class="loaderlist"></div>
<div id="progressbar"></div>
</div>

<!-- Toolbox -->
<div class="toolList" title="Toolbox"></div>

<!-- History -->
<div class="history" title="History"></div>

<!-- Tags -->
<div class="tags" title="Tags"></div>

<!-- DrawList -->
<div class="drawList" title="Draw list"></div>

<!-- Help -->
<div class="help" title="Help"></div>

<!-- Layer Container -->
<div class="layerDialog" title="Image">
<div class="dropBox"></div>
<div class="layerContainer">
<canvas class="imageLayer">Only for HTML5 compatible browsers...</canvas>
<div class="drawDiv"></div>
<div class="infoLayer">
<div class="infotl"></div>
<div class="infotc"></div>
<div class="infotr"></div>
<div class="infocl"></div>
<div class="infocr"></div>
<div class="infobl"></div>
<div class="infobc"></div>
<div class="infobr" style="bottom: 64px;"></div>
<div class="plot"></div>
</div><!-- /infoLayer -->
</div><!-- /layerContainer -->
</div><!-- /layerDialog -->

</div><!-- /pageMain -->

</div><!-- /dwv -->

</body>
</html>
]])
