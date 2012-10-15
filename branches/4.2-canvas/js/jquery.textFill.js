/**
 * Modified version of http://archive.plugins.jquery.com/project/TextFill
 * $Id$
 */
;(function($) {
    $.fn.textFill = function(options) {
        
    	var maxFontSize = options.maxFontPixels;
    	var maxHeight = parseInt(options.height);
    	var maxWidth = parseInt(options.width);
        
    	var ourText = $(this);
        
        var fontSize = parseInt(ourText.css('font-size'));   
        var fontSizeOrig = fontSize;
        var textHeight = $(ourText).outerHeight(true);
        var textWidth = $(ourText).outerWidth(true);
        
        do {
        	ourText.css('font-size', fontSize++);
        	textHeight = $(ourText).outerHeight(true);
        	textWidth = $(ourText).outerWidth(true);
        	
        } while(textHeight <= maxHeight && textWidth <= maxWidth && fontSize <= maxFontSize);

        fontSize--;
        return ourText.css({'font-size':(fontSize)+'px','top':(fontSize > fontSizeOrig ? '-1' : '0') + 'px'});
    };
})(jQuery);
