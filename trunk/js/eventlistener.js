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
		
		if(vboxEventListener._running)
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
			if(!d.result) {
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
			if(d && d.events) {
								
				var eventList = [];
				
				var vmChanges = {};
				
				for(var i = 0; i < d.events.length; i++) {
					
					console.log(d.events[i]);

					switch(d.events[i].eventType) {
					
						// machine state change
						case 'OnMachineStateChanged':

							if(!vmChanges[d.events[i].machineId])
								vmChanges[d.events[i].machineId] = {};

							vmChanges[d.events[i].machineId]['state'] = d.events[i].state;
							vmChanges[d.events[i].machineId]['lastStateChange'] = d.events[i].enrichmentData.lastStateChange;
							break;
						
						// machine session state change
						case 'OnSessionStateChanged':
							
							if(!vmChanges[d.events[i].machineId])
								vmChanges[d.events[i].machineId] = {};
							
							vmChanges[d.events[i].machineId]['sessionState'] = d.events[i].state;
							
							break;
							
						// machine data changed
						case 'OnMachineDataChanged':
							if(!vmChanges[d.events[i].machineId])
								vmChanges[d.events[i].machineId] = {};
							
							vmChanges[d.events[i].machineId]['data'] = true;
							eventList[eventList.length] = ['MachineDataChanged',
							                               [d.events[i].machineId, d.events[i].enrichmentData]];
							
							break;							
						
						
						// Medium attachment changed
						case 'OnMediumChanged':

							eventList[eventList.length] = ['MediumChanged', [d.events[i].sourceId, d.events[i]]];
							break;
							
						// Snapshot events
						case 'OnSnapshotTaken':
							eventList[eventList.length] = ['SnapshotTaken',
							                               [d.events[i].machineId,
							                                d.events[i].snapshotId,
							                                d.events[i].enrichmentData]];

							break;
						case 'OnSnapshotDeleted':
							eventList[eventList.length] = ['SnapshotDeleted',
							                               [d.events[i].machineId,
							                                d.events[i].snapshotId,
							                                d.events[i].enrichmentData]];

							break;
						case 'OnSnapshotChanged':
							eventList[eventList.length] = ['SnapshotChanged',
							                               [d.events[i].machineId,
							                                d.events[i].snapshotId,
							                                d.events[i].enrichmentData]];

							break;
						
						// CPU plugged / removed
						case 'OnCPUChanged':
							eventList[eventList.length] = ['CPUChanged',[d.events[i].sourceId, d.events[i].cpu, d.events[i].add]];
							break;
							
						// Execution cap changed
						case 'OnCPUExecutionCapChanged':
							eventList[eventList.length] = ['CPUExecutionCapChanged', [d.events[i].sourceId, d.events[i].executionCap]];
							break;
							
						// Network adapter changed
						case 'OnNetworkAdapterChanged':
							eventList[eventList.length] = ['NetworkAdapterChanged',[d.events[i].sourceId, d.events[i].networkAdapterSlot, d.events[i].enrichmentData]];
							break;
							
						// Machine was added / removed
						case 'OnMachineRegistered':

							if(!vmChanges[d.events[i].machineId])
								vmChanges[d.events[i].machineId] = {};

							vmChanges[d.events[i].machineId]['registered'] = true;

							eventList[eventList.length] = ['MachineRegistered',
							                               		[d.events[i].machineId,
							                               		 d.events[i].registered,
							                               		 d.events[i].enrichmentData]];
							
							break;
							
						
						
						// VRDE server changed
						case 'OnVRDEServerChanged':

							eventList[eventList.length] = ['VRDEServerChanged',
							                               [d.events[i].sourceId, d.events[i].enrichmentData]];
							break;

						case 'OnVRDEServerInfoChanged':

							eventList[eventList.length] = ['VRDEServerInfoChanged',
							                               [d.events[i].sourceId, d.events[i].enrichmentData]];
							break;
							
							
						// Group definitions updated
						case 'OnExtraDataChanged':
							eventList[eventList.length] = ['ExtraDataChanged',[d.events[i].machineId, d.events[i].key, d.events[i].value]];
							break;
							
						
					}
					
					
				}
				delete d.events;
				
				// Trigger a change if data does not match
				var dataChangedTriggers = {};
				var sessionOrStateTriggers = {};
				for(var i in vmChanges) {
					
					// i should hold VM id
					if(typeof(i) != 'string') continue;
					
					// Skip if data changed or VM was just added because we will
					// redraw anyway
					if(vmChanges[i]['data'] || vmChanges[i]['registered']) {
						dataChangedTriggers[i] = (vmChanges[i]['data'] || vmChanges[i]['registered']);
						continue;						
					}
					
					// Consolidate each state or machine state change
					for(var a in vmChanges[i]) {
						
						if(typeof(a) != 'string') continue;
						
						// Machine state
						if(a == 'state') {
							
							eventList[eventList.length] = ['MachineStateChanged', [i, vmChanges[i][a], vmChanges[i]['lastStateChange']]];
							sessionOrStateTriggers[i] = i;			
						
						// Session state
						} else if(a == 'sessionState') {
							
							eventList[eventList.length] = ['SessionStateChanged', [i, vmChanges[i][a]]];
							sessionOrStateTriggers[i] = i;
						}
					}
					
				}

				// Synthetic event
				for(var i in sessionOrStateTriggers) {
					if(typeof(i) != 'string') continue;
					eventList[eventList.length] = ['MachineOrSessionStateChanged',[i]];
				}
				
				// Now run each 'pre' event
				for(var i = 0; i < eventList.length; i++)
					$('#vboxPane').trigger('vboxPre'+eventList[i][0],eventList[i][1]);

				// Now run each event
				for(var i = 0; i < eventList.length; i++) {
					$('#vboxPane').trigger('vbox'+eventList[i][0],eventList[i][1]);
				}
			
			// </ check for d and d.events >
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
		vboxEventListener.stop();
	});	
});
