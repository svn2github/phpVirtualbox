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
        var maxHeight = $(fillTo).height()-($.browser.msie ? 2 : 0);
        var maxWidth = $(fillTo).width()-($.browser.msie ? 2 : 0);
        var textHeight = $(ourText).outerHeight(true);
        var textWidth = $(ourText).outerWidth(true);
        
        do {
        	ourText.css('font-size', fontSize++);
        	textHeight = $(ourText).outerHeight(true);
        	textWidth = $(ourText).outerWidth(true);
        	
        } while(textHeight < maxHeight && textWidth < maxWidth && fontSize <= maxFontSize);

        return ourText.css({'font-size':(fontSize-1)+'px'});
    };
})(jQuery);
