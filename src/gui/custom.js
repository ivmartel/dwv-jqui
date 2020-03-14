// namespaces
var dwvjq = dwvjq || {};
/** @namespace */
dwvjq.gui = dwvjq.gui || {};

/**
 * Display a progress value.
 * @param {Number} percent The progress percentage.
 */
dwvjq.gui.displayProgress = function (percent) {
    // jquery-ui progress bar
    if( percent <= 100 ) {
        $("#progressbar").progressbar({ value: percent });
    }
};

/**
 * Focus the view on the image.
 */
dwvjq.gui.focusImage = function ()
{
    // does nothing
};

/**
 * Refresh a HTML element.
 * @param {String} element The HTML element to refresh.
 */
dwvjq.gui.refreshElement = function (/*element*/)
{
    // does nothing
};

/**
 * Slider base gui.
 * @constructor
 */
dwvjq.gui.Slider = function (app)
{
    /**
     * Append the slider HTML.
     */
    this.append = function ()
    {
        // nothing to do
    };

    /**
     * Initialise the slider HTML.
     */
    this.initialise = function ()
    {
        var min = app.getImage().getDataRange().min;
        var max = app.getImage().getDataRange().max;

        // jquery-ui slider
        $( ".thresholdLi" ).slider({
            range: true,
            min: min,
            max: max,
            values: [ min, max ],
            slide: function( event, ui ) {
                app.setFilterMinMax(
                        {'min':ui.values[0], 'max':ui.values[1]});
            }
        });
    };

}; // class dwvjq.gui.Slider
