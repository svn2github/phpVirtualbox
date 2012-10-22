/**
 * 
 * @fileOverview Event listener singleton
 * @author Ian Moore (imoore76 at yahoo dot com)
 * @version $Id$
 * @copyright Copyright (C) 2010-2012 Ian Moore (imoore76 at yahoo dot com)
 */

/**
 * vboxEventListener
 * 
 * Polls vboxwebsrv for pending events and triggers
 * events on $('#vboxPane')
 * 
 * @namespace vboxEventListener
 */
var vboxEventListener = {
	
	_running : false,
	
	// Deferred state objects
	_started: null,
	_stopped: null, // resolved when we have unsubscribed from all events
	_unloading: false, // set to true when page is unloading
	
	
	/* Start event listener loop */
	start : function() {
		
		if(vboxEventListener._running) return;
		
		vboxEventListener._running = true;
		vboxEventListener._started = $.Deferred();
		vboxEventListener._getEvents();
		return vboxEventListener._started.promise();
		
	},
	
	/* Stop event listener loop */
	stop : function() {
		
		if(!vboxEventListener._running)
			return;
		
		window.clearTimeout(vboxEventListener._running);
		vboxEventListener._running = false;
		
		// Unsubscribe from events. Returns a deferred object
		return vboxAjaxRequest('unsubscribeEvents');
		
	},
	
	/* Get pending events */
	_getEvents : function(){

		// Don't do anything if we aren't running anymore
		if(!vboxEventListener._running) return;
		
		vboxAjaxRequest('getEvents',{}, function(d,lastTime) {
			
			// Don't do anything if this is not running
			if(!vboxEventListener._running || !vboxEventListener._started) return;
			
			// Check for valid result
			if(!d.result && vboxEventListener._running && !vboxEventListener._unloading) {
				$('#vboxPane').css({'display':'none'});
				vboxAlert(trans('There was an error obtaining the list of registered virtual machines from VirtualBox. Make sure vboxwebsrv is running and that the settings in config.php are correct.<p>The list of virtual machines will not begin auto-refreshing again until this page is reloaded.</p>','phpVirtualBox'));
				return;
			}
			
			// Resolve started object?
			if(vboxEventListener._started.state() != 'resolved') {
				vboxEventListener._started.resolve({});
			}
			
			// Check key to make sure this isn't a stale
			// response from a previously selected server
			if(!d.key || (d.key != $('#vboxPane').data('vboxConfig').key)) return;
			
			// Loop through each event recording or
			// triggering changes
			if(d && d.events && d.events.length) {
								
				// Trigger each event individually
				for(var i = 0; i < d.events.length; i++) {

					// Trigger raw vbox events
					$('#vboxPane').trigger('vbox' + d.events[i].eventType, [d.events[i]]);
					
				}
				
				// Trigger event list queue
				$('#vboxPane').trigger('vboxEvents', [d.events]);
				
			}
			
			// Wait at most 3 seconds
			var wait = 3000 - ((new Date().getTime()) - lastTime);
			if(wait <= 0) vboxEventListener._getEvents();
			else vboxEventListener._running = window.setTimeout(vboxEventListener._getEvents, wait);
			
		}, new Date().getTime());

	}
};

// Stop event listener on window unload
$(document).ready(function() {
	$(window).bind('unload',function() {
		vboxEventListener._unloading = true;
		vboxEventListener.stop();
	});	
});
