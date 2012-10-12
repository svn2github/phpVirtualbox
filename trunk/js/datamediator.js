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
			if(callback) callback(vboxVMDataMediator.vmData);
			else return vboxVMDataMediator.vmData;
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
			
			// Subscribe to machine events of running machines
			if(subscribeList.length > 0) {
				vboxAjaxRequest('subscribeEvents',{vms:subscribeList}, function() {
					vboxVMDataMediator.vmData = vmData;
					mList.resolve(d);		
					vboxEventListener.start();
				});				
			} else {
				vboxVMDataMediator.vmData = vmData;
				mList.resolve(d);			
				vboxEventListener.start();				
			}
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
		
		if(!vboxVMDataMediator.vmData[vmid]) return;
		
		var runtime = function() { return {};};
		if(vboxVMStates.isRunning({'state':vboxVMDataMediator.vmData[vmid].state}) || vboxVMStates.isPaused({'state':vboxVMDataMediator.vmData[vmid].state})) {
			runtime = vboxVMDataMediator.getVMRuntimeData(vmid);
		}
		
		var def = $.Deferred();
		$.when(vboxVMDataMediator.getVMDetails(vmid), runtime, vboxVMDataMediator.getVMData(vmid)).then(function(d1,d2,d3){
			def.resolve($.extend({},d1,d2,d3));
		});
		return def.promise();
		
	},
	
	/**
	 * Get new VM data
	 * @param vmid {String} ID of VM to get data for
	 * @returns {Object} promise
	 */
	refreshVMData : function(vmid) {
		
		if(!vboxVMDataMediator.vmData[vmid]) return;
		
		var def = $.Deferred();
		vboxAjaxRequest('vboxGetMachines',{'vm':vmid},function(d) {
			vm = d.vmlist[0];
			vboxVMDataMediator.vmData[vm.id] = vm;
			def.resolve();
			$('#vboxPane').trigger('vboxPreMachineDataChanged', [vm.id, vm]);
			$('#vboxPane').trigger('vboxMachineDataChanged', [vm.id, vm]);
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
	
	// Pre-event to data handlers
	$('#vboxPane').bind('vboxPreMachineDataChanged',function(e, vmid, vmdef) {
		
		vboxVMDataMediator.expireVMDetails(vmid);
		vboxVMDataMediator.expireVMRuntimeData(vmid);
		
		if(vboxVMDataMediator.vmData[vmid])
			vboxVMDataMediator.vmData[vmid] = vmdef;
	
	// Machine state change
	}).bind('vboxPreMachineStateChanged', function(e, vmid, state, lastStateChange) {

		// Only care about it if its in our list
		if(vboxVMDataMediator.vmData[vmid]) {
			
			vboxVMDataMediator.vmData[vmid].state = state;
			vboxVMDataMediator.vmData[vmid].lastStateChange = lastStateChange;
			
			// If it's running, subscribe to its events
			if(vboxVMStates.isRunning({'state':state}) || vboxVMStates.isPaused({'state':state})) {
				
				// If we already have runtime data, assume we were already subscribed
				if(!vboxVMDataMediator.vmRuntimeData[vmid]) {
					vboxAjaxRequest('machineSubscribeEvents', {'vm':vmid});
				}
				
			} else {
				vboxVMDataMediator.expireVMRuntimeData(vmid);
			}
		}
		
	// Session state change
	}).bind('vboxPreSessionStateChanged', function(e, vmid, state) {
		
		if(vboxVMDataMediator.vmData[vmid])
			vboxVMDataMediator.vmData[vmid].sessionState = state;

	
	// Snapshot changed
	}).bind('vboxPreSnapshotTaken',function(e,vmid,snapshotid,data) {
		
		if(vboxVMDataMediator.vmData[vmid]) {
			vboxVMDataMediator.vmData[vmid].currentSnapshotName = data.currentSnapshotName;
		}
		if(vboxVMDataMediator.vmDetailsData[vmid])
			vboxVMDataMediator.vmDetailsData[vmid].snapshotCount = data.snapshotCount;
		
	// Expire all data for a VM when machine is unregistered
	}).bind('vboxPreMachineRegistered', function(e, vmid, registered, data) {
		
		if(!registered) {
			vboxVMDataMediator.expireVMDetails(vmid);
			vboxVMDataMediator.expireVMRuntimeData(vmid);
			vboxVMDataMediator.vmData[vmid] = null;
			
		} else if(data) {
		
			// Enforce VM ownership
		    if($('#vboxPane').data('vboxConfig').enforceVMOwnership && !$('#vboxPane').data('vboxSession').admin && data.owner != $('#vboxPane').data('vboxSession').user) {
		    	return;
		    }
		    
		    vboxVMDataMediator.vmData[data.id] = data;

		}

	}).bind('vboxPreCPUChanged', function(e, vmid) {
	
		/*
		case 'OnCPUChanged':
			$data['cpu'] = $eventDataObject->cpu;
			$data['add'] = $eventDataObject->add;
			$data['dedupId'] .= '-' . $data['cpu'];
			break;
		*/

	}).bind('vboxPreNetworkAdapterChanged', function(e, vmid, slot, data) {
		
		if(vboxVMDataMediator.vmRuntimeData[vmid]) {
			$.extend(vboxVMDataMediator.vmRuntimeData[vmid].networkAdapters[slot], data);
		}
		

	/* Storage controller of VM changed */
	}).bind('vboxPreStorageControllerChanged', function() {
		/*
        case 'OnStorageControllerChanged':
        	$data['machineId'] = $eventDataObject->machineId;
        	$data['dedupId'] .= '-'. $data['machineId'];
        	break;
        */
		
	}).bind('vboxPreMediumChanged', function(e, vmid, data) {
		
        /* Medium attachment changed */
		if(vboxVMDataMediator.vmRuntimeData[vmid]) {
			for(var a = 0; a < vboxVMDataMediator.vmRuntimeData[vmid].storageControllers.length; a++) {
				if(vboxVMDataMediator.vmRuntimeData[vmid].storageControllers[a].name == data.controller) {
					for(var b = 0; b < vboxVMDataMediator.vmRuntimeData[vmid].storageControllers[a].mediumAttachments.length; b++) {
						if(vboxVMDataMediator.vmRuntimeData[vmid].storageControllers[a].mediumAttachments[b].port == data.port &&
								vboxVMDataMediator.vmRuntimeData[vmid].storageControllers[a].mediumAttachments[b].device == data.device) {
							
							vboxVMDataMediator.vmRuntimeData[vmid].storageControllers[a].mediumAttachments[b].medium = (data.medium ? {id:data.medium} : null);
							break;
						}
					}
					break;
				}
			}
		}
		
	/* Shared folders changed */
	}).bind('vboxPreSharedFolderChanged', function() {

	// VRDE runtime info
	}).bind('vboxPreVRDEServerChanged', function(e, vmid, data) {

		if(vboxVMDataMediator.vmRuntimeData[vmid]) {
			$.extend(vboxVMDataMediator.vmRuntimeData[vmid].VRDEServer, data);
		}

		
	}).bind('vboxPreVRDEServerInfoChanged', function(e, vmid, data) {

		if(vboxVMDataMediator.vmRuntimeData[vmid]) {
			vboxVMDataMediator.vmRuntimeData[vmid].VRDEServerInfo.port = data.port;
		}

		
	// Execution cap
	}).bind('vboxPreCPUExecutionCapChanged', function(e, vmid, executionCap) {
		
		if(vboxVMDataMediator.vmRuntimeData[vmid]) {
			vboxVMDataMediator.vmRuntimeData[vmid].CPUExecutionCap = executionCap;
		}

	// Special cases for where phpvirtualbox keeps its extra data
	}).bind('vboxPreOnExtraDataChanged', function(e, vmid, key, value) {
		
		// No vm id is a global change
		if(!vmid || !vboxVMDataMediator.vmData[vmid]) return;
		
		switch(key) {

			// Startup mode
			case 'pvbx/startupMode':
				if(vboxVMDataMediator.vmDetailsData[vmid])
					vboxVMDataMediator.vmDetailsData[vmid].startupMode = value;
				break;
			
			// Owner
			case 'phpvb/sso/owner':
				vboxVMDataMediator.vmData[vmid].owner = value;
				break;
			
			// Custom icon
			case 'phpvb/icon':

				vboxVMDataMediator.vmData[vmid].customIcon = value;
				if(vboxVMDataMediator.vmDetailsData[vmid])
					vboxVMDataMediator.vmDetailsData[vmid].customIcon = value;
				
				break;
			
			// Save mounted media changes at runtime
			case 'GUI/SaveMountedAtRuntime':
				if(vboxVMDataMediator.vmDetailsData[vmid])
					vboxVMDataMediator.vmDetailsData[vmid].GUI.SaveMountedAtRuntime = value;
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