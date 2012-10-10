/**
 * Modified version of http://archive.plugins.jquery.com/project/TextFill
 * $Id$
 */
;(function($) {
    $.fn.textFill = function(options) {
        
    	var maxFontSize = options.maxFontPixels;
        
    	var ourText = $(this);
        var fillTo = $(this).parent();
        
        var fontSize = parseInt(ourText.css('font-size'));        
        var maxHeight = $(fillTo).innerHeight();
        var maxWidth = $(fillTo).innerWidth();
        var textHeight = $(ourText).outerHeight(true);
        var textWidth = $(ourText).outerWidth(true);
        
        do {        	

        	ourText.css('font-size', ++fontSize);
        	textHeight = $(ourText).outerHeight(true);
        	textWidth = $(ourText).outerWidth(true);
        	
        } while(textHeight < maxHeight && textWidth < maxWidth && fontSize <= maxFontSize);

        return ourText.css({'font-size':(--fontSize)});
    };
})(jQuery);
