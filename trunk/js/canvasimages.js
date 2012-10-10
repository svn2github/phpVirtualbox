/**
 * @fileOverview HTML5 canvas image functions
 * @author Ian Moore (imoore76 at yahoo dot com)
 * @version $Id$
 * @copyright Copyright (C) 2010-2012 Ian Moore (imoore76 at yahoo dot com)
 */

/**
 * Returns true if broswer supports canvas
 * @return {Boolean} true if broswer supports canvas
 */
var __vboxIsCanvasSupported = null; // cached
var isCanvasSupported = function(){
	if(__vboxIsCanvasSupported === null) {
	  var elem = document.createElement('canvas');
	  __vboxIsCanvasSupported = !!(elem.getContext && elem.getContext('2d'));
	}
	return __vboxIsCanvasSupported;
};

/**
 * Draw arrow images when document is loaded
 */
var vboxImageDownWhite = null;
var vboxImageDownGrey = null;
$(document).ready(function(){
	
	
	// Draw arrow images
	if(isCanvasSupported()) {
		
		var createCanvas = function(color) {
			
			return $('<canvas />').css({'width':'18px','height':'18px'}).each(function(idx,canvas){
				
				canvas.width = 18;
				canvas.height = 18;
				
				var ctx = canvas.getContext('2d');
				
				ctx.strokeStyle = color;
				ctx.lineWidth = 2;
				
				// Circle
				ctx.arc(9,9,8,(Math.PI/180)*0,(Math.PI/180)*360,true);
				ctx.stroke();
				
				// "V"
				ctx.moveTo(6,6);
				ctx.lineTo(9,12);
				ctx.lineTo(12,6);
				ctx.stroke();
				ctx.save();
				
			})[0];
			
		};
		vboxImageDownWhite = createCanvas('#FFFFFF');
		vboxImageDownGrey = createCanvas('#999999');
		
}
});