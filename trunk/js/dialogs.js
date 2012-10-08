/**
 * $Id$
 * Copyright (C) 2010-2012 Ian Moore (imoore76 at yahoo dot com)
 */

/**
 * Run the import appliance wizard
 */
function vboxWizardImportApplianceInit() {

	var l = new vboxLoader();
	l.add('vboxGetEnumerationMap',function(d){$('#vboxPane').data('vboxNetworkAdapterTypes',d);},{'class':'NetworkAdapterType'});
	l.add('vboxGetEnumerationMap',function(d){$('#vboxPane').data('vboxAudioControllerTypes',d);},{'class':'AudioControllerType'});
	
	l.onLoad = function() {

		var vbw = new vboxWizard('wizardImportAppliance',trans('Import Virtual Applicance','UIWizardImportApp'),'images/vbox/vmw_ovf_import_bg.png','import');
		vbw.steps = 2;
		vbw.height = 500;
		vbw.finishText = trans('Import','UIWizardImportApp');
		vbw.context = 'UIWizardImportApp';
		vbw.stepButtons = [
		   {
			   'name' : trans('Restore Defaults','UIWizardImportApp'),
			   'steps' : [-1],
			   'click' : function() {
				   wizardImportApplianceParsed();
			   }
		   }
		];
		vbw.onFinish = function(wiz,dialog) {
		
			var file = $(document.forms['frmwizardImportAppliance'].elements.wizardImportApplianceLocation).val();
			var descriptions = $('#vboxImportProps').data('descriptions');
			var reinitNetwork = document.forms['frmwizardImportAppliance'].elements.vboxImportReinitNetwork.checked;
			
			// Check for descriptions
			if(!descriptions) {
				return;
			}
			
			/** Call Appliance import AJAX function */
			var vboxImportApp = function() {
				
				$(dialog).trigger('close').empty().remove();
				
				var l = new vboxLoader();
				l.add('applianceImport',function(d){
					if(d && d.progress) {
						vboxProgress(d.progress,function(){
							// Imported media must be refreshed
							var ml = new vboxLoader();
							ml.add('vboxGetMedia',function(d){$('#vboxPane').data('vboxMedia',d);});
							ml.run();
						},'progress_import_90px.png',trans('Import an appliance into VirtualBox','UIActionPool').replace(/\.+$/g,''),false,vboxBasename(file));
					}
				},{'descriptions':descriptions,'file':file,'reinitNetwork':reinitNetwork});
				l.run();				
			};
			
			// license agreements
			var licenses = [];
			
			// Step through each VM and obtain value
			for(var a = 0; a < descriptions.length; a++) {
				var children = $('#vboxImportProps').children('tr.vboxChildOf'+a);
				descriptions[a][5] = []; // enabled / disabled
				var lic = null;
				var vmname = null;
				for(var b = 0; b < children.length; b++) {
					descriptions[a][5][b] = !$(children[b]).data('propdisabled');
					descriptions[a][3][$(children[b]).data('descOrder')] = $(children[b]).children('td:eq(1)').data('descValue');
					// check for license
					if(descriptions[a][0][b] == 'License') {
						lic = descriptions[a][2][b];
					} else if(descriptions[a][0][b] == 'Name') {
						vmname = descriptions[a][2][b]; 
					}
				}
				if(lic) {
					if(!vmname) vmname = trans('Virtual System %1','UIApplianceEditorWidget').replace('%1',a);
					licenses[licenses.length] = {'name':vmname,'license':lic};
				}
			}

			
			if(licenses.length) {
				
				var msg = trans('<b>The virtual system "%1" requires that you agree to the terms and conditions of the software license agreement shown below.</b><br /><br />Click <b>Agree</b> to continue or click <b>Disagree</b> to cancel the import.','UIImportLicenseViewer');
				var a = 0;
				var buttons = {};
				buttons[trans('Agree','UIImportLicenseViewer')] = function() {

					a++;
					if(a >= licenses.length) {
						$(this).remove();
						vboxImportApp();
						return;
					}
					$(this).dialog('close');
					$('#vboxImportWizLicTitle').html(msg.replace('%1',licenses[a]['name']));
					$('#vboxImportWizLicContent').val(licenses[a]['license']);
					$(this).dialog('open');

				};
				buttons[trans('Disagree','UIImportLicenseViewer')] = function() {
					$(this).remove();
				};
				
				var dlg = $('<div />').dialog({'closeOnEscape':false,'width':600,'height':500,'buttons':buttons,'modal':true,'autoOpen':false,'stack':true,'dialogClass':'vboxDialogContent vboxWizard','title':'<img src="images/vbox/os_type_16px.png" class="vboxDialogTitleIcon" /> ' + trans('Software License Agreement','UIImportLicenseViewer')});
				
				$(dlg).html('<p id="vboxImportWizLicTitle" /><textarea rows="20" spellcheck="false" wrap="off" readonly="true"id="vboxImportWizLicContent" style="width:100%; margin:2px; padding:2px;"></textarea>');
				$('#vboxImportWizLicTitle').html(msg.replace('%1',licenses[a]['name']));
				$('#vboxImportWizLicContent').val(licenses[a]['license']);
				$(dlg).dialog('open');

			} else {
				vboxImportApp();				
			}
			
	
		};
		vbw.run();
	};
	l.run();
}

/**
 * Run the export appliance wizard
 */
function vboxWizardExportApplianceInit() {

	var vbw = new vboxWizard('wizardExportAppliance',trans('Export Virtual Appliance','UIWizardExportApp'),'images/vbox/vmw_ovf_export_bg.png','export');
	vbw.steps = 4;
	vbw.height = 500;
	vbw.context = 'UIWizardExportApp';
	vbw.finishText = trans('Export','UIWizardExportApp');
	vbw.stepButtons = [
	   {
		   'name' : trans('Restore Defaults','UIWizardExportApp'),
		   'steps' : [-1],
		   'click' : function(e) {
			   // Remove export VM properties
			   $('#vboxExportProps').children().remove();
			   // Re-trigger adding them
			   if(vbw.mode == 'advanced')
				   vboxWizardExportApplianceUpdateList();
			   else
				   $('#wizardExportApplianceStep4').trigger('show',e,vbw);
		   }
	   }
	];

	vbw.onFinish = function(wiz,dialog) {
		
		function vboxExportApp(force) {

			// Each VM
			var vmid = null;
			var vms = {};
			var vmsAndProps = $('#vboxExportProps').children('tr');
			for(var a = 0; a < vmsAndProps.length; a++) {
				if($(vmsAndProps[a]).hasClass('vboxTableParent')) {
					vmid = $(vmsAndProps[a]).data('vm').id;
					vms[vmid] = {};
					vms[vmid]['id'] = vmid;
					continue;
				}
				
				var prop = $(vmsAndProps[a]).data('vmprop');
				vms[vmid][prop] = $(vmsAndProps[a]).children('td:eq(1)').children().first().text();
					
			}

			var file = $(document.forms['frmwizardExportAppliance'].elements.wizardExportApplianceLocation).val();
			var format = (document.forms['frmwizardExportAppliance'].elements.wizardExportApplianceLegacy.checked ? 'ovf-0.9' : '');
			var manifest = (document.forms['frmwizardExportAppliance'].elements.wizardExportApplianceManifest.checked ? 1 : 0);
			var overwrite = force;
			
			var l = new vboxLoader();
			l.add('applianceExport',function(d){
				if(d && d.progress)
					vboxProgress(d.progress,function(){return;},'progress_export_90px.png',
							trans('Export one or more VirtualBox virtual machines as an appliance','UIActionPool').replace(/\.+$/g,''),
							false,vboxBasename(file));
			},{'format':format,'file':file,'vms':vms,'manifest':manifest,'overwrite':overwrite});
			$(dialog).trigger('close').empty().remove();
			l.run();
			
		}

		/* Remove required classes */
		$(document.forms['frmwizardExportAppliance'].elements.wizardExportApplianceLocation).removeClass('vboxRequired');
		$('#vboxExportAppVMListContainer').removeClass('vboxRequired');
		
		/* Some vms must be selected */
		if($('#vboxExportProps').children('tr').length == 0) {
			$('#vboxExportAppVMListContainer').addClass('vboxRequired');
			return;
		}
		
		/* Check to see if file exists */
		var loc = $(document.forms['frmwizardExportAppliance'].elements.wizardExportApplianceLocation).val();
		if(!loc) {
			$(document.forms['frmwizardExportAppliance'].elements.wizardExportApplianceLocation).addClass('vboxRequired');
			return;
		}
		
		var fileExists = false;
		var fe = new vboxLoader();
		fe.add('fileExists',function(d){
			fileExists = d.exists;
		},{'file':loc});
		fe.onLoad = function() { 
			if(fileExists) {
				var buttons = {};
				buttons[trans('Yes','QIMessageBox')] = function() {
					vboxExportApp(1);
					$(this).remove();
				};
				vboxConfirm(trans('A file named <b>%1</b> already exists. Are you sure you want to replace it?<br /><br />Replacing it will overwrite its contents.','UIMessageCenter').replace('%1',vboxBasename(loc)),buttons,trans('No','QIMessageBox'));
				return;
			}
			vboxExportApp(0);
			
		};
		fe.run();



	};
	vbw.run();

}

/**
 * Show the port forwarding configuration dialog
 * @param {Array} rules - list of port forwarding rules to process
 * @param {Function} callback - function to run when "OK" is clicked
 */
function vboxPortForwardConfigInit(rules,callback) {
	var l = new vboxLoader();
	l.addFileToDOM("panes/settingsPortForwarding.html");
	l.onLoad = function(){
		
		vboxSettingsPortForwardingInit(rules);
		
		var resizeTable = function() {
			var h = $('#vboxSettingsPortForwarding').children('table').hide().parent().innerHeight() - 16;
			$('#vboxSettingsPortForwarding').children('table').css({'height':h+'px'}).show();
			$('#vboxSettingsPortForwardingListDiv').css({'height':(h-6)+'px','overflow':'auto'});
			
			
		};
		
		var buttons = {};
		buttons[trans('OK','QIMessageBox')] = function(){
			// Get rules
			var rules = $('#vboxSettingsPortForwardingList').children('tr');
			var rulesToPass = new Array();
			for(var i = 0; i < rules.length; i++) {
				if($(rules[i]).data('vboxRule')[3] == 0 || $(rules[i]).data('vboxRule')[5] == 0) {
					vboxAlert(trans("The current port forwarding rules are not valid. " +
				               "None of the host or guest port values may be set to zero.",'UIMessageCenter'));
					return;
				}
				rulesToPass[i] = $(rules[i]).data('vboxRule');
			}
			callback(rulesToPass);
			$(this).trigger('close').empty().remove();
		};
		buttons[trans('Cancel','QIMessageBox')] = function(){$(this).trigger('close').empty().remove();};
		
		$('#vboxSettingsPortForwarding').dialog({'closeOnEscape':true,'width':600,'height':400,'buttons':buttons,'modal':true,'autoOpen':true,'stack':true,'dialogClass':'vboxDialogContent','title':'<img src="images/vbox/nw_16px.png" class="vboxDialogTitleIcon" /> ' + trans('Port Forwarding Rules','UIMachineSettingsPortForwardingDlg')}).bind("dialogbeforeclose",function(){
	    	$(this).parent().find('span:contains("'+trans('Cancel','QIMessageBox')+'")').trigger('click');
	    }).bind('dialogresizestop',resizeTable);
		
		resizeTable();
	};
	l.run();
}

/**
 * Run the New Virtual Machine Wizard
 * @param {Function} callback - function to run after VM creation
 * @param {String} vmgroup - VM group to add machine to
 */
function vboxWizardNewVMInit(callback, vmgroup) {

	var l = new vboxLoader();
	l.add('vboxGetMedia',function(d){$('#vboxPane').data('vboxMedia',d);});
	
	l.onLoad = function() {

		
		var vbw = new vboxWizard('wizardNewVM',trans('Create Virtual Machine','UIWizardNewVM'),'images/vbox/vmw_new_welcome_bg.png','new');
		vbw.steps = 3;
		vbw.vmgroup = vmgroup;
		vbw.context = 'UIWizardNewVM';
		vbw.finishText = trans('Create','UIWizardNewVM');
		vbw.onFinish = function(wiz,dialog) {

			// Callback to finish wizard
			var vboxNewVMFinish = function() {
				
				// Get parameters
				var disk = '';
				if(document.forms['frmwizardNewVM'].newVMDisk[2].checked) {
					disk = document.forms['frmwizardNewVM'].newVMDiskSelect.options[document.forms['frmwizardNewVM'].newVMDiskSelect.selectedIndex].value;
					disk = vboxMedia.getMediumById(disk).location;
				}
				var name = jQuery.trim(document.forms['frmwizardNewVM'].newVMName.value);
				var ostype = document.forms['frmwizardNewVM'].newVMOSType.options[document.forms['frmwizardNewVM'].newVMOSType.selectedIndex].value;
				var mem = parseInt(document.forms['frmwizardNewVM'].wizardNewVMSizeValue.value);
				
				vboxAjaxRequest('machineCreate',{'disk':disk,'ostype':ostype,'memory':mem,'name':name,'group':vmgroup},function(res){
					if(res && res.result) {
						$(dialog).trigger('close').empty().remove();
						var lm = new vboxLoader();
						lm.add('vboxGetMedia',function(d){$('#vboxPane').data('vboxMedia',d);});
						lm.onLoad = function(){
							if(callback) callback();
						};
						lm.run();
					} else if(res && res.exists) {
						
						vboxAlert(trans('<p>Cannot create the machine folder <b>%1</b> in the parent folder <nobr><b>%2</b>.</nobr></p><p>This folder already exists and possibly belongs to another machine.</p>','UIMessageCenter').replace('%1',vboxBasename(res.exists)).replace('%2',vboxDirname(res.exists)));

						
					}
				});			
				
			};
			
			// Name must exist
			if(!jQuery.trim(document.forms['frmwizardNewVM'].newVMName.value)) {
				$(document.forms['frmwizardNewVM'].newVMName).addClass('vboxRequired');
				return;
			}
			$(document.forms['frmwizardNewVM'].newVMName).removeClass('vboxRequired');
			
			// Make sure file does not exist
			var fnl = new vboxLoader();
			fnl.add('vboxGetComposedMachineFilename',function(d){
				
				loc = vboxDirname(d.file);
				
				var fe = new vboxLoader();
				fe.add('fileExists',function(d){
					fileExists = d.exists;
				},{'file':loc});
				fe.onLoad = function() { 
					
					if(fileExists) {
						
						vboxAlert(trans('<p>Cannot create the machine folder <b>%1</b> in the parent folder <nobr><b>%2</b>.</nobr></p><p>This folder already exists and possibly belongs to another machine.</p>','UIMessageCenter').replace('%1',vboxBasename(loc)).replace('%2',vboxDirname(loc)));
						// Go back
						wiz.displayStep(1);
						
						return;
					}
					
					// Start new harddisk wizard if create new is selected
					if(document.forms['frmwizardNewVM'].newVMDisk[1].checked) {
						
						// Recommended size
						var size = newVMOSTypesObj[document.forms['frmwizardNewVM'].newVMOSType.options[document.forms['frmwizardNewVM'].newVMOSType.selectedIndex].value].recommendedHDD;
						
						vboxWizardNewHDInit(function(med){
							
							// Wizard errored or was cancelled
							if(!med) { return; }
							
							$(document.forms['frmwizardNewVM'].newVMDisk[2]).trigger('click').attr('checked',true);
							
							// Add newly created disk as option and select it
							vmNewFillExistingDisks(med);
							
							vboxNewVMFinish();
							
						},{'name':jQuery.trim(document.forms['frmwizardNewVM'].newVMName.value),'size':size,'group':vmgroup});
						
						return;
						
					} else if(document.forms['frmwizardNewVM'].newVMDisk[0].checked) {
						
						buttons = {};
						buttons[trans('Continue','UIMessageCenter')] = function(){
							$(this).empty().remove();
							vboxNewVMFinish();
						};
						vboxConfirm(trans('You are about to create a new virtual machine without a hard drive. You will not be able to install an operating system on the machine until you add one. In the mean time you will only be able to start the machine using a virtual optical disk or from the network.','UIMessageCenter'), buttons, trans('Go Back','UIMessageCenter'));
						return;
					}
					
					vboxNewVMFinish();
					
				};
				fe.run();
				
				
			},{'name':document.forms['frmwizardNewVM'].newVMName.value, 'group':vmgroup});
			
			fnl.run();
		};
		vbw.run();
	};
	l.run();
	
}

/**
 * Run the Clone Virtual Machine Wizard
 * @param {Function} callback - callback to run after VM is cloned
 * @param {Object} args - wizard data - args.vm and args.snapshot should be populated
 * @see vboxWizard()
 */
function vboxWizardCloneVMInit(callback,args) {
	
	var l = new vboxLoader();
	l.showLoading();
	
	$.when(vboxVMDataMediator.getVMDetails(args.vm.id)).then(function(d){
		
		l.removeLoading();
				
		var vbw = new vboxWizard('wizardCloneVM',trans('Clone Virtual Machine','UIWizardCloneVM'),'images/vbox/vmw_clone_bg.png','vm_clone');		
		vbw.steps = (args.vm.snapshotCount > 0 ? 3 : 2);
		vbw.args = args;
		vbw.finishText = trans('Clone','UIWizardCloneVM');
		vbw.context = 'UIWizardCloneVM';
		vbw.widthAdvanced = 450;
		vbw.heightAdvanced = 350;
		
		vbw.onFinish = function(wiz,dialog) {
	
			// Get parameters
			var name = jQuery.trim(document.forms['frmwizardCloneVM'].elements.machineCloneName.value);
			var src = vbw.args.vm.id;
			var snapshot = vbw.args.snapshot;
			var allNetcards = document.forms['frmwizardCloneVM'].elements.vboxCloneReinitNetwork.checked;
			
			if(!name) {
				$(document.forms['frmwizardCloneVM'].elements.machineCloneName).addClass('vboxRequired');
				return;
			}

			
			// Only two steps? We can assume that state has no child states.
			// Force current state only
			var vmState = 'MachineState';
			if(wiz.steps > 2) {
				for(var a = 0; a < document.forms['frmwizardCloneVM'].elements.vmState.length; a++) {
					if(document.forms['frmwizardCloneVM'].elements.vmState[a].checked) {
						vmState = document.forms['frmwizardCloneVM'].elements.vmState[a].value;
						break;
					};
				};
			}
			
			// Full / linked clone
			var cLink = 0;
			if(document.forms['frmwizardCloneVM'].elements.vboxCloneType[1].checked) cLink = 1;			
			
			// wrap function
			var vbClone = function(sn) {
				
				var l = new vboxLoader();
				l.add('machineClone',function(d,e){
					var registerVM = null;
					if(d && d.settingsFilePath) {
						registerVM = d.settingsFilePath;
					}
					if(d && d.progress) {
						vboxProgress(d.progress,function(ret) {
							vboxAjaxRequest('machineAdd',{'file':registerVM},function(){
								var ml = new vboxLoader();
								ml.add('vboxGetMedia',function(dat){$('#vboxPane').data('vboxMedia',dat);});
								ml.onLoad = function() {
									callback();
								};
								ml.run();
							});
						},'progress_clone_90px.png',trans('Clone the selected virtual machine','UIActionPool'),false,
							vbw.args.vm.name + ' > ' + name);
					} else {
						callback();
					};
				},{'name':name,'vmState':vmState,'src':src,'snapshot':sn,'reinitNetwork':allNetcards,'link':cLink});
				l.run();				
			};
			
			// Check for linked clone, but not a snapshot
			if(cLink && !wiz.args.snapshot) {
	  	  		var sl = new vboxLoader();
	  	  		sl.add('snapshotTake',function(d){
					if(d && d.progress) {
						vboxProgress(d.progress,function(){
							var ml = new vboxLoader();
							ml.showLoading();
							$.when(vboxVMDataMediator.getVMDetails(src)).then(function(md){
								ml.removeLoading();
								vbClone(md.currentSnapshot);								
							});
						},'progress_snapshot_create_90px.png',trans('Take a snapshot of the current virtual machine state','UIActionPool'),false,vbw.args.vm.name);
					} else if(d && d.error) {
						vboxAlert(d.error);
					}
	 	  		},{'vm':src,'name':trans('Linked Base for %1 and %2','UIWizardCloneVM').replace('%1',wiz.args.vm.name).replace('%2',name),'description':''});
				sl.run();
				
			// Just clone
			} else {
				vbClone(snapshot);
			}
			
			$(dialog).trigger('close').empty().remove();
	
		};
		vbw.run();
	});
}

/**
 * Run the VM Log Viewer dialog
 * @param {String} vm - uuid or name of virtual machine to obtain logs for
 */
function vboxShowLogsDialogInit(vm) {

	$('#vboxPane').append($('<div />').attr({'id':'vboxVMLogsDialog'}));
	
	var l = new vboxLoader();
	l.add('machineGetLogFilesInfo',function(r){
		$('#vboxVMLogsDialog').data({'logs':r.logs,'logpath':r.path});
	},{'vm':vm.id});
	l.addFileToDOM('panes/vmlogs.html',$('#vboxVMLogsDialog'));
	l.onLoad = function(){
		var buttons = {};
		buttons[trans('Refresh','UIVMLogViewer')] = function() {
			l = new vboxLoader();
			l.add('machineGetLogFilesInfo',function(r){
				$('#vboxVMLogsDialog').data({'logs':r.logs,'logpath':r.path});
				
			},{'vm':vm.id});
			l.onLoad = function(){
				vboxShowLogsInit(vm);
			};
			l.run();
		};
		buttons[trans('Close','UIVMLogViewer')] = function(){$(this).trigger('close').empty().remove();};
		$('#vboxVMLogsDialog').dialog({'closeOnEscape':true,'width':800,'height':500,'buttons':buttons,'modal':true,'autoOpen':true,'stack':true,'dialogClass':'vboxDialogContent','title':'<img src="images/vbox/show_logs_16px.png" class="vboxDialogTitleIcon" /> '+ trans('%1 - VirtualBox Log Viewer','UIVMLogViewer').replace('%1',vm.name)}).bind("dialogbeforeclose",function(){
	    	$(this).parent().find('span:contains("'+trans('Close','UIVMLogViewer')+'")').trigger('click');
	    });
		vboxShowLogsInit(vm);
	};
	l.run();

}

/**
 * Show the Virtual Media Manager Dialog
 * @param {Function} callback - optional function to run if media is selected and "OK" is clicked
 * @param {String} type - optionally restrict media to media of this type
 * @param {Boolean} hideDiff - optionally hide differencing HardDisk media
 * @param {String} mPath - optional path to use when adding or creating media through the VMM dialog
 */
function vboxVMMDialogInit(callback,type,hideDiff,mPath) {

	$('#vboxPane').append($('<div />').attr({'id':'vboxVMMDialog','class':'vboxVMMDialog'}));
			
	var l = new vboxLoader();
	l.add('getConfig',function(d){$('#vboxPane').data('vboxConfig',d);});
	l.add('vboxSystemPropertiesGet',function(d){$('#vboxPane').data('vboxSystemProperties',d);});
	l.add('vboxGetMedia',function(d){$('#vboxPane').data('vboxMedia',d);});
	l.addFileToDOM('panes/vmm.html',$('#vboxVMMDialog'));
	l.onLoad = function() {
		var buttons = {};
		if(callback) {
			buttons[trans('Select','UIMediumManager')] = function() {
				var sel = null;
				switch($("#vboxVMMTabs").tabs('option','selected')) {
					case 0: /* HardDisks */
						sel = $('#vboxVMMHDList').find('tr.vboxListItemSelected').first();
						break;
					case 1: /* DVD */
						sel = $('#vboxVMMCDList').find('tr.vboxListItemSelected').first();
						break;
					default:
						sel = $('#vboxVMMFDList').find('tr.vboxListItemSelected').first();
				}
				if($(sel).length) {
					vboxMedia.updateRecent(vboxMedia.getMediumById($(sel).data('medium')));
					callback($(sel).data('medium'));
				}
				$('#vboxVMMDialog').trigger('close').empty().remove();
			};
		}
		buttons[trans('Close','UIMediumManager')] = function() {
			$('#vboxVMMDialog').trigger('close').empty().remove();
			if(callback) callback(null);
		};

		$("#vboxVMMDialog").dialog({'closeOnEscape':true,'width':800,'height':500,'buttons':buttons,'modal':true,'autoOpen':true,'stack':true,'dialogClass':'vboxDialogContent vboxVMMDialog','title':'<img src="images/vbox/diskimage_16px.png" class="vboxDialogTitleIcon" /> '+trans('Virtual Media Manager','VBoxMediaManagerDlg')}).bind("dialogbeforeclose",function(){
	    	$(this).parent().find('span:contains("'+trans('Close','VBoxMediaManagerDlg')+'")').trigger('click');
	    });
		
		vboxVMMInit(hideDiff,mPath);
		
		if(type) {
			switch(type) {
				case 'HardDisk':
					$("#vboxVMMTabs").tabs('select',0);
					$("#vboxVMMTabs").tabs('disable',1);
					$("#vboxVMMTabs").tabs('disable',2);					
					break;
				case 'DVD':
					$("#vboxVMMTabs").tabs('select',1);
					$("#vboxVMMTabs").tabs('disable',0);
					$("#vboxVMMTabs").tabs('disable',2);					
					break;
				case 'Floppy':
					$("#vboxVMMTabs").tabs('select',2);
					$("#vboxVMMTabs").tabs('disable',0);
					$("#vboxVMMTabs").tabs('disable',1);
					break;
				default:
					$("#vboxVMMTabs").tabs('select',0);
					break;
			}
		}
	};
	l.run();
}

/**
 * Run the New Virtual Disk wizard
 * @param {Function} callback - callback function to run when new disk is created
 * @param {Object} suggested - sugggested defaults such as hard disk name and path
 */
function vboxWizardNewHDInit(callback,suggested) {

	var l = new vboxLoader();
	l.add('vboxSystemPropertiesGet',function(d){$('#vboxPane').data('vboxSystemProperties',d);});
	l.add('vboxGetMedia',function(d){$('#vboxPane').data('vboxMedia',d);});
	
	// Compose folder if suggested name exists
	if(suggested && suggested.name) {
		if(!suggested['group']) suggested.group = '';
		l.add('vboxGetComposedMachineFilename',function(d){ suggested.path = vboxDirname(d.file)+$('#vboxPane').data('vboxConfig').DSEP;},{'name':suggested.name, 'group':suggested.group});
	}
	l.onLoad = function() {
		
		var vbw = new vboxWizard('wizardNewHD',trans('Create Virtual Hard Drive','UIWizardNewVD'),'images/vbox/vmw_new_harddisk_bg.png','hd');
		vbw.steps = 3;
		vbw.suggested = suggested;
		vbw.context = 'UIWizardNewVD';
		vbw.finishText = trans('Create','UIWizardNewVD');
		vbw.height = 450;
		
		vbw.onFinish = function(wiz,dialog) {

			// Fix size if we need to
			var mbytes = vboxConvertMbytes(document.forms['frmwizardNewHD'].elements.wizardNewHDSizeValue.value);
			document.forms['frmwizardNewHD'].elements.wizardNewHDSizeValue.value = vboxMbytesConvert(mbytes);
			$('#wizardNewHDSizeLabel').html(document.forms['frmwizardNewHD'].elements.wizardNewHDSizeValue.value + ' ('+mbytes+' '+trans('MB','VBoxGlobal')+')');

			// Determine file location
			var file = document.forms['frmwizardNewHD'].elements.wizardNewHDLocation.value;
			if(file.search(/[\/|\\]/) < 0) {
				// just a name
				if(suggested.path) {
					if($('#vboxPane').data('vboxConfig').enforceVMOwnership==true){
						file = suggested.path + $('#vboxPane').data('vboxSession').user + "_" + file;	
					}else{ file = suggested.path + file; }
				} else{
					if($('#vboxPane').data('vboxConfig').enforceVMOwnership==true){
						file = $('#vboxPane').data('vboxSystemProperties').homeFolder + $('#vboxPane').data('vboxConfig').DSEP + $('#vboxPane').data('vboxSession').user + "_" + file;
					}else{ file = $('#vboxPane').data('vboxSystemProperties').homeFolder + $('#vboxPane').data('vboxConfig').DSEP + file; }
				}
			}else{
				// using a certain folder
					if($('#vboxPane').data('vboxConfig').enforceVMOwnership==true){
						// has user ownership so use folderbased 
						var nameIndex = file.lastIndexOf($('#vboxPane').data('vboxConfig').DSEP);
						var path = file.substr(0,nameIndex);
						var name = file.substr(nameIndex+1,file.length);
						file = path +$('#vboxPane').data('vboxConfig').DSEP + $('#vboxPane').data('vboxSession').user + "_" + name;
					}
			}

			var format = document.forms['frmwizardNewHD'].elements['newHardDiskFileType'];
			var formatOpts = {};
			for(var i = 0; i < format.length; i++) {
				if(format[i].checked) {
					formatOpts = $(format[i]).closest('tr').data('vboxFormat');
					format=format[i].value;
					break;
				}
			}

			// append filename ext?
			if(jQuery.inArray(file.substring(file.lastIndexOf('.')+1).toLowerCase(),formatOpts.extensions) < 0) {
				file += '.'+formatOpts.extensions[0];
			}
			
			/* Check to see if file exists */
			var fileExists = false;
			var l = new vboxLoader();
			l.add('fileExists',function(d){
				fileExists = d.exists;
			},{'file':file});
			l.onLoad = function() { 
				if(fileExists) {
					vboxAlert(trans("<p>The hard disk storage unit at location <b>%1</b> already " +
					           "exists. You cannot create a new virtual hard disk that uses this " +
					           "location because it can be already used by another virtual hard " +
					           "disk.</p>" +
					           "<p>Please specify a different location.</p>",'UIMessageCenter').replace('%1',file));
					return;
				}
				var fsplit = (document.forms['frmwizardNewHD'].newHardDiskSplit.checked ? 1 : 0);
				var size = vboxConvertMbytes(document.forms['frmwizardNewHD'].elements.wizardNewHDSizeValue.value);
				var type = (document.forms['frmwizardNewHD'].elements.newHardDiskType[1].checked ? 'fixed' : 'dynamic');
				var nl = new vboxLoader();
				nl.add('mediumCreateBaseStorage',function(d){
					if(d && d.progress) {
						vboxProgress(d.progress,function(ret) {
							var ml = new vboxLoader();
							ml.add('vboxGetMedia',function(dat){$('#vboxPane').data('vboxMedia',dat);});
							ml.onLoad = function() {
								var med = vboxMedia.getMediumByLocation(file);
								if(med) {
									vboxMedia.updateRecent(med);
									callback(med.id);									
								} else {
									callback(null);
								}
							};
							ml.run();
						},'progress_media_create_90px.png',trans('Create a new virtual hard drive','VBoxMediaManagerDlg'),
							false,vboxBasename(file),true);
					} else {
						callback();
					}
				},{'file':file,'type':type,'size':size,'format':format,'split':fsplit});
				nl.run();

				$(dialog).trigger('close').empty().remove();
			};
			l.run();
			
		};
		vbw.run();
		
		
	};
	l.run();
	
}

/**
 * Run the Copy Virtual Disk wizard
 * @param {Function} callback - callback function to run when new disk is created
 * @param {Object} suggested - sugggested defaults such as hard disk name and path
 */
function vboxWizardCopyHDInit(callback,suggested) {

	var l = new vboxLoader();
	l.add('vboxSystemPropertiesGet',function(d){$('#vboxPane').data('vboxSystemProperties',d);});
	l.add('vboxGetMedia',function(d){$('#vboxPane').data('vboxMedia',d);});
	
	l.onLoad = function() {
		
		var vbw = new vboxWizard('wizardCopyHD',trans('Copy Virtual Hard Drive','UIWizardCloneVD'),'images/vbox/vmw_new_harddisk_bg.png','hd');
		vbw.steps = 4;
		vbw.suggested = suggested;
		vbw.context = 'UIWizardCloneVD';
		vbw.finishText = trans('Copy','UIWizardCloneVD');
		vbw.height = 450;
		
		vbw.onFinish = function(wiz,dialog) {


			var format = document.forms['frmwizardCopyHD'].elements['copyHDFileType'];
			var formatOpts = {};
			for(var i = 0; i < format.length; i++) {
				if(format[i].checked) {
					formatOpts = $(format[i]).closest('tr').data('vboxFormat');
					break;
				}
			}

			
			var src = $(document.forms['frmwizardCopyHD'].copyHDDiskSelect).val();
			var type = (document.forms['frmwizardCopyHD'].elements.newHardDiskType[1].checked ? 'fixed' : 'dynamic');
			var format = document.forms['frmwizardCopyHD'].elements['copyHDFileType'];
			for(var i = 0; i < format.length; i++) {
				if(format[i].checked) {
					format=format[i].value;
					break;
				}
			}
			var fsplit = (document.forms['frmwizardCopyHD'].newHardDiskSplit.checked && format == 'vmdk' ? 1 : 0);

			var loc = jQuery.trim(document.forms['frmwizardCopyHD'].elements.wizardCopyHDLocation.value);
			if(!loc) {
				$(document.forms['frmwizardCopyHD'].elements.wizardCopyHDLocation).addClass('vboxRequired');
				return;
			}
			$(document.forms['frmwizardCopyHD'].elements.wizardCopyHDLocation).removeClass('vboxRequired');
			if(loc.search(/[\/|\\]/) < 0) {
				if($('#wizardCopyHDStep4').data('suggestedpath')) {
					loc = $('#wizardCopyHDStep4').data('suggestedpath') + loc;
				} else {
					loc = vboxDirname(vboxMedia.getMediumById($(document.forms['frmwizardCopyHD'].copyHDDiskSelect).val()).location) + $('#vboxPane').data('vboxConfig').DSEP + loc;
				}
			}

			// append ext?
			if(jQuery.inArray(loc.substring(loc.lastIndexOf('.')+1).toLowerCase(),formatOpts.extensions) < 0) {
				loc += '.'+formatOpts.extensions[0];
			}
			
			
			/* Check to see if file exists */
			var fileExists = false;
			var fe = new vboxLoader();
			fe.add('fileExists',function(d){
				fileExists = d.exists;
			},{'file':loc});
			fe.onLoad = function() { 
				if(fileExists) {
					vboxAlert(trans("<p>The hard disk storage unit at location <b>%1</b> already " +
					           "exists. You cannot create a new virtual hard disk that uses this " +
					           "location because it can be already used by another virtual hard " +
					           "disk.</p>" +
					           "<p>Please specify a different location.</p>",'UIMessageCenter').replace('%1',loc));
					return;
				}
				$(dialog).trigger('close').empty().remove();
				
				var l = new vboxLoader();
				l.add('mediumCloneTo',function(d,e){
					if(d && d.progress) {
						vboxProgress(d.progress,function(ret,mid) {
							var ml = new vboxLoader();
							ml.add('vboxGetMedia',function(dat){$('#vboxPane').data('vboxMedia',dat);});
							ml.onLoad = function() {
								med = vboxMedia.getMediumByLocation(loc);
								vboxMedia.updateRecent(med);
								callback(mid);
							};
							ml.run();
						},'progress_media_create_90px.png',trans('Copy Virtual Hard Drive','UIWizardCloneVD'),
							false, vboxBasename(vboxMedia.getMediumById(src).location) + ' > ' + vboxBasename(loc));
					} else {
						callback();
					}
				},{'src':vboxMedia.getMediumById(src).location,'type':type,'format':format,'location':loc,'split':fsplit});
				l.run();
			};
			fe.run();

			
		};
		vbw.run();
	};
	l.run();
	
}

/**
 * Display guest network adapters dialog
 * @param {String} vm - virtual machine uuid or name
 */
function vboxGuestNetworkAdaptersDialogInit(vm) {

	/*
	 * 	Dialog
	 */
	$('#vboxPane').append($('<div />').attr({'id':'vboxGuestNetworkDialog','style':'display: none'}));

	/*
	 * Loader
	 */
	var l = new vboxLoader();
	l.addFileToDOM('panes/guestNetAdapters.html',$('#vboxGuestNetworkDialog'));
	l.onLoad = function(){
		
		var buttons = {};
		buttons[trans('Close','UIVMLogViewer')] = function() {$('#vboxGuestNetworkDialog').trigger('close').empty().remove();};
		$('#vboxGuestNetworkDialog').dialog({'closeOnEscape':true,'width':500,'height':250,'buttons':buttons,'modal':true,'autoOpen':true,'stack':true,'dialogClass':'vboxDialogContent','title':'<img src="images/vbox/nw_16px.png" class="vboxDialogTitleIcon" /> ' + trans('Guest Network Adapters','VBoxGlobal')}).bind("dialogbeforeclose",function(){
	    	$(this).parent().find('span:contains("'+trans('Close','UIVMLogViewer')+'")').trigger('click');
	    });
		
		// defined in pane
		vboxVMNetAdaptersInit(vm,nic);
	};
	l.run();
	
}


/**
 * Display Global Preferences dialog
 */

function vboxPrefsInit() {
	
	// Prefs
	var panes = new Array(
		{'name':'GlobalGeneral','label':'General','icon':'machine','context':'UIGlobalSettingsGeneral'},
		{'name':'GlobalLanguage','label':'Language','icon':'site','context':'UIGlobalSettingsLanguage'},
		{'name':'GlobalNetwork','label':'Network','icon':'nw','context':'UIGlobalSettingsNetwork'},
		{'name':'GlobalUsers','label':'Users','icon':'register','context':'UIUsers'}
	);
	
	var data = new Array(
		{'fn':'hostOnlyInterfacesGet','callback':function(d){$('#vboxSettingsDialog').data('vboxHostOnlyInterfaces',d);}},
		{'fn':'vboxSystemPropertiesGet','callback':function(d){$('#vboxSettingsDialog').data('vboxSystemProperties',d);}},
		{'fn':'getUsers','callback':function(d){$('#vboxSettingsDialog').data('vboxUsers',d);}}
	);	
	
	// Check for noAuth setting
	if($('#vboxPane').data('vboxConfig').noAuth || !$('#vboxPane').data('vboxSession').admin || !$('#vboxPane').data('vboxConfig').authCapabilities.canModifyUsers) {
		panes.pop();
		data.pop();
	}
	
	vboxSettingsDialog(trans('Preferences...','UIActionPool').replace(/\./g,''),panes,data,function(canceled){

		// Do nothing if canceled
		if(canceled) return;
		
		var l = new vboxLoader();

		// Language change?
		if($('#vboxSettingsDialog').data('language') && $('#vboxSettingsDialog').data('language') != __vboxLangName) {
			vboxSetCookie('vboxLanguage',$('#vboxSettingsDialog').data('language'));
			l.onLoad = function(){location.reload(true);};
			
		}
		l.add('hostOnlyInterfacesSave',function(){},{'networkInterfaces':$('#vboxSettingsDialog').data('vboxHostOnlyInterfaces').networkInterfaces});
		l.add('vboxSystemPropertiesSave',function(){},{'SystemProperties':$('#vboxSettingsDialog').data('vboxSystemProperties')});
		l.run();
		
		// Update default machine folder
		$('#vboxPane').data('vboxSystemProperties').defaultMachineFolder = $('#vboxSettingsDialog').data('vboxSystemProperties').defaultMachineFolder;
		
	},null,'global_settings','UISettingsDialogGlobal');
}



/**
 * Display a virtual machine settings dialog
 * @param {String} vm - uuid or name of virtual machine
 * @param {Function} callback - callback function to perform after settings have been saved
 * @param {String} pane - optionally automatically select pane when dialog is displayed
 */
function vboxVMsettingsInit(vm,callback,pane) {
	
	if(typeof(vm) == 'string')
		vm = vboxVMDataMediator.getVMData(vm);
	
	$.when(vboxVMDataMediator.getVMDataCombined(vm.id)).then(function(vmData) {
		
		var panes = new Array(
		
			{'name':'General','label':'General','icon':'machine','tabbed':true,'context':'UIMachineSettingsGeneral'},
			{'name':'System','label':'System','icon':'chipset','tabbed':true,'context':'UIMachineSettingsSystem'},
			{'name':'Display','label':'Display','icon':'vrdp','tabbed':true,'context':'UIMachineSettingsDisplay'},
			{'name':'Storage','label':'Storage','icon':'attachment','context':'UIMachineSettingsStorage'},
			{'name':'Audio','label':'Audio','icon':'sound','context':'UIMachineSettingsAudio'},
			{'name':'Network','label':'Network','icon':'nw','tabbed':true,'context':'UIMachineSettingsNetwork'},
			{'name':'SerialPorts','label':'Serial Ports','icon':'serial_port','tabbed':true,'context':'UIMachineSettingsSerial'},
			{'name':'ParallelPorts','label':'Parallel Ports','icon':'parallel_port','tabbed':true,'disabled':(!$('#vboxPane').data('vboxConfig').enableLPTConfig),'context':'UIMachineSettingsParallel'},
			{'name':'USB','label':'USB','icon':'usb','context':'UIMachineSettingsUSB'},
			{'name':'SharedFolders','label':'Shared Folders','icon':'shared_folder','context':'UIMachineSettingsSF'}
				
		);
		
		var data = new Array(
			{'fn':'vboxGetMedia','callback':function(d){
				$('#vboxPane').data('vboxMedia',d);
				
				// data received from deferred object
				$('#vboxSettingsDialog').data('vboxMachineData',vmData);
				$('#vboxSettingsDialog').data('vboxFullEdit', (vboxVMStates.isPoweredOff(vmData) && !vboxVMStates.isSaved(vmData)));
				
			}},
			{'fn':'hostGetNetworking','callback':function(d){$('#vboxSettingsDialog').data('vboxHostNetworking',d);}},
			{'fn':'hostGetDetails','callback':function(d){$('#vboxSettingsDialog').data('vboxHostDetails',d);}},
			{'fn':'vboxGetEnumerationMap','callback':function(d){$('#vboxSettingsDialog').data('vboxNetworkAdapterTypes',d);},'args':{'class':'NetworkAdapterType'}},
			{'fn':'vboxGetEnumerationMap','callback':function(d){$('#vboxSettingsDialog').data('vboxAudioControllerTypes',d);},'args':{'class':'AudioControllerType'}},
			{'fn':'vboxRecentMediaGet','callback':function(d){$('#vboxPane').data('vboxRecentMedia',d);}},
			{'fn':'consoleGetSharedFolders','callback':function(d){$('#vboxSettingsDialog').data('vboxTransientSharedFolders',d);},'args':{'vm':vm.id}}
	
		);
	
		vboxSettingsDialog(vmData.name + ' - ' + trans('Settings','UISettingsDialog'),panes,data,function(canceled) {
			
			if(canceled) return;
			
			var loader = new vboxLoader();
			var sdata = $.extend($('#vboxSettingsDialog').data('vboxMachineData'),{'clientConfig':$('#vboxPane').data('vboxConfig')});
			loader.add('machineSave',function(){return;},sdata);
			loader.onLoad = function() {
				// Refresh media
				var mload = new vboxLoader();
				mload.add('vboxGetMedia',function(d){$('#vboxPane').data('vboxMedia',d);});
				mload.onLoad = function() {
					if(callback){callback();}
				};
				mload.run();
			};
			loader.run();
		},pane,'settings','UISettingsDialogMachine');
		
	});
}



/**
 * Display a settings dialog (generic) called by dialog initializers
 * @param {String} title - title of dialog
 * @param {Array} panes - list of panes {Object} to load
 * @param {Object} data - list of data to load
 * @param {Function} onsave - callback function to run when "OK" is clicked
 * @param {String} pane - optionally automatically select pane when dialog is shown
 * @param {String} icon - optional URL to icon for dialog
 * @param {String} langContext - language context to use for translations
 * @see trans()
 */
function vboxSettingsDialog(title,panes,data,onsave,pane,icon,langContext) {
	
	var d = $('<div />').attr({'id':'vboxSettingsDialog','style':'display: none;'});
	
	var f = $('<form />').attr({'name':'frmVboxSettings','style':'height: 100%'});
	
	var t = $('<table />').attr({'style':'height: 100%;','class':'vboxSettingsTable'});
	
	var tr = $('<tr />');
	
	$($('<td />').attr({'id':'vboxSettingsMenu','style': (panes.length == 1 ? 'display:none;' : '')})).append($('<ul />').attr({'id':'vboxSettingsMenuList','class':'vboxHover'})).appendTo(tr);
	
	var td = $('<td />').attr({'id':'vboxSettingsPane'}).css({'height':'100%'});
	
	// Settings table contains title and visible settings pane
	var stbl = $('<table />').css({'height':'100%','width':'100%','padding':'0px','margin':'0px','border':'0px','border-spacing':'0px'});
	
	// Title
	var d1 = $('<div />').attr({'id':'vboxSettingsTitle'}).html('Padding').css({'display':(panes.length == 1 ? 'none' : '')});
	$(stbl).append($('<tr />').append($('<td />').css({'height':'1%','padding':'0px','margin':'0px','border':'0px'}).append(d1)));
	
	
	// Settings pane
	var d1 = $('<div />').attr({'id':'vboxSettingsList'}).css({'width':'100%'});
	
	$(stbl).append($('<tr />').append($('<td />').css({'padding':'0px','margin':'0px','border':'0px'}).append(d1)));
	
	
	$(td).append(stbl).appendTo(tr);
	
	$(d).append($(f).append($(t).append(tr))).appendTo('#vboxPane');
	
	/* Load panes and data */
	var loader = new vboxLoader();
	
	/* Load Data */
	for(var i = 0; i < data.length; i++) {
		loader.add(data[i].fn,data[i].callback,(data[i].args ? data[i].args : undefined));
	}

	/* Load settings panes */
	for(var i = 0; i < panes.length; i++) {
		
		if(panes[i].disabled) continue;
		
		// Menu item
		$('<li />').html('<div><img src="images/vbox/'+panes[i].icon+'_16px.png" /></div> <div>'+trans(panes[i].label,langContext)+'</div>').data(panes[i]).click(function(){
			
			$('#vboxSettingsTitle').html(trans($(this).data('label'),langContext));
			
			$(this).addClass('vboxListItemSelected').siblings().addClass('vboxListItem').removeClass('vboxListItemSelected');
			
			// jquery apply this css to everything with class .settingsPa..
			$('#vboxSettingsDialog .vboxSettingsPaneSection').css({'display':'none'});
			
			// Show selected pane
			$('#vboxSettingsPane-' + $(this).data('name')).css({'display':''}).children().first().trigger('show');
			
			// Opera hidden select box bug
			////////////////////////////////
			if($.browser.opera) {
				$('#vboxSettingsPane-' + $(this).data('name')).find('select').trigger('show');
			}

		}).hover(function(){$(this).addClass('vboxHover');},function(){$(this).removeClass('vboxHover');}).appendTo($('#vboxSettingsMenuList'));
		
		
		// Settings pane
		$('#vboxSettingsList').append($('<div />').attr({'id':'vboxSettingsPane-'+panes[i].name,'style':'display: none;','class':'vboxSettingsPaneSection ui-corner-all ' + (panes[i].tabbed ? 'vboxTabbed' : 'vboxNonTabbed')}));
		
		loader.addFileToDOM('panes/settings'+panes[i].name+'.html',$('#vboxSettingsPane-'+panes[i].name));
		
	}

	loader.onLoad = function(){
		
		/* Init UI Items */
		for(var i = 0; i < panes.length; i++) {
			vboxInitDisplay($('#vboxSettingsPane-'+panes[i].name),panes[i].context);
			if(panes[i].tabbed) $('#vboxSettingsPane-'+panes[i].name).tabs();
		}
		
		// Opera hidden select box bug
		////////////////////////////////
		if($.browser.opera) {
			$('#vboxSettingsPane').find('select').bind('change',function(){
				$(this).data('vboxSelected',$(this).val());
			}).bind('show',function(){
				$(this).val($(this).data('vboxSelected'));
			}).each(function(){
				$(this).data('vboxSelected',$(this).val());
			});
		}

		var buttons = { };
		buttons[trans('OK','QIMessageBox')] = function() {
			
			// Opera hidden select bug
			if($.browser.opera) {
				$('#vboxSettingsPane').find('select').each(function(){
					$(this).val($(this).data('vboxSelected'));
				});
			}
			
			$(this).trigger('save');
			onsave(false);
			$(this).trigger('close').empty().remove();
			$(document).trigger('click');
		};
		buttons[trans('Cancel','QIMessageBox')] = function() {
			onsave(true);
			$('#vboxSettingsDialog').trigger('close').empty().remove();
			$(document).trigger('click');
		};

		
		// Show dialog
	    $('#vboxSettingsDialog').dialog({'closeOnEscape':true,'width':(panes.length > 1 ? 900 : 600),'height':(panes.length > 1 ? 500 : 450),'buttons':buttons,'modal':true,'autoOpen':true,'stack':true,'dialogClass':'vboxSettingsDialog vboxDialogContent','title':(icon ? '<img src="images/vbox/'+icon+'_16px.png" class="vboxDialogTitleIcon" /> ' : '') + title}).bind("dialogbeforeclose",function(){
	    	$(this).parent().find('span:contains("'+trans('Cancel','QIMessageBox')+'")').trigger('click');
	    });

	    // Resize pane
	    $('#vboxSettingsList').height($('#vboxSettingsList').parent().innerHeight()-8).css({'overflow':'auto','padding':'0px','margin-top':'8px','border':'0px','border-spacing':'0px'});
	    
	    // Resizing dialog, resizes this too
	    $('#vboxSettingsDialog').bind('dialogresizestop',function(){
	    	var h = $('#vboxSettingsList').css({'display':'none'}).parent().innerHeight();
	    	$('#vboxSettingsList').height(h-8).css({'display':''});	    	
	    });
	    
	    /* Select first or passed menu item */
	    var i = 0;
	    var offset = 0;
	    var tab = undefined;
	    if(typeof pane == "string") {
	    	var section = pane.split(':');
	    	if(section[1]) tab = section[1];
	    	for(i = 0; i < panes.length; i++) {
	    		if(panes[i].disabled) offset++;
	    		if(panes[i].name == section[0]) break;
	    	}
	    }
	    i-=offset;
	    if(i >= panes.length) i = 0;
	    $('#vboxSettingsMenuList').children('li:eq('+i+')').first().click().each(function(){
	    	if(tab !== undefined) {
	    		$('#vboxSettingsPane-'+$(this).data('name')).tabs('select', parseInt(tab));
	    	}
	    	
	    });
	    
	    /* Only 1 pane? */
	    if(panes.length == 1) {
	    	$('#vboxSettingsDialog table.vboxSettingsTable').css('width','100%');
	    	$('#vboxSettingsDialog').dialog('option','title',(icon ? '<img src="images/vbox/'+icon+'_16px.png" class="vboxDialogTitleIcon" /> ' : '') + trans(panes[0].label,langContext));
	    }
	    
		
	};
	
	loader.run();

}


