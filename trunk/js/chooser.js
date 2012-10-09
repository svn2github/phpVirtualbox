/**
 *
 * @fileOverview Chooser (vm list) singleton
 * @author Ian Moore (imoore76 at yahoo dot com)
 * @version $Id$
 * @copyright Copyright (C) 2010-2012 Ian Moore (imoore76 at yahoo dot com)
 *
 */

/**
 * Chooser selection mode constants
 */
var vboxSelectionModeNone = 0;
var vboxSelectionModeSingleVM = 1;
var vboxSelectionModeMultiVM = 2;
var vboxSelectionModeSingleGroup = 3;


/*
 * @namespace vboxChooser
 * 
 * Draws machine selection chooser
 * and controls selection list
 * @see js/eventlistener.js
 */
var vboxChooser = {

	// VM list
	vms : {},
	
	// VM tool tip
	_vmTooolTip : trans('<nobr>%1<br></nobr><nobr>%2 since %3</nobr><br><nobr>Session %4</nobr>','UIVMListView'),
	
	// Anchor element
	_anchorid : null,
	_anchor : null,
	
	/* Internal list of all unique selected items */
	_selectedList : [],
	
	/* List of unique selected VMs */
	selectedVMs : [],
	
	/* Holds group definitions */
	_groupDefs : [],

	/* selection mode can be
	
		var vboxSelectionModeNone = 0,
		var vboxSelectionModeSingleVM = 1,
		var vboxSelectionModeMultiVM = 2,
		var vboxSelectionModeSingleGroup = 3,
	 */
	selectionMode : vboxSelectionModeNone,
	
	/* Check phpVirtualBox version and VirtualBox
	 * version compatibility.
	 */
	_versionChecked : false,
	
	/* Context menus */
	_vmContextMenuObj : null,
	_vmGroupContextMenuObj : null,
	
	/* Holds history of showing only single groups */
	_showOnlyGroupHistory : [],
	
	/**
	 * Set anchor id to draw to
	 */
	setAnchorId : function(aid) {
		vboxChooser._anchorid = aid;
		vboxChooser._anchor = $('#'+aid);
		
		vboxChooser._anchor.hover(function(){
			$(this).addClass('vboxChooserDropTargetHoverRoot');
		},function() {
			$(this).removeClass('vboxChooserDropTargetHoverRoot');
		});
	},
	
	/**
	 * Set context menus
	 * 
	 */
	setContextMenu : function(target, menuitems) {
		
		switch(target) {
		
			// Group menu
			case 'group':
				vboxChooser._vmGroupContextMenuObj = new vboxMenu(vboxChooser._anchorid+'vmgroups',null,menuitems);
				vboxChooser._vmGroupContextMenuObj.update();
				break;
				
			// VM Menu
			case 'vm':
				vboxChooser._vmContextMenuObj = new vboxMenu(vboxChooser._anchorid+'vms',null,menuitems);
				vboxChooser._vmContextMenuObj.update();
				break;
				
			// Main list menu
			case 'anchor':

				var vboxChooserPaneMenu = new vboxMenu(vboxChooser._anchorid+'Pane',null,menuitems);			
				$('#'+vboxChooser._anchorid).parent().contextMenu({
				  		menu: vboxChooserPaneMenu.menuId()
				  	},
				  	vboxChooserPaneMenu.menuClickCallback
				);

				break;
				
			default:
				vboxAlert('vboxChooser::setContextMenu: unknown context menu type (' + target + ')');
		}
	},

	/*
	 * Return true if a selected VM is in the given state
	 */
	isSelectedInState : function(state) {
	
		 for(var i = 0; i < vboxChooser.selectedVMs.length; i++) {
			 if(vboxVMStates['is'+state](vboxVMDataMediator.getVMData(vboxChooser.selectedVMs[i])))
				 return true;
		 }
		 return false;
		 
 	},
	 
 	/*
 	 * Return true if the passed VM is selected
 	 */
 	isVMSelected : function(vmid) {
 		return (jQuery.inArray(vmid,vboxChooser.selectedVMs) > -1);	 
 	},
 	 
 	/*
 	 * Return selected VM data in array
 	 */
 	getSelectedVMsData : function() {

 		var vms = [];
		for(var i = 0; i < vboxChooser.selectedVMs.length; i++) {
			vms[vms.length] = vboxVMDataMediator.getVMData(vboxChooser.selectedVMs[i]);
		}
		return vms;
 	},
 	
	/*
	 * Triggered when selection list has changed
	 */
	selectionListChanged : function(selectionList) {
		
		if(!selectionList) selectionList = [];
		
		selectionMode = vboxSelectionModeNone;
		
		// Hold unique selected VMs
		var vmListUnique = {};
		for(var i = 0; i < selectionList.length; i++) {
			if(selectionList[i].type == 'group') {
				vboxChooser.getGroupElement(selectionList[i].groupPath, true).find('table.vboxChooserVM:not(.ui-draggable-dragging)').each(function(idx,elm){
					if(elm) {
						var vmid = $(elm).data('vmid');
						if(vmid)
							vmListUnique[vmid] = vmid;
					}
				});
				switch(selectionMode) {
					case vboxSelectionModeSingleGroup:
					case vboxSelectionModeSingleVM:
						selectionMode = vboxSelectionModeMultiVM;
						break;
					case vboxSelectionModeNone:
						selectionMode = vboxSelectionModeSingleGroup;
				}
			} else {				
				switch(selectionMode) {
					case vboxSelectionModeNone:
						selectionMode = vboxSelectionModeSingleVM;
						break;
					default:
						selectionMode = vboxSelectionModeMultiVM;
				}

				vmListUnique[selectionList[i].id] = selectionList[i].id;
			}
		}
		
		// Change selection list
		var selectedVMs = [];
		for(var i in vmListUnique) {
			selectedVMs[selectedVMs.length] = i;
		}
		
		vboxChooser.selectedVMs = selectedVMs;

		// If there is only one unique vm selected,
		// selection mode becomes single VM if the
		// current selection mode is not singleGroup
		if(vboxChooser.selectedVMs.length == 1 && selectionMode != vboxSelectionModeSingleGroup)	
			selectionMode = vboxSelectionModeSingleVM;

		vboxChooser.selectionMode = selectionMode;
		
		vboxChooser._selectedList = selectionList;

		$('#vboxPane').trigger('vmSelectionListChanged',[vboxChooser]);	
		
		
	},
	
	/*
	 * Return the single selected VM's id if
	 * only one vm is selected. Else null.
	 */
	getSingleSelectedId : function() {
		if(vboxChooser.selectedVMs.length == 1) {
			return vboxChooser.selectedVMs[0];
		}
		return null;
	},
	 
	/*
	 * Return a single vm if only one is selected.
	 * Else null.
	 */
	getSingleSelected : function() {
		if(vboxChooser.selectedVMs.length == 1) {
			return vboxVMDataMediator.getVMData(vboxChooser.selectedVMs[0]);
		}
		return null;
	 },
	
	/*
	 * Update list of VMs from data received
	 * from ajax query
	 */
	updateList : function(d) {

		// We were stopped before the request returned data
		if(!vboxChooser._running) return;
		

		// No list? Something is wrong
		if(!d || !d.vmlist) {
			
			vboxAlert(trans('There was an error obtaining the list of registered virtual machines from VirtualBox. Make sure vboxwebsrv is running and that the settings in config.php are correct.<p>The list of virtual machines will not begin auto-refreshing again until this page is reloaded.</p>','phpVirtualBox'));
			
			vboxChooser.stop();
			vboxChooser._anchor.children().remove();
			return;
		}

		// Remove spinner
		vboxChooser._anchor.children().remove();
		
		// Render host
		vboxChooser._anchor.append(vboxChooser.vmHTML(
			{
				'id':'host',
				'state':'Hosting',
				'owner':'',
				'name':$('#vboxPane').data('vboxConfig').name,
				'OSTypeId':'VirtualBox_Host'
			}
		));
		
		// Render root group
		vboxChooser._anchor.append(vboxChooser.groupHTML("/"));
		
		// Enforce VM ownership
        if($('#vboxPane').data('vboxConfig').enforceVMOwnership && !$('#vboxPane').data('vboxSession').admin) {
        	d.vmlist = jQuery.grep(d.vmlist,function(vm,i){
        		return (vm.owner == $('#vboxPane').data('vboxSession').user);
        	});
		}

		// Each item in list
		for(var i = 0; i < d.vmlist.length; i++) {	
			// Update
			vboxChooser.updateVMElement(d.vmlist[i], true);
		}

		// compose / save group definitions
		vboxChooser.composeGroupDef(true);
		
	},
	
	/*
	 * Get group element by path
	 */
	getGroupElement : function(gpath, noCreate) {

		if(!gpath) gpath = '/';
		var gnames = gpath.split('/');
		var groot = vboxChooser._anchor.children('div.vboxChooserGroup:not(.ui-draggable-dragging)');
		for(var i = 1; i < gnames.length; i++) {
			
			if(!gnames[i]) continue;
			
			var group = groot.children('div.vboxChooserGroup:not(.ui-draggable-dragging)').children('div.vboxChooserGroupHeader[title="'+gnames[i]+'"]').parent();
			
			// If it does not exist, create it
			if(!group[0]) {
				
				if(noCreate) return null;
				
				var gpath = '/';
				for(var a = 1; a <= i; a++) {
					gpath = gpath + '/' + gnames[a];
				}
				gpath = gpath.replace('//','/');
				
				vboxChooser.groupHTML(gpath).insertBefore(groot.children('div.vboxChooserGroupVMs'));
				
				vboxChooser.sortGroup(groot);
				
				groot = groot.children('div.vboxChooserGroup:not(.ui-draggable-dragging)').children('div.vboxChooserGroupHeader[title="'+gnames[i]+'"]').parent();
				
			} else {
				groot = group;
			}
			
		}
		return groot;
	},

	/*
	 *
	 * Update VM elements
	 *
	 */
	updateVMElement : function(vmUpdate, newVM) {

		// Not running.. don't do anything
		if(!vboxChooser._running) return;
		
		// New VM
		if(newVM) {

			// New VM.. add it to groups..
			if(!vmUpdate.groups || vmUpdate.groups.length == 0)
				vmUpdate.groups = ['/'];
			
			for(var i = 0; i < vmUpdate.groups.length; i++) {
				var gElm = $(vboxChooser.getGroupElement(vmUpdate.groups[i]));
				vboxChooser.vmHTML(vmUpdate).appendTo(
					gElm.children('div.vboxChooserGroupVMs')
				);
				vboxChooser.sortGroup(gElm);
			}
			
		// Existing VM. Replace existing elements
		} else {
				
			$('#'+vboxChooser._anchorid).find('table.vboxChooserItem-'+vboxChooser._anchorid+'-'+vmUpdate.id).each(function(i,elm){
				
				var newHTML = vboxChooser.vmHTML(vmUpdate);
				if($(elm).hasClass('vboxListItemSelected')) {
					$(newHTML).addClass('vboxListItemSelected').removeClass('vboxHover');
				}
				$(elm).children().replaceWith(newHTML.children());
			});
				
		}

	},
	


	/*
	 * Generate HTML from VM definition
	 */
	vmHTML : function (vmn) {
		
		var tbl = $('<table />').attr({'class':'vboxChooserItem-'+vboxChooser._anchorid+'-'+vmn.id + " vboxChooserVM"})
			.bind('mousedown',vboxChooser.selectItem)
			.hover(function(){
				if(!$(this).hasClass('vboxListItemSelected'))
					$(this).addClass('vboxHover');
				},function(){$(this).removeClass('vboxHover');
			}).data('vmid',vmn.id);
		
		
		// Drag-and-drop functionality
		/////////////////////////////////
		if(vmn.id != 'host' && $('#vboxPane').data('vboxSession').admin) {
			
			$(tbl).draggable({'cursorAt':{left: -10, top: -10},'helper':function(){
				return $(this).clone().css({'width':($(this).width()+2)+'px','display':'inline','background':'#fff','border-color':'#69f'}).removeClass('vboxHover');
				
			// drag start
			},'start':function(e) {
							
				$(vboxChooser._anchor).disableSelection();
				vboxChooser._dragging = vmn.id;
				$(vboxChooser._anchor).find('table.vboxHover').removeClass('vboxHover');
				
			// drag stop
			},'stop':function(e) {
				vboxChooser.vmDropped(e, $(this));
			}});
		}

		// Functionality to drop above / below VM
		/////////////////////////////////////////////
		var td = $('<td />').attr({'colspan':'2'}).addClass('vboxChooserDropTarget vboxDropTargetTop');
		if(vmn.id != 'host') {
			td.hover(function(){
				if(vboxChooser._dragging && vboxChooser._dragging != vmn.id)
					$(this).addClass('vboxChooserDropTargetHover');
			},function(){
				$(this).removeClass('vboxChooserDropTargetHover');
			}
			);
		}
		$('<tr />').append(td).appendTo(tbl);

		
		
		// VM OS type icon
		var tr = $('<tr />');
		if($('#vboxPane').data('vboxConfig').enableCustomIcons && vmn.customIcon) {
			$('<td />').attr({'rowspan':'2'}).html("<img src='" + vmn.customIcon + "' class='vboxVMIcon' />").appendTo(tr);
		} else {
			$('<td />').attr({'rowspan':'2'}).html("<img src='images/vbox/" + vboxGuestOSTypeIcon(vmn.OSTypeId) + "' class='vboxVMIcon" + (vmn.id == 'host' ? " vboxHostIcon" : "") + "' />").appendTo(tr);
		}
		
		
		// VM Name
		var td = $('<td />').attr({'class':'vboxVMTitle'});
		
		// Host will have HTML in name
		if(vmn.id == 'host') {
			
			// Check for multiple server config
			if($('#vboxPane').data('vboxConfig').servers.length) {
				
				// If there are multiple servers configured, setup menu
				if(!$('#vboxServerMenu')[0]) {
					var servers = $('#vboxPane').data('vboxConfig').servers;
					var ul = $('<ul />').attr({'id':'vboxServerMenu','style':'display: none','class':'contextMenu'});
					for(var i = 0; i < servers.length; i++) {
						$('<li />').html("<a href='#" + $('<div />').html(servers[i].name).text() + "' style='background-image: url(images/vbox/OSE/VirtualBox_16px.png);'>"+$('<div />').html(servers[i].name).text()+"</a>").appendTo(ul);
					}
					$('#vboxPane').append(ul);					
				}

				var span = $('<span />').attr({'class':'vboxServerLink'}).text('('+$('#vboxPane').data('vboxConfig').name+')').contextMenu({
						menu: 'vboxServerMenu',
						button: 0,
						mode: 'menu'
					},
					function(a) {
						if(a == $('#vboxPane').data('vboxConfig').name) return;						
						
						// Show loading screen
						var l = new vboxLoader();
						l.showLoading();
						
						// Empty selection list
						vboxChooser.selectionListChanged();
						
						// Expire data mediator data
						vboxVMDataMediator.expireAll();

						// Unsubscribe from events
						$.when(vboxEventListener.stop()).then(function() {
							
							// remove loading screen
							l.removeLoading();
							
							// Trigger host change
							vboxSetCookie("vboxServer",a);
							$('#vboxPane').trigger('hostChange',[a]);	
							
						});
						
						
					}
				);
				$(td).html('<span class="vboxVMName">VirtualBox</span> ').append(span);
			} else {				
				$(td).html('<span class="vboxVMName">VirtualBox</span> ('+vmn.name+')');
			}
			
		// Not rendering host
		} else {
			
			$(td).append('<span class="vboxVMName">'+$('<span />').text(vmn.name).html()+'</span>'+ (vmn.currentSnapshotName ? ' (' + $('<span />').text(vmn.currentSnapshotName).html() + ')' : ''));
			
			var sdate = new Date(vmn.lastStateChange * 1000);

			// Table gets tool tips
			tip = vboxChooser._vmTooolTip.replace('%1',('<b>'+$('<span />').text(vmn.name).html()+'</b>'+(vmn.currentSnapshotName ? ' (' + $('<span />').text(vmn.currentSnapshotName).html() + ')' : ''))).replace('%2',trans(vboxVMStates.convert(vmn.state),'VBoxGlobal')).replace('%3',sdate.toLocaleString()).replace('%4',trans(vmn.sessionState,'VBoxGlobal'));
			$(tbl).tipped({'source':tip,'position':'mouse','delay':2000});
		}
		
		$(tr).append(td).appendTo(tbl);
		
		// VM state row
		var tr = $('<tr />');
		var td = $('<td />').attr({'class':(vmn.id != 'host' && vmn.sessionState != 'Unlocked' ? 'vboxVMSessionOpen' : '')}).html("<img src='images/vbox/" + vboxMachineStateIcon(vmn.state) +"' /> <span class='vboxVMState'>" + trans(vboxVMStates.convert(vmn.state),'VBoxGlobal') + '</span>');

		// Add VirtualBox version if hosting
		if(vmn.id == 'host') {
			
			$(td).append(' - ' + $('#vboxPane').data('vboxConfig').version.string);
			
			// Check for version mismatches?
			if(!vboxChooser._versionChecked) {
				vboxChooser._versionChecked = true;
				var vStr = $('#vboxPane').data('vboxConfig').phpvboxver.substring(0,$('#vboxPane').data('vboxConfig').phpvboxver.indexOf('-'));
				var vers = $('#vboxPane').data('vboxConfig').version.string.replace('_OSE','').split('.');
				if(vers[0]+'.'+vers[1] != vStr) {
					vboxAlert('This version of phpVirtualBox ('+$('#vboxPane').data('vboxConfig').phpvboxver+') is incompatible with VirtualBox ' + $('#vboxPane').data('vboxConfig').version.string + ". You probably need to <a href='http://code.google.com/p/phpvirtualbox/downloads/list?q=phpvirtualbox-"+vers[0]+'.'+vers[1]+"' target=_blank>download the latest phpVirtualBox " + vers[0]+'.'+vers[1] + "-x</a>.<p>See the Versioning section <a href='http://code.google.com/p/phpvirtualbox/downloads/detail?name=README.txt' target=_blank>here</a> for more information</p>",{'width':'auto'});
				}
			}			
		}
		
		$(tr).append(td).appendTo(tbl);

		// Droppable targets
		var td = $('<td />').attr({'colspan':'2'}).addClass('vboxChooserDropTarget vboxDropTargetBottom');
		if(vmn.id != 'host') {
			td.hover(function(){
				if(vboxChooser._dragging && vboxChooser._dragging != vmn.id)
					$(this).addClass('vboxChooserDropTargetHover');
				},function(){
					$(this).removeClass('vboxChooserDropTargetHover');
				}
			);
		}
		$('<tr />').append(td).appendTo(tbl);
		
		
		// Context menus?
		if(vboxChooser._vmContextMenuObj) {
			
			$(tbl).contextMenu({
				menu: vboxChooser._vmContextMenuObj.menuId(),
				menusetup : function(el) {
					if(!$(el).hasClass('vboxListItemSelected')) $(el).trigger('click');
				}
			},function(act,el,pos,d,e){
				vboxChooser._vmContextMenuObj.menuClickCallback(act);
			});
			
			// Open settings on dblclick
			$(tbl).dblclick(function(){
				if(vboxChooser._vmContextMenuObj.menuItems['settings'].enabled())
					vboxChooser._vmContextMenuObj.menuItems['settings'].click();
			});
		}
		
		return tbl;
		
	},

	/*
	 * VM Group Dropped
	 */
	vmGroupDropped : function(e, droppedGroup) {
		
		$(vboxChooser._anchor).enableSelection();
		
		var vmGroupPath = vboxChooser._draggingGroup;
		
		vboxChooser._draggingGroup = false;
		
		$(droppedGroup).removeClass('vboxHover');
		
		// Cannot drag a group that contains a VM without
		// an unlocked session state if it will modify VM
		// Groups
		var sessionLocked = false;
		if($(droppedGroup).find('td.vboxVMSessionOpen')[0])
			sessionLocked=true;

		
		// Check for above/below group first
		var dropTarget = vboxChooser._anchor.find('div.vboxChooserDropTargetHover').first();
		if(dropTarget[0]) {

			// Make sure that this wasn't dropped onto a sub-group or itvboxChooser
			if(
					vmGroupPath == dropTarget.closest('div.vboxChooserGroup').data('vmGroupPath')
							||
					dropTarget.closest('div.vboxChooserGroup').data('vmGroupPath').indexOf(vmGroupPath + '/') == 0 
			) {
				return;
			}


			// If we are not still in the same group, check for name conflict							
			var currParentGroupPath = $(droppedGroup).closest('div.vboxChooserGroup').parent().closest('div.vboxChooserGroup').data('vmGroupPath');
			
			if(dropTarget.closest('div.vboxChooserGroup').parent().closest('div.vboxChooserGroup').data('vmGroupPath') != currParentGroupPath) {

				// Do not allow to be dragged into another group
				// if there is a Vm with a locked session in this one
				if(sessionLocked) return;
				
				// Make sure there are no conflicts
				var groupName = $(droppedGroup).children('div.vboxChooserGroupHeader').attr('title');
				var newGroupName = groupName;
				

				var i = 2;
				while(vboxChooser.groupNameConflicts(dropTarget.closest('div.vboxChooserGroup').parent(), newGroupName)) {
					newGroupName = groupName + ' (' + (i++) + ')';				
				}
				
				$(droppedGroup).children('div.vboxChooserGroupHeader').attr({'title':newGroupName})
					.children('span.vboxChooserGroupName').text(newGroupName);
			
			}

			// Insert before or insert after?
			if(dropTarget.hasClass('vboxDropTargetTop')) {
				$(droppedGroup).detach().insertBefore(dropTarget.closest('div.vboxChooserGroup'));
			} else {
				$(droppedGroup).detach().insertAfter(dropTarget.closest('div.vboxChooserGroup'));
			}

			
		// Dropped onto a group or main VM list
		} else {
			
			// Will not do this if this group contains
			// a VM with a locked session
			if(sessionLocked) return;
			
			var dropTarget = vboxChooser._anchor.find('div.vboxHover').first();
			
			
			// Dropped onto a group
			if(dropTarget[0] && dropTarget.parent().hasClass('vboxChooserGroup')) {
				
				dropTarget = dropTarget.parent();
				
				// Make sure that this wasn't dropped onto a sub-group or itvboxChooser
				if(
						vmGroupPath == dropTarget.data('vmGroupPath')
								||
						dropTarget.closest('div.vboxChooserGroup').data('vmGroupPath').indexOf(vmGroupPath + '/') == 0 
				) {
					return;
				}

			// Dropped onto main vm list
			} else if($(vboxChooser._anchor).hasClass('vboxChooserDropTargetHoverRoot')) {

				dropTarget = null;
				
				// Only showing one group?
				if(vboxChooser._showOnlyGroupHistory.length > 0) {
					dropTarget = $(vboxChooser._showOnlyGroupHistory[vboxChooser._showOnlyGroupHistory.length-1]);
				}

				if(!$(dropTarget)[0])
					dropTarget = vboxChooser._anchor.children('div.vboxChooserGroup');					
				
			} else {
				return;
			}
			
			// Make sure there are no conflicts
			var newElm = $(droppedGroup).detach();
			var groupName = $(droppedGroup).children('div.vboxChooserGroupHeader').attr('title');
			var newGroupName = groupName;
			
			var i = 2;
			while(vboxChooser.groupNameConflicts(dropTarget, newGroupName, $(newElm).data('vmGroupPath'))) {
				newGroupName = groupName + ' (' + (i++) + ')';				
			}
			
			$(newElm)
				.children('div.vboxChooserGroupHeader').attr({'title':newGroupName})
				.children('span.vboxChooserGroupName').text(newGroupName);
			$(newElm).insertBefore(dropTarget.children('div.vboxChooserGroupVMs'));
			
		}

		vboxChooser.composeGroupDef();
		
		vboxChooser.selectionListChanged(vboxChooser._selectedList);
		
	},
	
	/*
	 * VM dropped
	 */
	vmDropped : function (e, droppedVM){
		
		$(vboxChooser._anchor).enableSelection();
		vboxChooser._dragging = null;
		
		// Cannot drag if this VM's session is not open
		var thisSessionLocked = false;
		var vmData = vboxVMDataMediator.getVMData($(droppedVM).data('vmid'));
		
		if(vmData.sessionState != 'Unlocked')
			thisSessionLocked = true;

		
		// Where was this dropped?
		var dropTarget = $('#'+vboxChooser._anchorid).find('td.vboxChooserDropTargetHover');
		
		// Dropped above / below a VM
		if(dropTarget[0]) {
			
			// Dropped from another group into this one,
			// but this group already has this VM
			if((dropTarget.closest('table').closest('div.vboxChooserGroup').data('vmGroupPath') != $(droppedVM).closest('div.vboxChooserGroup').data('vmGroupPath')) 
					&& dropTarget.closest('table').siblings('table.vboxChooserItem-'+vboxChooser._anchorid+'-'+$(droppedVM).data('vmid'))[0]) {
					return true;
			}
			
			// If session of this VM is locked, don't allow it to be
			// dragged out of current group
			if(thisSessionLocked && ($(droppedVM).closest('div.vboxChooserGroup').data('vmGroupPath') != dropTarget.closest('div.vboxChooserGroup').data('vmGroupPath'))) {
				return
			}
			
			// Get VM from target's parent table
			if(dropTarget.hasClass('vboxDropTargetTop')) {
				if(!e.ctrlKey && !e.metaKey) {
					$(droppedVM).detach().insertBefore($(dropTarget).closest('table'));
				} else {
					// Copy
					if($(dropTarget).closest('table').parent().children('table.vboxChooserItem-'+vboxChooser._anchorid+'-'+vmData.id)[0])
							return;
					vboxChooser.vmHTML(vmData).insertBefore($(dropTarget).closest('table'));
				}
			} else {
				if(!e.ctrlKey && !e.metaKey) {
					$(droppedVM).detach().insertAfter($(dropTarget).closest('table'));
				} else {
					// Copy - Don't allow if it already exists
					if($(dropTarget).closest('table').parent().children('table.vboxChooserItem-'+vboxChooser._anchorid+'-'+vmData.id)[0])
						return;
					vboxChooser.vmHTML(vmData).insertAfter($(dropTarget).closest('table'));
				}
			}
		
		// Not dropped above / below vm
		} else {
			
			// Don't allow this if sessoin is locked
			if(thisSessionLocked) return;
			
			// Dropped ON a vm?
			dropTarget = $('#'+vboxChooser._anchorid).find('table.vboxHover:not(.ui-draggable-dragging)').first();
			if($(dropTarget).data('vmid')) {
			
				// Create a group?
				dropTarget = $('#'+vboxChooser._anchorid).find('table.vboxHover').first();
				
				// Nothing to do. Not dropped on valid target
				if(!dropTarget[0] || ($(dropTarget).data('vmid') == $(droppedVM).data('vmid'))) return true;
									
				// Dont' allow this if target VM's session is locked
				if($(dropTarget).find('td.vboxVMSessionOpen')[0])
					return;
				
				// Where to drop vboxChooser..
				var p = dropTarget.closest('div.vboxChooserGroup').children('div.vboxChooserGroupVMs');
				// assume root?
				if(!p[0]) p = vboxChooser._anchor.children('div.vboxChooserGroupVMs');

				// Determine group name
				var gname = trans('New group','UIGChooserModel');
				var tgname = gname;

				var i = 2;
				while(vboxChooser.groupNameConflicts($(p).parent(), tgname)) {
					tgname = gname + ' ' + (i++);
				}

			
				// New position is below target
				var ghtml = vboxChooser.groupHTML(String(dropTarget.closest('div.vboxChooserGroup').data('vmGroupPath')+'/'+tgname).replace('//','/'));
				
				if(!e.ctrlKey && !e.metaKey) {
					ghtml.children('div.vboxChooserGroupVMs').append($(droppedVM).detach());
				} else {
					ghtml.children('div.vboxChooserGroupVMs').append(vboxChooser.vmHTML(vmData));
				}
				ghtml.children('div.vboxChooserGroupVMs').append(dropTarget.detach());
				
				ghtml.insertBefore(p);
				
			// Dropped in the main VM list or group header?
			} else {
				
				dropTarget = $(vboxChooser._anchor).find('div.vboxHover').first();
				if(dropTarget[0] && dropTarget.hasClass('vboxChooserGroupHeader')) {
					
					// Group already has this dragging VM?
					if(dropTarget.siblings('div.vboxChooserGroupVMs').children('table.vboxChooserItem-'+vboxChooser._anchorid+'-'+$(droppedVM).data('vmid'))[0]) {
						return;
					}
										
					if(!e.ctrlKey && !e.metaKey)
						$(droppedVM).detach().appendTo(dropTarget.siblings('div.vboxChooserGroupVMs').first());
					else
						vboxChooser.vmHTML(vmData).appendTo(dropTarget.siblings('div.vboxChooserGroupVMs').first());
				
				// Main VM list
				} else if($(vboxChooser._anchor).hasClass('vboxChooserDropTargetHoverRoot')) {
				
					dropTarget = null;
					
					// Only showing one group?
					if(vboxChooser._showOnlyGroupHistory.length > 0) {
						dropTarget = $(vboxChooser._showOnlyGroupHistory[vboxChooser._showOnlyGroupHistory.length-1]);
					}

					if(!$(dropTarget)[0])
						dropTarget = vboxChooser._anchor.children('div.vboxChooserGroup');					

				
					// Already in this list?
					if(dropTarget.children('div.vboxChooserGroupVMs').children('table.vboxChooserItem-'+vboxChooser._anchorid+'-'+$(droppedVM).data('vmid'))[0]) {
						return true;
					}
					
					if(!e.ctrlKey && !e.metaKey) {
						$(droppedVM).detach().appendTo(dropTarget.children('div.vboxChooserGroupVMs').first());
					} else {
						vboxChooser.vmHTML(vmData).appendTo(dropTarget.children('div.vboxChooserGroup').children('div.vboxChooserGroupVMs').first());
					}

				}
			}
			
		}

		vboxChooser.composeGroupDef();
		
		vboxChooser.selectionListChanged(vboxChooser._selectedList);
		
	},
	
	/*
	 * Group selected items into a new group
	 */
	groupSelectedItems : function() {
		
		// Determine new group target
		var target = vboxChooser._anchor.children('div.vboxChooserGroup');
		if(vboxChooser._showOnlyGroupHistory.length > 0) {
			target = vboxChooser._showOnlyGroupHistory[vboxChooser._showOnlyGroupHistory.length-1];
		}
		
		if(!$(target)[0]) return;
		
		// Determine group name
		var gname = trans('New group','UIGChooserModel');
		var tgname = gname;

		var i = 2;
		while(vboxChooser.groupNameConflicts($(target), tgname)) {
			tgname = gname + ' ' + (i++);
		}
		
		var gHTML = vboxChooser.groupHTML('/'+tgname);

		// Append group and vm elements
		vboxChooser._anchor.find('div.vboxVMGroupSelected').detach().insertAfter(gHTML.children('div.vboxChooserGroupHeader'));
		vboxChooser._anchor.find('table.vboxListItemSelected').detach().appendTo(gHTML.children('div.vboxChooserGroupVMs'));

		gHTML.insertBefore($(target).children('div.vboxChooserGroupVMs'));
		
		vboxChooser.composeGroupDef();
		
	},
	
	/*
	 * Compose group data from GUI
	 */
	composeGroupDef : function(skipSave) {
		
		var allGroups = [];
		var groupsResolved = false;
		
		// Keep looping through group definitions until
		// there are no groups removed
		while(!groupsResolved) {
			
			allGroups = [];
			groupsResolved = true;
			
			vboxChooser._anchor.find('div.vboxChooserGroup:not(.ui-draggable-dragging)').each(function(idx,elm) {
				
				// Group element was removed
				if(!elm) return;
				
				// Compose group path
				var myPath = $(elm).children('div.vboxChooserGroupHeader').attr('title');
				if(!myPath) myPath = '/';
				$(elm).parents('div.vboxChooserGroup:not(.ui-draggable-dragging)').each(function(idx2,elm2){
					var pName = $(elm2).children('div.vboxChooserGroupHeader').attr('title');
					if(!pName) pName = '/';
					myPath = String(pName + '/' + myPath).replace('//','/');
				});
								
				// Groups
				var gList = [];
				$(elm).children('div.vboxChooserGroup:not(.ui-draggable-dragging)').each(function(idx2,elm2){
					
					// If this group is selected, we'll have to update its path
					// in the selection list
					var selected = $(elm2).hasClass('vboxVMGroupSelected');
					var oldPath = null;
					if(selected) {
						oldPath = $(elm2).data('vmGroupPath');
					}
					var newPath = String(myPath + '/' + $(elm2).children('div.vboxChooserGroupHeader').attr('title')).replace('//','/');
					
					gList[gList.length] = $(elm2).children('div.vboxChooserGroupHeader').attr('title');
					
					// set / correct group path data
					$(elm2).data('vmGroupPath', newPath);
					
					// Change selected group's path?
					if(selected && (oldPath != newPath)) {
						for(var i = 0; i < vboxChooser._selectedList.length; i++) {
							if(vboxChooser._selectedList[i].type == 'group' && vboxChooser._selectedList[i].groupPath == oldPath) {
								vboxChooser._selectedList[i].groupPath = String(myPath + '/' + $(elm2).children('div.vboxChooserGroupHeader').attr('title')).replace('//','/');
								break;
							}
						}
					}
					
				});
				
				// VMs
				var vmList = [];
				$(elm).children('div.vboxChooserGroupVMs').children('table.vboxChooserVM:not(.ui-draggable-dragging)').each(function(idx3,elm3){
					vmList[vmList.length] = $(elm3).data('vmid');
				});
				
				// Skip and remove if there are no VMs or subgroups
				// And it is not the parent group
				if(gList.length + vmList.length == 0 && !$(elm).hasClass('vboxVMlistGroupRoot')) {
					
					// remove from selected list?
					if(elm && $(elm).hasClass('vboxVMGroupSelected')) {
					
						var myPath = $(elm).data('vmGroupPath');
						// Deselect item
						vboxChooser._selectedList = vboxChooser._selectedList.filter(function(v){
							return (v.type != 'group' || (v.groupPath != myPath));
						});
					}
					$(elm).empty().remove();
					groupsResolved = false;
					return false;
				}
				
				// append to all groups list
				gorder = [];
				if(gList.length) gorder[0] = 'go='+gList.join(',go=');
				if(vmList.length) gorder[gorder.length] = 'm='+vmList.join(',m=');
				allGroups[allGroups.length] = {
					path: $(elm).data('vmGroupPath'),
					order: gorder.join(',')
				};
				
				// Update counts span
				$(elm).children('div.vboxChooserGroupHeader').children('span.vboxChooserGroupInfo')
					.children('span.vboxChooserGroupCounts').html(
						(gList.length ? ('<img src="images/vbox/nw_16px.png" />'+gList.length) : '') +
						(vmList.length ? (' <img src="images/vbox/fullscreen_16px.png" />'+vmList.length) : '')
				);
			});
			
		}
		
		// Save GUI group definition?
		if(skipSave) return;
		
		vboxChooser._groupDefs = allGroups;
		vboxAjaxRequest('vboxGroupDefinitionsSet',{'groupDefinitions':allGroups},function(){});		
		
		// Save machine groups and trigger change
		var vms = [];
		for(var i in vboxVMDataMediator.vmData) {
			if(typeof i != 'string' || i == 'host') continue;
			
			/* If a VM's groups have changed, add it to the list */
			var eGroups = vboxVMDataMediator.vmData[i].groups;
			var nGroups = vboxChooser.getGroupsForVM(i);
			
			if($(nGroups).not(eGroups).length || $(eGroups).not(nGroups).length) {
			
				vms[vms.length] = {
						'id' : i,
						'groups' : nGroups
				};				
			}
		}
		
		// Save machines groups
		vboxAjaxRequest('machinesSaveGroups',{'vms':vms},function(res){

			if(!res || res.errored) {

				var ml = new vboxLoader();
				ml.add('vboxGetMedia',function(d){$('#vboxPane').data('vboxMedia',d);});
				ml.add('vboxGroupDefinitionsGet',function(d){vboxChooser._groupDefs = d.data;});
				
				// Reload VM list and group definitions, something went wrong
				ml.onLoad = function() {

					// Stop vmlist from refreshing..
					vboxChooser.stop();
					
					// reset selections
					$('#vboxPane').trigger('vmSelectionListChanged',[vboxChooser]);

					// ask for new one
					vboxChooser.start();
				};
				ml.run();
				return;

			}
						
		});
		
			
		
		return allGroups;
		
	},
	
	/*
	 * Return a list of groups that VM is a member of
	 */ 
	getGroupsForVM : function(vmid) {
		var gPathList = [];
		vboxChooser._anchor.find('table.vboxChooserItem-'+vboxChooser._anchorid+'-'+vmid+':not(.ui-draggable-dragging)').each(function(idx,elm){
			var gParent = $(elm).closest('div.vboxChooserGroup');
			if(!gParent.hasClass('ui-draggable-dragging'))
				gPathList[gPathList.length] = gParent.data('vmGroupPath');
		});
		return gPathList;
	},
	
	/*
	 * Determine whether or not a group name conflicts
	 * with another group in parent
	 */
	groupNameConflicts : function(parentGroup, name, ignoreGroupAtPath) {
		var found = false;
		parentGroup.children('div.vboxChooserGroup:not(.ui-draggable-dragging)').children('div.vboxChooserGroupHeader[title="'+name+'"]').parent().each(function(i,elm){
			
			if(ignoreGroupAtPath && (ignoreGroupAtPath == $(elm).data('vmGroupPath')))
				return true;
			
			found=true;
			return false;
		});
		return found;
	},
	
	/*
	 * Ungroup selected group
	 */
	unGroupSelectedGroup : function() {

		var target = $(vboxChooser.getSelectedGroupElements()[0]).siblings('div.vboxChooserGroupVMs');
		
		// Groups
		// - ignore group at path we are currently ungrouping
		var ignoreGroup = $(vboxChooser.getSelectedGroupElements()[0]).data('vmGroupPath');
		$(vboxChooser.getSelectedGroupElements()[0]).children('div.vboxChooserGroup').each(function(i,elm) {
			
			// Make sure there are no conflicts
			var newElm = $(elm).detach();
			var groupName = $(elm).children('div.vboxChooserGroupHeader').attr('title');
			var newGroupName = groupName;

			var i = 2;
			while(vboxChooser.groupNameConflicts($(target).parent(), newGroupName, ignoreGroup)) {
				newGroupName = groupName + ' (' + (i++) + ')';				
			}
			
			$(newElm).children('div.vboxChooserGroupHeader').attr({'title':newGroupName}).children('span.vboxChooserGroupName').text(newGroupName);
			
			$(newElm).insertBefore(target);
			
		});
		
		// VMs
		$(vboxChooser.getSelectedGroupElements()[0]).children('div.vboxChooserGroupVMs').children().each(function(i,elm){
			$(elm).detach();
			if(!target.children('table.vboxChooserItem-'+vboxChooser._anchorid+'-'+$(elm).data('vmid'))[0])
				target.append(elm);
		});
		
		
		vboxChooser.composeGroupDef();
		
		vboxChooser.selectionListChanged();
		

	},
	
	/*
	 * Sort group sub-elements based on VirtualBox
	 * group definitions
	 */
	sortGroup : function(gElm) {
		
		// Find group orders
		var gPath = $(gElm).data('vmGroupPath');
		var groupList = vboxChooser._groupDefs;
		
		if(!gPath) return;
		
		var machineOrder = [];
		var groupOrder = [];
		
		// Get correct order
		for(var i = 0; i < groupList.length; i++) {
			if(groupList[i].path == gPath) {
				order = groupList[i].order.split(',');
				for(var a = 0; a < order.length; a++) {
					kv = order[a].split('=',2);
					if(kv[0] == 'm') machineOrder[machineOrder.length] = kv[1];
					else groupOrder[groupOrder.length] = kv[1];
				}
			}
		}
		
				
		// sort groups
		var groups = $(gElm).children('div.vboxChooserGroup').get();
		groups.sort(function(a,b){
			
			var Pos1 = jQuery.inArray($(a).children('div.vboxChooserGroupHeader').attr('title'), groupOrder);
			var Pos2 = jQuery.inArray($(b).children('div.vboxChooserGroupHeader').attr('title'), groupOrder);
			
			return (Pos1 > Pos2 ? -1 : (Pos2 > Pos1 ? 1 : 0));
			
		});
		$.each(groups, function(idx,itm) {
			$(itm).insertAfter($(gElm).children('div.vboxChooserGroupHeader'));
		});
		
		// sort VMs
		var vms = $(gElm).children('div.vboxChooserGroupVMs').children('table.vboxChooserVM').get();
		vms.sort(function(a,b) {
			var Pos1 = jQuery.inArray($(a).data('vmid'), machineOrder);
			var Pos2 = jQuery.inArray($(b).data('vmid'), machineOrder);
			
			return (Pos1 > Pos2 ? 1 : (Pos2 > Pos1 ? -1 : 0));
		});
		$.each(vms, function(idx,itm) {
			$(gElm).children('div.vboxChooserGroupVMs').append(itm);
		});
		
		
	},
	
	/*
	 * Sort selected group by item names
	 */
	sortSelectedGroup : function(rootElm) {

		var el = $(vboxChooser.getSelectedGroupElements()[0]);
		
		if(rootElm || !el) {
			el = vboxChooser._anchor.children('div.vboxChooserGroup');
		}
		
		// sort groups
		var groups = $(el).children('div.vboxChooserGroup').get();
		groups.sort(function(a,b){
			return $(b).children('div.vboxChooserGroupHeader').attr('title').localeCompare($(a).children('div.vboxChooserGroupHeader').attr('title'));
		});
		$.each(groups, function(idx,itm) {
			$(itm).insertAfter($(el).children('div.vboxChooserGroupHeader'));
		});
		
		// sort VMs
		var vms = $(el).children('div.vboxChooserGroupVMs').children('table.vboxChooserVM').get();
		vms.sort(function(a,b) {
			return $(a).find('td.vboxVMTitle').text().localeCompare($(b).find('td.vboxVMTitle').text());
		});
		$.each(vms, function(idx,itm) {
			$(el).children('div.vboxChooserGroupVMs').append(itm);
		});
		
		vboxChooser.composeGroupDef();

	},
	
	/*
	 * Rename selected group
	 */
	renameSelectedGroup : function() {
		
		var el = $(vboxChooser.getSelectedGroupElements()[0]);
		
		// Function to rename group
		var renameGroup = function(e, textbox) {
			
			if(!textbox) textbox = $(this);
			
			var newName = $(textbox).val().replace(/[\\\/:*?"<>,]/g,'_');
			
			if(newName && newName != $(textbox).closest('div.vboxChooserGroup').children('div.vboxChooserGroupHeader').attr('title')) {
				
				// Do not rename if it conflicts
				var noConflict = newName;
				var i = 2;
				while(vboxChooser.groupNameConflicts($(textbox).parent().parent().parent().parent(), noConflict)) {
					noConflict = newName + ' (' + (i++) + ')';
				}
				newName = noConflict;
				
				$(textbox).closest('div.vboxChooserGroup')
					.children('div.vboxChooserGroupHeader').attr({'title':newName})
					.children('span.vboxChooserGroupName').html(newName);

				vboxChooser.composeGroupDef();
			}
			
			
			$(textbox).parent().parent().children().show();
			$(textbox).parent().empty().remove();
		};
		
		$(el).children('div.vboxChooserGroupHeader').children().hide();
		$(el).children('div.vboxChooserGroupHeader').append(
			
			$('<form />').append(
				$('<input />').attr({'type':'text','value':$(el).children('div.vboxChooserGroupHeader').attr('title')}).css({'width':'90%','padding':'0px','margin':'0px'}).bind('keypress',function(e){
					if (e.which == 13) {
						$(this).unbind('blur', renameGroup);
						renameGroup(e,this);
						e.stopPropagation();
						e.preventDefault();
						$(this).trigger('blur');
						return false;
					}
				})
			)

		);
		$(el).children('div.vboxChooserGroupHeader').children('form').children('input').focus().select().blur(renameGroup);

	},

	/*
	 * Select a single item in our list
	 */
	selectItem : function(e) {
		
		// Right click selects item if it is not selected
		if(e.which != 1) {
	
			// Right click on group header and group is selected
			// just return and show context menu
			if($(this).hasClass('vboxChooserGroupHeader') && $(this).parent().hasClass('vboxVMGroupSelected')) {
				return;
			
			// Right click on VM and VM is already selected
			// just return and show context menu
			} else if($(this).hasClass('vboxListItemSelected')) {
				return;
			}
		}
		
		var selectedList = [];
		var item = $(this);
		
		
		// Group?
		if($(item).hasClass('vboxChooserGroupHeader')) {
			
			
			// No control key. Exclusive selection
			if(!e.ctrlKey && !e.metaKey) {
				
				// already selected
				if(vboxChooser._selectedList.length == 1 && vboxChooser._selectedList[0].type == 'group' &&
						vboxChooser._selectedList[0].groupPath == $(item).parent().data('vmGroupPath'))
					return;

					vboxChooser._anchor.find('.vboxListItemSelected').removeClass('vboxListItemSelected');
				vboxChooser._anchor.find('div.vboxVMGroupSelected').removeClass('vboxVMGroupSelected');
				
				// select current group
				$(item).parent().addClass('vboxVMGroupSelected');

				selectedList = [{
					type: 'group',
					groupPath: $(item).parent().data('vmGroupPath')
				}];

			// Already selected, and ctrl key
			} else if($(item).parent().hasClass('vboxVMGroupSelected')){
				
				// Deselect item
				selectedList = vboxChooser._selectedList.filter(function(v){
					return (v.type != 'group' || (v.groupPath != $(item).parent().data('vmGroupPath')));
				});
				
				$(item).parent().removeClass('vboxVMGroupSelected');
			
			// Not already selected, and ctrl key
			} else {
	
				$(item).parent().addClass('vboxVMGroupSelected');
				
				selectedList = vboxChooser._selectedList;
				
				selectedList[selectedList.length] = {
					type: 'group',
					groupPath: $(item).parent().data('vmGroupPath')
				};
				
			}
			
			
		// VM
		} else {
			
			// No ctrl key or selection is host. Exclusive selection
			if((!e.ctrlKey && !e.metaKey) || $(item).data('vmid') == 'host') {
				
				
				// already selected
				if(vboxChooser._selectedList.length == 1 && vboxChooser._selectedList[0].type == 'vm' &&
						vboxChooser._selectedList[0].id == $(item).data('vmid'))
					return;

				vboxChooser._anchor.find('.vboxListItemSelected').removeClass('vboxListItemSelected');
				vboxChooser._anchor.find('div.vboxVMGroupSelected').removeClass('vboxVMGroupSelected');
				
				// Select current VM
				$(item).addClass('vboxListItemSelected').removeClass('vboxHover');
				
				selectedList = [{
					type: 'vm',
					id: $(item).data('vmid'),
					groupPath: $(item).parent().data('vmGroupPath')
				}];
				
			// Already selected, and ctrl key
			} else if($(item).hasClass('vboxListItemSelected')) {

				// Deselect item
				selectedList = vboxChooser._selectedList.filter(function(v){
					return (v.type == 'group' || (v.id != $(item).data('vmid')));
				});
				
				$(item).removeClass('vboxListItemSelected');
			
			// ctrl key, but not already selected
			} else {
				
				$(item).addClass('vboxListItemSelected').removeClass('vboxHover');
				
				selectedList = vboxChooser._selectedList;
				
				selectedList[selectedList.length] = {
					type: 'vm',
					id: $(item).data('vmid'),
					groupPath: $(item).parent().data('vmGroupPath')
				};
				
			}
			
		}

		// Remove host?
		if(selectedList.length > 1) {

			// Deselect host
			selectedList = selectedList.filter(function(v){
				return (v.type == 'group' || (v.id != 'host'));
			});
			
			vboxChooser._anchor.children('table.vboxChooserItem-'+vboxChooser._anchorid+'-host').removeClass('vboxListItemSelected');
			
		}
		vboxChooser.selectionListChanged(selectedList);

		
	},
	
	/*
	 * Show only single group element identified by gelm
	 */
	showOnlyGroupElm : function(gelm) {

		// Going backwards affects animations
		var back = false;
		
		// gelm is null if we're going backwards
		if(!gelm) {
			if(vboxChooser._showOnlyGroupHistory.length > 1) {
				// this gets rid of current
				vboxChooser._showOnlyGroupHistory.pop();
				// selects previous
				gelm = vboxChooser._showOnlyGroupHistory.pop();
				back = true;
			} else {
				gelm = null;
			}
		} else {
			vboxChooser._showOnlyGroupHistory[vboxChooser._showOnlyGroupHistory.length] = gelm;			
		}
		
		
		if($(gelm)[0]) {
			
			
			// Pull everything up
			$.when(vboxChooser._anchor.hide('slide', {direction: (back ? 'right' : 'left'), distance: (vboxChooser._anchor.outerWidth()/1.5)}, 200)).then(function() {
				
				/* hide host when showing only a group */
				$('table.vboxChooserItem-'+vboxChooser._anchorid+'-host').hide();

				/* Undo anything previously performed by this */
				vboxChooser._anchor.find('div.vboxChooserGroupHide').removeClass('vboxChooserGroupHide').removeClass('vboxChooserGroupHideShowContainer');
				vboxChooser._anchor.find('div.vboxChooserGroupShowOnly').removeClass('vboxChooserGroupShowOnly');

				$(gelm).parents('div.vboxChooserGroup').addClass('vboxChooserGroupHide').addClass('vboxChooserGroupHideShowContainer').siblings().addClass('vboxChooserGroupHide');
				$(gelm).addClass('vboxChooserGroupShowOnly').siblings().addClass('vboxChooserGroupHide');
				vboxChooser._anchor.show('slide', {direction: (back ? 'left' : 'right'), distance: (vboxChooser._anchor.outerWidth()/1.5)}, 200);
				
			});
			
		} else {

			vboxChooser._showOnlyGroupHistory = [];

			// Pull everything up
			$.when(vboxChooser._anchor.hide('slide', {direction: 'right', distance: (vboxChooser._anchor.outerWidth()/1.5)}, 200)).then(function() {

				/* show host when going back to main list */
				$('table.vboxChooserItem-'+vboxChooser._anchorid+'-host').show();
	
				vboxChooser._anchor.find('div.vboxChooserGroupHide').removeClass('vboxChooserGroupHide').removeClass('vboxChooserGroupHideShowContainer');
				vboxChooser._anchor.find('div.vboxChooserGroupShowOnly').removeClass('vboxChooserGroupShowOnly');
				
				vboxChooser._anchor.show('slide', {direction: 'left', distance: (vboxChooser._anchor.outerWidth()/1.5)}, 200);
			});
		}
			
	},
	
	/*
	 * Return HTML for group with VM place-holders
	 */
	groupHTML : function(gpath) {
		
	 	var first = (!gpath || gpath == '/');
	 	var gname = gpath.substring(gpath.lastIndexOf('/')+1);
		var gHTML = $('<div />').append(
			$('<div />').addClass('vboxChooserGroupHeader').css({'display':(first ? 'none' : '')})
				.attr({'title':gname})
				.dblclick(function() {
					$(this).children('span.vboxChooserGroupNameArrowCollapse').click();
				})
				.append(
						$('<div />').addClass('vboxChooserDropTarget')
							.addClass('vboxDropTargetTop').hover(function(){
							if(vboxChooser._draggingGroup)
								$(this).addClass('vboxChooserDropTargetHover' + (first ? 'ignore' : ''));
						}, function(){
							$(this).removeClass('vboxChooserDropTargetHover');
						})
				)
				.append(
						$('<span />').addClass('vboxChooserGroupNameArrowCollapse')
							.click(function(e) {
								$(this).closest('div.vboxChooserGroup').toggleClass('vboxVMGroupCollapsed', 300);
								if(e) {
									e.stopPropagation();
									e.preventDefault();
								}

								return false;
							})
				).append(
						$('<span />').addClass('vboxChooserGroupShowOnlyBack')
							.click(function(e) {
								e.stopPropagation();
								e.preventDefault();
								vboxChooser.showOnlyGroupElm();
								return false;

							})
				)
				.append($('<span />').html(gname).addClass('vboxChooserGroupName'))
				.append($('<span />').addClass('vboxChooserGroupInfo').html(
						"<span class='vboxChooserGroupCounts' />"
						).append(
							$('<span />').addClass('vboxChooserGroupShowOnly').click(function(e){
								e.stopPropagation();
								e.preventDefault();
								vboxChooser.showOnlyGroupElm($(this).closest('div.vboxChooserGroup'));
								return false;
							})
						))
				.append(
					$('<div />').addClass('vboxChooserDropTarget').addClass('vboxChooserDropTargetBottom')
						.hover(function(){
							if(vboxChooser._draggingGroup)
								$(this).addClass('vboxChooserDropTargetHover' + (first ? 'ignore' : ''));
						}, function(){
							$(this).removeClass('vboxChooserDropTargetHover');
					})

				)
				.hover(function(){
					$(this).addClass('vboxHover');
				},function(){
					$(this).removeClass('vboxHover');
				}).bind('mousedown',vboxChooser.selectItem)				

			).addClass((first ? 'vboxVMlistGroupRoot' : '')).addClass('vboxChooserGroup')
			.data({'vmGroupPath':gpath})
			.draggable({'cursorAt':{left: -10, top: -10},'helper':function(){
				
				return $(this).clone().addClass('vboxVMGroupCollapsed').addClass('vboxVMGroupSelected')
					.children('div.vboxChooserGroupHeader').removeClass('vboxHover').children('span.vboxChooserGroupNameArrowCollapse').hide()
					.parent().parent().css({'width':$(this).width()+'px'});
									
				
				},'start':function() {
										
					if(!$('#vboxPane').data('vboxSession').admin) return false;
					
					vboxChooser._draggingGroup = $(this).data('vmGroupPath');
					$(vboxChooser._anchor).disableSelection();
				
				},'stop':function(e) {
					vboxChooser.vmGroupDropped(e,$(this));					
					
			}}).append($('<div />').addClass('vboxChooserGroupVMs'));


		// Bottom drop target
		if(!first) {
			gHTML.append(
				$('<div />').addClass('vboxChooserDropTarget').addClass('vboxChooserDropTargetBottom')
					.hover(function(){
						if(vboxChooser._draggingGroup)
							$(this).addClass('vboxChooserDropTargetHover');
					}, function(){
						$(this).removeClass('vboxChooserDropTargetHover');
				})
			);
		}

		

		// Group context menu
		$(gHTML).contextMenu({
			menu: vboxChooser._vmGroupContextMenuObj.menuId(),
			menusetup: function(el) {
				$(el).children('div.vboxChooserGroupHeader').trigger('click');
			}
		},function(act,el,pos,d,e){
			vboxChooser._vmGroupContextMenuObj.menuClickCallback(act, el);
		});
		
		return gHTML;
		
		
	
	},
	
	/*
	 * Return selected VM elements
	 */
	getSelectedVMElements : function() {
		return vboxChooser._anchor.find('table.vboxSelected');
	},
	
	/*
	 * Return selected group elements
	 */
	getSelectedGroupElements : function() {
		return vboxChooser._anchor.find('div.vboxVMGroupSelected');
	},
	
	
	/*
	 * Start VM list update
	 */ 
	start : function(anchorid) {
		
		// already running?
		if(vboxChooser._running) return;
		vboxChooser._running = true;

		// Where are we drawn?
		if(anchorid) {
			vboxChooser._anchorid = anchorid;
			vboxChooser._anchor = $('#'+anchorid);			
		}

		// Get groups, machine list and start listener
		$.when(vboxAjaxRequest('vboxGroupDefinitionsGet')).then(function(g) {
			
			vboxChooser._groupDefs = g.data;
			
			$.when(vboxVMDataMediator.getVMList()).then(function(d) {
				vboxChooser.updateList(d);
			});			
		});
		
	},
		
	/*
	 * Stop VM list updates and clear list
	 */
	stop : function() {
		
		if(!vboxChooser._running) return;
		vboxChooser._running = false;
		
		vboxChooser._anchor.html("<div id='vboxChooserSpinner' style='text-align: center'><img src='images/spinner.gif' /></div>");
		
		// reset vars
		vboxChooser._versionChecked = false;
		vboxChooser._selectedList = [];
		vboxChooser.selectedVMs = [];
		vboxChooser.selectionMode = vboxSelectionModeNone;
		
	}
	
	

};

$(document).ready(function(){

	// "Stop" chooser
	$('#vboxPane').bind('hostChange',function(){
	
		vboxChooser.stop();
		
	}).bind('hostChanged',function(){
	
	
		vboxChooser.start();
		
	// VM data changed
	}).bind('vboxMachineDataChanged',function(e, vmid, data) {
	
		// Update VM in list
		if(data) {
	
			// Enforce VM ownership
		    if($('#vboxPane').data('vboxConfig').enforceVMOwnership && !$('#vboxPane').data('vboxSession').admin && data.owner != $('#vboxPane').data('vboxSession').user) {
		    	return;
		    }
		    
	
			// Remove from groups if they have changed
			var currGroups  = vboxChooser.getGroupsForVM(vmid);
			var groupDiff = $(currGroups).not(data.groups);
			var groupsChanged = groupDiff.length;
			for(var i = 0; i < groupDiff.length; i++) {
				
				$(vboxChooser.getGroupElement(groupDiff[i], false)).children('div.vboxChooserGroupVMs')
					.children('table.vboxChooserItem-'+vboxChooser._anchorid+'-'+data.id).empty().remove();
			}
			
			// Add placeholder to other groups
			var groupDiff = $(data.groups).not(currGroups);
			groupsChanged = (groupsChanged || groupDiff.length);
			for(var i = 0; i < groupDiff.length; i++) {
				
				// Skip it if it is already there
				if($(vboxChooser.getGroupElement(groupDiff[i])).children('div.vboxChooserGroupVMs').children('table.vboxChooserItem-'+vboxChooser._anchorid+'-'+data.id)[0])
					continue;
				
				$(vboxChooser.getGroupElement(groupDiff[i])).children('div.vboxChooserGroupVMs')
					.append(								
						vboxChooser.vmHTML(data)
					);
			}
	
			vboxChooser.updateVMElement(data);
	
			if(groupsChanged) vboxChooser.composeGroupDef(true);
		}
		
	
	// Snapshot taken
	}).bind('vboxSnapshotTaken',function(e,vmid) {
		
		vboxChooser.updateVMElement(vboxVMDataMediator.getVMData(vmid));
	
	
	// Machine removed or registered
	}).bind('vboxMachineRegistered', function(e, vmid, registered, data) {
		
		// removed
		if(!registered) {
	
			// See if VM is selected
			if(jQuery.inArray(vmid, vboxChooser.selectedVMs) > -1) {
				
				var selectedList = vboxChooser._selectedList.filter(function(v){
					return (v.type == 'group' || (v.id != vmid));
				});
				
				vboxChooser.selectionListChanged(selectedList);
				
				
			}
			
			$('#'+vboxChooser._anchorid +' table.vboxChooserItem-'+vboxChooser._anchorid+'-'+vmid).remove();
			
			vboxChooser.composeGroupDef(true);
			
			return;
		}
		
		// Enforce VM ownership
	    if($('#vboxPane').data('vboxConfig').enforceVMOwnership && !$('#vboxPane').data('vboxSession').admin && data.owner != $('#vboxPane').data('vboxSession').user) {
	    	return;
	    }
	
		// Add to list			
		vboxChooser.updateVMElement(data, true);
	
	// Watch for group order changes
	}).bind('vboxExtraDataChanged', function(e, machineId, key, value) {
						
		if(!machineId && key.indexOf('GUI/GroupDefinitions') === 0) {
			
			var path = key.substring(20);
			if(!path) path = "/";
			var name = path.substring(path.lastIndexOf('/')+1);
			var vboxVMGroups = vboxChooser._groupDefs;
			var found = false;
			
			for(var a = 0; a < vboxVMGroups.length; a++) {
				if(vboxVMGroups[a].path == path) {
					// Don't do anything if its the same
					if(vboxVMGroups[a].order == value)
						return;					
					found = true;
					vboxVMGroups[a] = {'path':path,'name':name,'order':value};
					break;
				}
			}
			
			if(!found)
				vboxVMGroups[vboxVMGroups.length] = {'path':path,'name':name,'order':value};
			
			// Sort element
			if(value) {
				vboxChooser.sortGroup($(vboxChooser.getGroupElement(path),false));
			}
			
		} else {
			
			switch(key) {
			
				// redraw when custom icon changes
				case 'phpvb/icon':
					vboxChooser.updateVMElement(vboxVMDataMediator.getVMData(machineId));
					break;
			}
		}
	
	
	// Machine or session state updates element
	}).bind('vboxMachineOrSessionStateChanged', function(e, vmid) {
		
		vboxChooser.updateVMElement(vboxVMDataMediator.getVMData(vmid));
		
		// Update menus if the VM is selected
		if(vboxChooser.isVMSelected(vmid)) {
			
			if(vboxChooser._vmGroupContextMenuObj)
				vboxChooser._vmGroupContextMenuObj.update(vboxChooser);
	
			if(vboxChooser._vmContextMenuObj)
				vboxChooser._vmContextMenuObj.update(vboxChooser);
	
		}
		
	// Update menus on selection list change
	}).bind('vmSelectionListChanged',function(){
		
		if(vboxChooser._vmGroupContextMenuObj)
			vboxChooser._vmGroupContextMenuObj.update(vboxChooser);
	
		if(vboxChooser._vmContextMenuObj)
			vboxChooser._vmContextMenuObj.update(vboxChooser);
		
	
	});

});