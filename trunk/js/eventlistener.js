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
	_started: $.Deferred(), // resolved when we get our first list of events
	_persist: {}, // persistent request data

	// List of machines to subscribe to at runtime
	_subscribeList : [],
	
	// Since VirtualBox handles to event listener objects are persistent,
	// calls using the same handle should be synchronous
	_requestQueue : {
		
		requests : [],
		running: false,
		
		// Add a request to the queue
		addReq : function(q) {
			
			vboxEventListener._requestQueue.requests.push(q);
			vboxEventListener._requestQueue.run();
		},
		
		// Run through the queue
		run : function() {
			
			// Already running through queue
			if(vboxEventListener._requestQueue.running) return;
			
			vboxEventListener._requestQueue.running = true;
			vboxEventListener._requestQueue.runReq();
			
		},
		
		// Run a single request, removing it from the queue
		runReq : function() {
			var r = vboxEventListener._requestQueue.requests.shift();
			if(r) {
				$.when(r()).always(vboxEventListener._requestQueue.runReq);
			} else {
				vboxEventListener._requestQueue.running = false;
			}
		}
		
	},
	
	/**
	 *  Start event listener loop
	 *  @param {Array} vmlist - list of VM ids to subscribe to
	 */
	start : function(vmlist) {
		
		// Already started?
		if(vboxEventListener._running) return;
		
		vboxEventListener._running = true;
		
		vboxEventListener._started = $.Deferred();
		
		// Subscribe to events and start main loop
		$.when(vboxAjaxRequest('subscribeEvents',{vms:vmlist})).done(function(d) {
			vboxEventListener._persist = d.persist;
			vboxEventListener._getEvents();
		});
		
		return vboxEventListener._started.promise();
		
	},
	
	/**
	 * Subscribe to a single machine's events. This should happen
	 * 
	 * @param {String} vmid - ID of VM to subscribe to
	 */
	subscribeVMEvents : function(vmid) {
		
		// Push into list
		vboxEventListener._subscribeList.push(vmid);
		
		// Add subscription requst to queue
		vboxEventListener._requestQueue.addReq(function(){
			
			if(!vboxEventListener._subscribeList.length) return;
			
			var vms = vboxEventListener._subscribeList;
			vboxEventListener._subscribeList = [];
			
			return vboxAjaxRequest('machineSubscribeEvents', {'vms':vms,'_persist':vboxEventListener._persist});
			
		});
		
	},
	
	/**
	 *  Stop event listener loop and unsubscribe from events
	 */
	stop : function() {
		
		if(!vboxEventListener._running)
			return;
		
		window.clearTimeout(vboxEventListener._running);
		vboxEventListener._running = false;
		
		// Unsubscribe from events. Returns a deferred object
		vboxEventListener._requestQueue.addReq(function(){
			return vboxAjaxRequest('unsubscribeEvents', {'_persist':vboxEventListener._persist});
		});
		
	},
	
	/**
	 * Main loop - get pending events
	 */
	_getEvents : function(){

		// Don't do anything if we aren't running anymore
		if(!vboxEventListener._running) return;
		
		// Add to queue
		vboxEventListener._requestQueue.addReq(function(){
			
			return $.when(new Date().getTime(), vboxAjaxRequest('getEvents',{'_persist':vboxEventListener._persist})).then(function(lastTime,d) {
				
				// Don't do anything if this is not running
				if(!vboxEventListener._running || !vboxEventListener._started) return;
				
				// Check for valid result
				if(!d.success && vboxEventListener._running) {
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
				
				// Always set persistent request data
				vboxEventListener._persist = d.persist;
				
				// Loop through each event recording or
				// triggering changes
				if(d.responseData && d.responseData.length) {
									
					// Trigger each event individually
					for(var i = 0; i < d.responseData.length; i++) {
	
						// Trigger raw vbox events
						$('#vboxPane').trigger('vbox' + d.responseData[i].eventType, [d.responseData[i]]);
						
					}
					
					// Trigger event list queue
					$('#vboxPane').trigger('vboxEvents', [d.responseData]);
					
				}
				
				// Wait at most 3 seconds
				var wait = 3000 - ((new Date().getTime()) - lastTime);
				if(wait <= 0) vboxEventListener._getEvents();
				else vboxEventListener._running = window.setTimeout(vboxEventListener._getEvents, wait);
				
			});

		});
	}
};

// Stop event listener on window unload
$(document).ready(function() {
	$(window).bind('unload',function() {
		vboxEventListener.stop();
	});	
});
