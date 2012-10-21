/**
 * @fileOverview Deferred data loader / cacher singleton
 * @author Ian Moore (imoore76 at yahoo dot com)
 * @version $Id$
 * @copyright Copyright (C) 2010-2012 Ian Moore (imoore76 at yahoo dot com)
 */

/**
 * vboxVMDataMediator
 * 
 * @see jQuery.deferred
 * @namespace vboxVMDataMediator
 */
var vboxVMDataMediator = {
	
	/* Promises for data */
	promises : {
		'getVMDetails':{},
		'getVMRuntimeData':{}
	},
	
	/* Holds Basic VM data */
	vmData : null,
	
	/* Holds VM details */
	vmDetailsData : {},
	
	/* Holds VM runtime data */
	vmRuntimeData : {},
		
	/* Expire cached promise / data */
	expireVMDetails: function(vmid) {
		vboxVMDataMediator.promises.getVMDetails[vmid] = null;
		vboxVMDataMediator.vmDetailsData[vmid] = null;
	},
	expireVMRuntimeData: function(vmid) {
		vboxVMDataMediator.promises.getVMRuntimeData[vmid] = null;
		vboxVMDataMediator.vmRuntimeData[vmid] = null;
	},
	expireAll: function() {
		for(var i in vboxVMDataMediator.promises) {
			if(typeof(i) != 'string') continue;
			vboxVMDataMediator.promises[i] = {};
		}
		vboxVMDataMediator.vmData = null;
		vboxVMDataMediator.vmRuntimeData = {};
		vboxVMDataMediator.vmDetailsData = {};
	},
	
	/**
	 * Get basic vm data
	 * 
	 * @param vmid {String} ID of VM
	 * @returns {Object} vm data
	 */
	getVMData: function(vmid) {
		
		// VMList must exist
		if(!vboxVMDataMediator.vmData) {
			vboxAlert('vboxVMDataMediator.getVMList not called yet!');
			return;
		}
		
		return vboxVMDataMediator.vmData[vmid];
		
	},
	
	/**
	 * Return list of machines, subscribe to running VM events
	 * and start the event listener
	 * 
	 * @returns {Object} promise
	 */
	getVMList: function() {
	
		if(vboxVMDataMediator.vmData) {
			return vboxVMDataMediator.vmData;
		}
		
		var mList = $.Deferred();
		vboxAjaxRequest('vboxGetMachines',{},function(d) {
			var vmData = {};
			var subscribeList = [];
			for(var i = 0; i < d.vmlist.length; i++) {
				
				// Enforce VM ownership
			    if($('#vboxPane').data('vboxConfig').enforceVMOwnership && !$('#vboxPane').data('vboxSession').admin && d.vmlist[i].owner != $('#vboxPane').data('vboxSession').user) {
			    	continue;
			    }

				vmData[d.vmlist[i].id] = d.vmlist[i];
				
				if(vboxVMStates.isRunning({'state':d.vmlist[i].state}) || vboxVMStates.isPaused({'state':d.vmlist[i].state}))
					subscribeList[subscribeList.length] = d.vmlist[i].id;
				
			}
			
			// Subscribe to vbox and machine events of running machines
			vboxAjaxRequest('subscribeEvents',{vms:subscribeList}, function() {
				vboxVMDataMediator.vmData = vmData;
				mList.resolve(d);		
				vboxEventListener.start();
			});				
			
		});
		
		return mList.promise();
	},
	
	/**
	 * Get VM details data
	 * 
	 * @param vmid {String} ID of VM to get data for
	 * @returns {Object} vm data or promise
	 */
	getVMDetails: function(vmid) {
		
		// Data exists
		if(vboxVMDataMediator.vmDetailsData[vmid]) {
			vboxVMDataMediator.promises.getVMDetails[vmid] = null;
			return vboxVMDataMediator.vmDetailsData[vmid];
		}
		
		// Promise does not yet exist?
		if(!vboxVMDataMediator.promises.getVMDetails[vmid]) {
			
			vboxVMDataMediator.promises.getVMDetails[vmid] = $.Deferred();

			vboxAjaxRequest('machineGetDetails',{vm:vmid}, function(d){
				vboxVMDataMediator.vmDetailsData[d.id] = d;
				vboxVMDataMediator.promises.getVMDetails[vmid].resolve(d);
			});

		}		
		return vboxVMDataMediator.promises.getVMDetails[vmid];
	},
	
	/**
	 * Get VM's runtime data
	 * 
	 * @param vmid {String} ID of VM to get data for
	 * @returns {Object} VM runtime data or promise
	 */
	getVMRuntimeData: function(vmid) {

		// Data exists
		if(vboxVMDataMediator.vmRuntimeData[vmid]) {
			vboxVMDataMediator.promises.getVMRuntimeData[vmid] = null;
			return vboxVMDataMediator.vmRuntimeData[vmid];
		}
		
		// Promise does not yet exist?
		if(!vboxVMDataMediator.promises.getVMRuntimeData[vmid]) {
			
			vboxVMDataMediator.promises.getVMRuntimeData[vmid] = $.Deferred();

			vboxAjaxRequest('machineGetRuntimeData',{vm:vmid}, function(d){
				vboxVMDataMediator.vmRuntimeData[d.id] = d;
				vboxVMDataMediator.promises.getVMRuntimeData[vmid].resolve(d);
			});

		}		
		return vboxVMDataMediator.promises.getVMRuntimeData[vmid];
	},
	
	/**
	 * Return all data for a VM
	 * @param vmid {String} ID of VM to get data for
	 * @returns promise
	 */
	getVMDataCombined : function(vmid) {
		
		// Special case for 'host'
		if(vmid == 'host') {
			var def = $.Deferred();
			$.when(vboxVMDataMediator.getVMDetails(vmid)).then(function(d){
				def.resolve(d);
			});
			return def.promise();
		}
		
		if(!vboxVMDataMediator.vmData[vmid]) return;
		
		var runtime = function() { return {};};
		if(vboxVMStates.isRunning({'state':vboxVMDataMediator.vmData[vmid].state}) || vboxVMStates.isPaused({'state':vboxVMDataMediator.vmData[vmid].state})) {
			runtime = vboxVMDataMediator.getVMRuntimeData(vmid);
		}
		
		var def = $.Deferred();
		$.when(vboxVMDataMediator.getVMDetails(vmid), runtime, vboxVMDataMediator.getVMData(vmid)).then(function(d1,d2,d3){
			def.resolve($.extend(true,{},d1,d2,d3));
		});
		return def.promise();
		
	},
	
	/**
	 * Get new VM data
	 * @param vmid {String} ID of VM to get data for
	 * @returns {Object} promise
	 */
	refreshVMData : function(vmid) {
		
		// Special case for host
		if(vmid == 'host') {
			$('#vboxPane').trigger('vboxOnMachineDataChanged', [{machineId:'host'}]);
			$('#vboxPane').trigger('vboxEvents', [[{eventType:'OnMachineDataChanged',machineId:'host'}]]);
			return;
		}
		
		if(!vboxVMDataMediator.vmData[vmid]) return;
		
		var def = $.Deferred();
		vboxAjaxRequest('vboxGetMachines',{'vm':vmid},function(d) {
			vm = d.vmlist[0];
			vboxVMDataMediator.vmData[vm.id] = vm;
			def.resolve();
			$('#vboxPane').trigger('vboxOnMachineDataChanged', [{machineId:d.id,enrichmentData:d}]);
			$('#vboxPane').trigger('vboxEvents', [[{eventType:'OnMachineDataChanged',machineId:d.id,enrichmentData:d}]]);
		});
		
		return def.promise();
	}

};

/* Events to bind for vboxVMDataMediator when everything is loaded */
$(document).ready(function(){

	/*
	 * 
	 * VirtualBox events
	 * 
	 */
	
	// Raw event to data handlers
	$('#vboxPane').bind('vboxOnMachineDataChanged',function(e, eventData) {
		
		
		vboxVMDataMediator.expireVMDetails(eventData.machineId);
		vboxVMDataMediator.expireVMRuntimeData(eventData.machineId);
		
		if(vboxVMDataMediator.vmData[eventData.machineId] && eventData.enrichmentData) {
			$.extend(true, vboxVMDataMediator.vmData[eventData.machineId], eventData.enrichmentData);
		}
	
	// Machine state change
	}).bind('vboxOnMachineStateChanged', function(e, eventData) {

		// Only care about it if its in our list
		if(vboxVMDataMediator.vmData[eventData.machineId]) {
			
			vboxVMDataMediator.vmData[eventData.machineId].state = eventData.state;
			vboxVMDataMediator.vmData[eventData.machineId].lastStateChange = eventData.lastStateChange;
			
			// If it's running, subscribe to its events
			if(vboxVMStates.isRunning({'state':eventData.state}) || vboxVMStates.isPaused({'state':eventData.state})) {
				
				// If we already have runtime data, assume we were already subscribed
				if(!vboxVMDataMediator.vmRuntimeData[eventData.machineId]) {
					vboxAjaxRequest('machineSubscribeEvents', {'vm':eventData.machineId});
				}
				
			} else {
				vboxVMDataMediator.expireVMRuntimeData(eventData.machineId);
			}
		}
		
	// Session state change
	}).bind('vboxOnSessionStateChanged', function(e, eventData) {
		
		if(vboxVMDataMediator.vmData[eventData.machineId])
			vboxVMDataMediator.vmData[eventData.machineId].sessionState = eventData.state;

	
	// Snapshot changed
	}).bind('vboxOnSnapshotTaken',function(e,eventData) {
		
		if(vboxVMDataMediator.vmData[eventData.machineId]) {
			
			vboxVMDataMediator.vmData[eventData.machineId].currentSnapshotName = eventData.enrichmentData.currentSnapshotName;
			
			// Get media again
			vboxAjaxRequest('vboxGetMedia',{},function(d){$('#vboxPane').data('vboxMedia',d);});
			
		}
		if(vboxVMDataMediator.vmDetailsData[eventData.machineId])
			vboxVMDataMediator.vmDetailsData[eventData.machineId].snapshotCount = eventData.enrichmentData.snapshotCount;
		
	// Expire all data for a VM when machine is unregistered
	}).bind('vboxOnMachineRegistered', function(e, eventData) {
		
		if(!eventData.registered) {
			vboxVMDataMediator.expireVMDetails(eventData.machineId);
			vboxVMDataMediator.expireVMRuntimeData(eventData.machineId);
			vboxVMDataMediator.vmData[eventData.machineId] = null;
			
		} else if(eventData.enrichmentData) {
		
			// Enforce VM ownership
		    if($('#vboxPane').data('vboxConfig').enforceVMOwnership && !$('#vboxPane').data('vboxSession').admin && eventData.enrichmentData.owner != $('#vboxPane').data('vboxSession').user) {
		    	return;
		    }
		    
		    vboxVMDataMediator.vmData[eventData.enrichmentData.id] = eventData.enrichmentData;

		}

	}).bind('vboxOnCPUChanged', function(e, vmid) {
	
		/*
		case 'OnCPUChanged':
			$data['cpu'] = $eventDataObject->cpu;
			$data['add'] = $eventDataObject->add;
			$data['dedupId'] .= '-' . $data['cpu'];
			break;
		*/

	}).bind('vboxOnNetworkAdapterChanged', function(e, eventData) {
		
		if(vboxVMDataMediator.vmRuntimeData[eventData.machineId]) {
			$.extend(vboxVMDataMediator.vmRuntimeData[eventData.machineId].networkAdapters[eventData.networkAdapterSlot], eventData.enrichmentData);
		}
		

	/* Storage controller of VM changed */
	}).bind('vboxOnStorageControllerChanged', function() {
		/*
        case 'OnStorageControllerChanged':
        	$data['machineId'] = $eventDataObject->machineId;
        	$data['dedupId'] .= '-'. $data['machineId'];
        	break;
        */
		
	}).bind('vboxOnMediumChanged', function(e, eventData) {
		
		/* Medium attachment changed */
		if(vboxVMDataMediator.vmRuntimeData[eventData.machineId]) {
			for(var a = 0; a < vboxVMDataMediator.vmRuntimeData[eventData.machineId].storageControllers.length; a++) {
				if(vboxVMDataMediator.vmRuntimeData[eventData.machineId].storageControllers[a].name == eventData.controller) {
					for(var b = 0; b < vboxVMDataMediator.vmRuntimeData[eventData.machineId].storageControllers[a].mediumAttachments.length; b++) {
						if(vboxVMDataMediator.vmRuntimeData[eventData.machineId].storageControllers[a].mediumAttachments[b].port == eventData.port &&
								vboxVMDataMediator.vmRuntimeData[eventData.machineId].storageControllers[a].mediumAttachments[b].device == eventData.device) {
							
							vboxVMDataMediator.vmRuntimeData[eventData.machineId].storageControllers[a].mediumAttachments[b].medium = (eventData.medium ? {id:eventData.medium} : null);
							break;
						}
					}
					break;
				}
			}
		}
		
	/* Shared folders changed */
	}).bind('vboxOnSharedFolderChanged', function() {

	// VRDE runtime info
	}).bind('vboxOnVRDEServerChanged', function(e, eventData) {

		if(vboxVMDataMediator.vmRuntimeData[eventData.machineId]) {
			$.extend(true,vboxVMDataMediator.vmRuntimeData[eventData.machineId].VRDEServer, eventData.enrichmentData);
		}

	
	// This only fires when it is enabled
	}).bind('vboxOnVRDEServerInfoChanged', function(e, eventData) {

		if(vboxVMDataMediator.vmRuntimeData[eventData.machineId]) {
			vboxVMDataMediator.vmRuntimeData[eventData.machineId].VRDEServerInfo.port = eventData.enrichmentData.port;
			vboxVMDataMediator.vmRuntimeData[eventData.machineId].VRDEServer.enabled = eventData.enrichmentData.enabled;
		}

		
	// Execution cap
	}).bind('vboxOnCPUExecutionCapChanged', function(e, eventData) {
		
		if(vboxVMDataMediator.vmRuntimeData[eventData.machineId]) {
			vboxVMDataMediator.vmRuntimeData[eventData.machineId].CPUExecutionCap = eventData.executionCap;
		}

	// Special cases for where phpvirtualbox keeps its extra data
	}).bind('vboxOnOnExtraDataChanged', function(e, eventData) {
		
		// No vm id is a global change
		if(!eventData.machineId || !vboxVMDataMediator.vmData[eventData.machineId]) return;
		
		switch(eventData.key) {

			// Startup mode
			case 'pvbx/startupMode':
				if(vboxVMDataMediator.vmDetailsData[eventData.machineId])
					vboxVMDataMediator.vmDetailsData[eventData.machineId].startupMode = eventData.value;
				break;
			
			// Owner
			case 'phpvb/sso/owner':
				vboxVMDataMediator.vmData[eventData.machineId].owner = eventData.value;
				break;
			
			// Custom icon
			case 'phpvb/icon':

				vboxVMDataMediator.vmData[eventData.machineId].customIcon = eventData.value;
				if(vboxVMDataMediator.vmDetailsData[eventData.machineId])
					vboxVMDataMediator.vmDetailsData[eventData.machineId].customIcon = eventData.value;
				
				break;
			
			// Save mounted media changes at runtime
			case 'GUI/SaveMountedAtRuntime':
				if(vboxVMDataMediator.vmDetailsData[eventData.machineId])
					vboxVMDataMediator.vmDetailsData[eventData.machineId].GUI.SaveMountedAtRuntime = eventData.value;
				break;
		}
		
		
	/*
	 * 
	 * phpVirtualBox events
	 * 
	 */
		
	// Expire everything when host changes
	}).bind('hostChange',function(){
		vboxVMDataMediator.expireAll();
	
	});
	
});