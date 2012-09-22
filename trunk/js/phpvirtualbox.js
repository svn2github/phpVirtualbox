/**
 * @fileOverview Common classes and objects used
 * @author Ian Moore (imoore76 at yahoo dot com)
 * @version $Id$
 * @copyright Copyright (C) 2010-2012 Ian Moore (imoore76 at yahoo dot com)
 */



/**
 * VM group manipulation
 * @namespace vboxVMGroups
 */
var vboxVMGroups = {
	
	// Return group data for group at path
	getGroupByPath : function(path) {
		return vboxTraverse([$('#vboxIndex').data('vboxVMGroups')], 'path', path, false, 'subgroups');
	},
	
	// Return all vms in group and subgroup
	getVMsInGroup : function(gdef) {
		
		if(typeof gdef == 'string')
			gdef = vboxVMGroups.getGroupByPath(gdef);
		
		var vms = [];
		for(var i = 0; i < gdef.subgroups.length; i++) {
			vms = $.merge(vms,vboxVMGroups.getVMsInGroup(gdef.subgroups[i]));
		}
		vms = $.merge(vms, gdef.machines);
		return vms;
	},
	
	// Save group definition
	saveGroups : function(gdef) {
		$('#vboxIndex').data('vboxVMGroups', gdef);
		vboxAjaxRequest('vboxGroupDefinitionsSet',{'groupDefinitions':gdef},function(){
			
		});
	},
	
	// Get Groups for VM
	getGroupsForVM : function(vmid, gdef) {
		
		// This is undefined when checking root
		if(!gdef) gdef = $('#vboxIndex').data('vboxVMGroups');
		
		// Hold group list
		var glist = [];
		
		// In current group?
		if(jQuery.inArray(vmid, gdef.machines) > -1)
			glist[0] = gdef.path;
		
		// Traverse subgroups and check machines
		for(var i = 0; i < gdef.subgroups.length; i++) {
			glist = $.merge(glist, vboxVMGroups.getGroupsForVM(vmid, gdef.subgroups[i]));
		}
		
		return glist;
		
	}
};

/**
 * VM details sections used on details tab and snapshot pages
 * @namespace vboxVMDetailsInfo
 */

var vboxHostDetailsSections = {
	
	/*
	 * General 
	 */
	hostgeneral: {
		icon:'machine_16px.png',
		title:'General',
		settingsLink: 'General',
		multiSelectDetailsTable: true,
		rows : [
		   {
			   title: trans('Name', 'UIDetailsPagePrivate'),
			   callback: function() { return $('#vboxIndex').data('vboxConfig').name; },
			   condition: function() { return $('#vboxIndex').data('vboxConfig').servers.length; }
		   },
		   {
			   title: trans('OS Type'),
			   callback: function(d) {
				   return d['operatingSystem'] + ' (' + d['OSVersion'] +')';
			   }
		   },
		   {
			   title: 'VirtualBox',
			   callback: function() {
				   return $('#vboxIndex').data('vboxConfig').version.string+' ('+$('#vboxIndex').data('vboxConfig').version.revision+')';
			   }
		   },{
			   title: trans('Base Memory'),
			   callback: function(d) {
				   return trans('<nobr>%1 MB</nobr>').replace('%1',d['memorySize']);
			   }
		   },{
			   title: '',
			   data: '<span id="vboxHostMemUsed"><div style="background-color:#a33" id="vboxHostMemUsedPct"><div style="background-color:#a93;float:right;" id="vboxHostMemResPct"></div></div><div style="width:100%;position:relative;top:-14px;left:0px;z-index:2;text-align:center;"><span id="vboxHostMemUsedLblPct" style="float:left" /><span id="vboxHostMemFreeLbl" style="float:right" /></div></span>'
		   },{
			   title: trans("Processors",'UIDetailsPagePrivate'),
			   callback: function(d) {
				   return d['cpus'][0] + ' (' + d['cpus'].length +')';
			   }
		   },{
			   title: '',
			   callback: function(d) {
			
				   // Processor features?
					var cpuFeatures = new Array();
					for(var f in d.cpuFeatures) {
						if(!d.cpuFeatures[f]) continue;
						cpuFeatures[cpuFeatures.length] = trans(f);
					}
					return cpuFeatures.join(', ');
					
			   },
			   condition: function(d) {
				   if(!d.cpuFeatures) return false;
				   for(var f in d.cpuFeatures) {
					   if(!d.cpuFeatures[f]) continue;
					   return true;
					}
					return false;
			   }
		}],
		
		onRender: function(d) {
			
			// See if timer is already set
			var eTimer = $('#vboxVMDetails').data('vboxHostMemInfoTimer');
			if(eTimer != null) {
				$('#vboxVMDetails').data('vboxHostMemInfoTimer',null);
				window.clearInterval(eTimer);
			}

			
			var showFree = $('#vboxIndex').data('vboxConfig').hostMemInfoShowFreePct;
			var memRes = $('#vboxIndex').data('vboxConfig').vmMemoryOffset;
			if(!memRes || parseInt(memRes) < 1) memRes = 0;
			
			// Memory used function
			var vboxHostShowMemInfo = function(avail) {

				// If target div no longer exists, stop updating
				if($('#vboxHostMemFreeLbl')[0] == null) {
					var eTimer = $('#vboxVMDetails').data('vboxHostMemInfoTimer');
					$('#vboxVMDetails').data('vboxHostMemInfoTimer',null);
					window.clearInterval(eTimer);
					return;
				}
				
				// Subtract reserved memory?
				avail -= memRes;
				avail = Math.max(0,avail);
				
				var mUsed = d['memorySize'] - (avail + memRes);
				var mUsedPct = Math.round(parseInt((mUsed / d['memorySize']) * 100));
				var memResPct = 0;
				if(memRes > 0) {
					memResPct = Math.round(parseInt((memRes / d['memorySize']) * 100));
				}
				
				// Add tooltip with info
				var tip = trans('<nobr>%1 MB</nobr>').replace('%1',mUsed);
				if(memResPct) tip += ' | ' + trans('<nobr>%1 MB</nobr>').replace('%1',memRes);
				tip += ' | ' + trans('<nobr>%1 MB</nobr>').replace('%1',avail);
				$('#vboxHostMemUsed').tipped({'source':tip,'position':'mouse'});
				
				// Update tooltip content in case tooltip is already showing
				var cid = $($('#tipped').data('original')).attr('id');
				if(cid && cid == 'vboxHostMemUsed') $('#tipped-content').html(tip);
				
				// Width(s)
				$('#vboxHostMemUsedPct').css({'width':((mUsedPct+memResPct)*2)+'px'});
				if(memRes > 0) {
					$('#vboxHostMemResPct').css({'width':''+(memResPct*2)+'px'});
				} else {
					$('#vboxHostMemResPct').hide();
				}

				// Labels
				if(!showFree) {
					$('#vboxHostMemUsedLblPct').html(trans('<nobr>%1 MB</nobr>').replace('%1',(mUsed)) + ' ('+trans('<nobr>%1%</nobr>').replace('%1',mUsedPct)+')');
					$('#vboxHostMemFreeLbl').html(trans('<nobr>%1 MB</nobr>').replace('%1',avail));			
				} else {
					$('#vboxHostMemUsedLblPct').html(trans('<nobr>%1 MB</nobr>').replace('%1',mUsed));
					$('#vboxHostMemFreeLbl').html('('+trans('<nobr>%1%</nobr>').replace('%1',Math.round(parseInt((avail / d['memorySize']) * 100)))+') ' + trans('<nobr>%1 MB</nobr>').replace('%1',avail));
				}
			};
			
			// Refresh at configured intervals
			var interval = 5;
			try {
				interval = Math.max(3,parseInt($('#vboxIndex').data('vboxConfig').hostMemInfoRefreshInterval));
			} catch (e) {
				interval = 5;
			}
			
			var vboxHostUpdateMeminfo = function() {
				vboxAjaxRequest('hostGetMeminfo',{},function(d){
					vboxHostShowMemInfo(d.memoryAvailable);		
				});
			};
			vboxHostUpdateMeminfo();
			
			// Failsafe
			if(isNaN(interval) || interval < 3) interval = 5;
			
			$('#vboxVMDetails').data('vboxHostMemInfoTimer',window.setInterval(vboxHostUpdateMeminfo,interval*1000));
		
		}

	},
		   
	hostnetwork: {
		title: 'Network',
		icon: 'nw_16px.png',
		rows: function(d) {
			
			var netRows = [];
			
			for(var i = 0; i < d['networkInterfaces'].length; i++) {		
				
				/* Interface Name*/
				netRows[netRows.length] = {
					title: d['networkInterfaces'][i].name + ' (' + trans(d['networkInterfaces'][i].status,'VBoxGlobal') + ')',
					data: ''
				};
				

				/* IPv4 Addr */
				if(d['networkInterfaces'][i].IPAddress){
					
					netRows[netRows.length] = {
						title: trans('IPv4 Address','UIGlobalSettingsNetwork'),
						data: d['networkInterfaces'][i].IPAddress + ' / ' + d['networkInterfaces'][i].networkMask,
						indented: true
					};
					
				}
				
				/* IPv6 Address */
				if(d['networkInterfaces'][i].IPV6Supported && d['networkInterfaces'][i].IPV6Address) {
					
					netRows[netRows.length] = {
						title: trans('IPv6 Address','UIGlobalSettingsNetwork'),
						data: d['networkInterfaces'][i].IPV6Address + ' / ' + d['networkInterfaces'][i].IPV6NetworkMaskPrefixLength,
						indented: true
					};
				}
				
				/* Physical info */
				netRows[netRows.length] = {
					title: '',
					data: trans(d['networkInterfaces'][i].mediumType) + (d['networkInterfaces'][i].hardwareAddress ? ' (' + d['networkInterfaces'][i].hardwareAddress + ')' : ''),
					indented: true
				};
				
				
				/* VMs bound to NIC */
				if(d['nics'][d['networkInterfaces'][i].name]) {
					var vms = new Array();
					for(var vmname in d['nics'][d['networkInterfaces'][i].name]) {
						d['nics'][d['networkInterfaces'][i].name][vmname].sort();
						var ads = new Array();
						for(var n = 0; n < d['nics'][d['networkInterfaces'][i].name][vmname].length; n++) {
							ads[ads.length] = trans("Adapter %1",'VBoxGlobal').replace('%1',d['nics'][d['networkInterfaces'][i].name][vmname][n]);
						}
						vms[vms.length] = vmname + ' (' + ads.join(', ') + ')';
					}
					vms.sort(strnatcasecmp);
					
					netRows[netRows.length] = {
						title: '',
						data: vms.join(', '),
						indented: true
					};
				}
				
			}
			return netRows;
		}
	},

	hostdvddrives : {
		title: 'CD/DVD Devices',
		translationContext: 'UIActionPool',
		icon: 'cd_16px.png',
		condition: function(d) {
			return d['DVDDrives'].length;
		},
		rows: function(d) {

			var dvdRows = [];
			
			for(var i = 0; i < d['DVDDrives'].length; i++) {
				dvdRows[dvdRows.length] = {
					title: vboxMedia.getName(vboxMedia.getMediumById(d['DVDDrives'][i].id)),
					data: ''
				};
			}
			
			return dvdRows;
		}
	},
	
	hostfloppydrives: {
		title:'Floppy Devices',
		translationContext: 'UIActionPool',
		icon: "fd_16px.png",
		condition: function(d) { return d['floppyDrives'].length; },
		rows: function(d) {
			
			var fRows = [];
			
			for(var i = 0; i < d['floppyDrives'].length; i++) {		
				
				fRows[fRows.length] = {
						title: vboxMedia.getName(vboxMedia.getMediumById(d['floppyDrives'][i].id)),
						data: ''
				};
				
			}

			return fRows;
		}
	}
};

/**
 * VM details sections used on details tab and snapshot pages
 * @namespace vboxVMDetailsInfo
 */

var vboxVMDetailsSections = {
	
	/*
	 * General 
	 */
	general: {
		icon:'machine_16px.png',
		title:'General',
		settingsLink: 'General',
		multiSelectDetailsTable: true,
		rows : [
		   {
			   title: trans('Name', 'UIDetailsPagePrivate'),
			   attrib: 'name'
		   },
		   {
			   title: trans('OS Type'),
			   attrib: 'OSTypeDesc'
		   },
		   {
			   title: trans('Guest Additions Version'),
			   attrib: 'guestAdditionsVersion'
		   },
		   {
			   title: trans('Groups'),
			   condition: function(d){
				   return (d.groups.length > 1 || (d.groups.length == 1 && d.groups[0] != '/')); 
			   },
			   callback: function(d) {
				   if(d.groups && d.groups.length > 0)
					   return jQuery.map(d.groups,function(elm) {
						   if(elm.length > 1) return elm.substring(1);
						   return elm;
					   }).join(', ');
			   }
		   }
		   
		]
	},
	
	/*
	 * System
	 */
	system : {
		icon:'chipset_16px.png',
		title:'System',
		settingsLink: 'System',
		multiSelectDetailsTable: true,
		rows : [
		   {
			   title: trans('Base Memory'),
			   callback: function(d) {
				   return trans('<nobr>%1 MB</nobr>').replace('%1',d['memorySize']);
			   }
		   },{
			   title: trans("Processors",'UIDetailsPagePrivate'),
			   attrib: 'CPUCount',
			   condition: function(d) { return d.CPUCount > 1; }
		   },{
			   title: trans("Execution Cap"),
			   callback: function(d) {
				   return trans('<nobr>%1%</nobr>').replace('%1',parseInt(d['CPUExecutionCap']));
			   },
			   condition: function(d) { return d.CPUExecutionCap < 100; }
		   },{
			   title: trans("Boot Order"),
			   callback: function(d) {
					var bo = new Array();
					for(var i = 0; i < d['bootOrder'].length; i++) {
						bo[i] = trans(vboxDevice(d['bootOrder'][i]),'VBoxGlobal');
					}
					return bo.join(', ');
			   }
		   },{
			   title: trans("Acceleration",'UIDetailsPagePrivate'),
			   callback: function(d) { return trans('PAE/NX'); },
		   	   condition: function(d) { return d['CpuProperties']['PAE']; }
		   },{
			   title: trans("VCPU"),
			   callback: function(d) {
				   return (d['HWVirtExProperties'].Enabled ? trans('Enabled') : trans('Disabled'));
			   },
			   condition: function() { return $('#vboxIndex').data('vboxConfig').enableAdvancedView; }
		   },{
			   title: trans("Nested Paging"),
			   callback: function(d) {
				   return (d['HWVirtExProperties'].NestedPaging ? trans('Enabled') : trans('Disabled'));
			   },
			   condition: function() { return $('#vboxIndex').data('vboxConfig').enableAdvancedView; }
		   },{
			   title: trans("Large Pages"),
			   callback: function(d) {
				   return (d['HWVirtExProperties'].LargePages? trans('Enabled') : trans('Disabled'));
			   },
			   condition: function() { return $('#vboxIndex').data('vboxConfig').enableAdvancedView; }
		   },{
			   title: trans("Exclusive use of the hardware virtualization extensions"),
			   callback: function(d) {
				   return (d['HWVirtExProperties'].Exclusive ? trans('Enabled') : trans('Disabled'));
			   },
			   condition: function() { return $('#vboxIndex').data('vboxConfig').enableAdvancedView; } 
		   }
		]
	},
	
	/*
	 * Preview box
	 */
	preview : {
		icon:'fullscreen_16px.png',
		title:'Preview',
		settingsLink: 'Display',
		condition: function() {
			return !($('#vboxIndex').data('vboxConfig').noPreview);
		},

		/*
		 * 
		 * Preivew Update Menu
		 *
		 */
		contextMenu : function() {
			
			var menu = $('#vboxDetailsPreviewMenu');
			if(menu[0]) return menu;
			
			// Set defaults
			if($('#vboxIndex').data('vboxCookies')["vboxPreviewUpdate"] === undefined) {
				if($('#vboxIndex').data('vboxConfig').previewUpdateInterval)
					$('#vboxIndex').data('vboxCookies')["vboxPreviewUpdate"] = $('#vboxIndex').data('vboxConfig').previewUpdateInterval;
				else
					$('#vboxIndex').data('vboxCookies')["vboxPreviewUpdate"] = 3;
			}
			

			/* Menu List */
			var ul = $('<ul />')
				.attr({'class':'contextMenu contextMenuNoBG','style':'display: none','id':'vboxDetailsPreviewMenu'})
				.click(function(){$(this).hide();})
				.bind('contextmenu', function() { return false; })
				
				// Menu setup for "open in new window"
				.bind('beforeshow', function(e, d) {
					
					
					if(d.state == 'Saved' || d.state == 'Running') {
						$('#vboxDetailsViewSavedSS')
							.css('display','')
							.data({'vmid':d.id});
					} else {
						$('#vboxDetailsViewSavedSS').css('display', 'none');
					}
				});
						

			// Menu item to disable update
			$('<li />')
				.hover(function(){$(this).addClass('hover');},function(){$(this).removeClass('hover');})
				.append(

					$('<label />').append(

						$('<input />')
							.attr({'class':'vboxRadio','type':'radio','name':'vboxPreviewRadio','value':0})
							.click(function(){vboxSetCookie("vboxPreviewUpdate","0");})
							.prop('checked', $('#vboxIndex').data('vboxCookies')["vboxPreviewUpdate"] == 0)
						
					).append(
							
						$('<span />')
							.html(trans('Update Disabled','UIVMPreviewWindow'))
					)
					
				).appendTo(ul);


			// Update intervals
			var ints = [3,5,10,20,30,60];
			
			// check for update interval
			if($('#vboxIndex').data('vboxConfig').previewUpdateInterval && jQuery.inArray($('#vboxIndex').data('vboxConfig').previewUpdateInterval, ints) < 0) {
				ints[ints.length] = $('#vboxIndex').data('vboxConfig').previewUpdateInterval;
			}
			if($('#vboxIndex').data('vboxCookies')["vboxPreviewUpdate"] && $('#vboxIndex').data('vboxCookies')["vboxPreviewUpdate"] > 0 && jQuery.inArray(parseInt($('#vboxIndex').data('vboxCookies')["vboxPreviewUpdate"]), ints) < 0) {
				ints[ints.length] = $('#vboxIndex').data('vboxCookies')["vboxPreviewUpdate"];
			}
			ints.sort(function(a,b){
				if(a == b) return 0;
				return (a > b ? 1 : -1);
			});

			// Add each interval to menu
			for(var i = 0; i < ints.length; i++) {
				
				var li = $('<li />');
				
				if(i==0) $(li).attr('class','separator');

				var radio = $('<input />').attr({'class':'vboxRadio','type':'radio','name':'vboxPreviewRadio','value':ints[i]}).click(function(){
					vboxSetCookie("vboxPreviewUpdate",$(this).val());		
				}).prop('checked', $('#vboxIndex').data('vboxCookies')["vboxPreviewUpdate"] == ints[i]);
				
				$('<label />')
					.append(radio)
					.append(
						$('<span />')
							.html(trans('Every %1 seconds','UIVMPreviewWindow').replace('%1',ints[i]))
					)
					.appendTo(li);

				$(ul).append(li);
				
			}

			/* Append "Open in new window" */
			$('<li />')
				.attr({'id':'vboxDetailsViewSavedSS','class':'separator','style':'display:none;text-align: center;'})
				.click(function(){
					window.open('screen.php?vm='+$(this).data('vmid')+'&full=1','vboxSC','toolbar=1,menubar=0,location=0,directories=0,status=true,resize=true');
				}).append(
					$('<span />')
						.html(trans('Open in new window','UIVMPreviewWindow'))
				).appendTo(ul);
			
			/* Hover */
			$(ul).children().hover(
				function(){$(this).addClass('hover');},
				function(){$(this).removeClass('hover');}
			);

						
			$(document).click(function(e){if(e.button!=2)$(ul).hide();});
			
			$('#vboxTabVMDetails').append(ul);
			
			return $('#vboxDetailsPreviewMenu');

		},
		noSnapshot: true,
		multiSelectDetailsTable: true,
		noFooter: true,
		
		/* For preview window fix for webkit based browsers */
		__getBase64Image: function(img) {
		    var canvas = document.createElement("canvas");
		    canvas.width = img.width;
		    canvas.height = img.height;
		    var ctx = canvas.getContext("2d");
		    ctx.drawImage(img, 0, 0);
		    return canvas.toDataURL("image/png");
		},
		
			
		onRender : function(d) {

			if(d.state != 'Running' && d.state != 'Saved')
				return;
		
			vboxVMDetailsSections.preview._drawPreview(d);
			
			if(d.state == 'Running') {
				
				var timer = $('#vboxIndex').data('vboxPreviewTimer-'+d.id);
				if(timer) window.clearInterval(timer);
				
				$('#vboxIndex').data('vboxPreviewTimer-'+d.id,window.setInterval(function(){
					
					// Does the target still exist?
					if(!$('#vboxDetailsGeneralTable-'+d.id)[0]) {
						var timer = $('#vboxIndex').data('vboxPreviewTimer-'+d.id);
						if(timer) window.clearInterval(timer);
						return;
					}
					vboxVMDetailsSections.preview._drawPreview(d);
					
				},$('#vboxIndex').data('vboxCookies')["vboxPreviewUpdate"] * 1000));

			}
		},
		
		_drawPreview: function(d) {
			
			
			var width = $('#vboxIndex').data('vboxConfig')['previewWidth'];
			
			var __vboxDrawPreviewImg = new Image();			
			__vboxDrawPreviewImg.onload = function() {

				var height = 0;
				var baseStr = 'vboxDetailsGeneralTable-'+d.id;
				
				// Error or machine not running
				if(this.height <= 1) {

					$('#'+baseStr+' img.vboxDetailsPreviewImg').css({'display':'none'}).attr('src','images/vbox/blank.gif');
					$('#'+baseStr+' div.vboxDetailsPreviewVMName').css('display','');
					
					width = $('#vboxIndex').data('vboxConfig')['previewWidth'];
					height = width / $('#vboxIndex').data('vboxConfig')['previewAspectRatio'];
					
					// Clear interval if set
					var timer = $('#vboxIndex').data('vboxPreviewTimer-'+d.id);
					if(timer) window.clearInterval(timer);

					
										
				} else {

					// Calculate height based on width
					width = $('#vboxIndex').data('vboxConfig')['previewWidth'];
					factor = width / this.width;
					if(!factor) factor = 1;
					height = this.height * factor;
					
					$('#'+baseStr+' div.vboxDetailsPreviewVMName').css('display','none');
					$('#'+baseStr+' img.vboxDetailsPreviewImg').css({'display':'','height':height+'px','width':width+'px'});
					
					// IE uses filter
					if($.browser.msie) {
						
						if(d.state == 'Running') {
							
							// Setting background URL keeps image from being requested again, but does not allow us to set
							// the size of the image. This is fine, since the image is returned in the size requested.
							$('#'+baseStr+' img.vboxDetailsPreviewImg').css({"filter":""}).parent().css({'background':'url('+this.src+')'});
						
						} else {
							
							// This causes the image to be requested again, but is the only way to size the background image.
							// Saved preview images are not returned in the size requested and must be resized at runtime by
							// the browser.
							$('#'+baseStr+' img.vboxDetailsPreviewImg').css({"filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true', src='"+this.src+"', sizingMethod='scale')"}).parent().css({'background':'#000'});
						}
						
					// Webkit based browsers will re-download the image if we just set the image source
					} else if($.browser.webkit) {
						
						$('#'+baseStr+' img.vboxDetailsPreviewImg').css({'background-image':'url('+vboxVMDetailsSections.preview.__getBase64Image(this)+')'});
					
					} else {

						$('#'+baseStr+' img.vboxDetailsPreviewImg').css({'background-image':'url('+this.src+')','background-size':(width+1) +'px ' + (height+1)+'px'});
						
					}
					
				}
				$('#'+baseStr+' div.vboxDetailsPreviewWrap').css({'height':height+'px','width':width+'px'});
				$('#'+baseStr+' img.vboxPreviewMonitor').css('width',width+'px');
				$('#'+baseStr+' img.vboxPreviewMonitorSide').css('height',height+'px');
			};

			// Update disabled? State not Running or Saved
			if($('#vboxIndex').data('vboxCookies')["vboxPreviewUpdate"] == 0 || (d.state != 'Running' && d.state != 'Saved')) {
				__vboxDrawPreviewImg.height = 0;
				__vboxDrawPreviewImg.onload();
			} else {
				// Running VMs get random numbers. Saved are based on last state change.
				// Try to let the browser cache Saved screen shots
				var randid = d.lastStateChange;
				if(d.state == 'Running') {
					var currentTime = new Date();
					randid = Math.floor(currentTime.getTime() / 1000);
				}
				__vboxDrawPreviewImg.src = 'screen.php?width='+(width)+'&vm='+d.id+'&randid='+randid;
				
			}
			


		},
		rows: function(d) {

			var width = $('#vboxIndex').data('vboxConfig')['previewWidth'];
			if(!width) width = $('#vboxIndex').data('vboxConfig')['previewWidth'] = 180;

			var height = width / $('#vboxIndex').data('vboxConfig')['previewAspectRatio'];

			var divOut1 = "<div class='vboxDetailsPreviewVMName' style='overflow:hidden;position:relative;height:"+height+"px;width:"+width+"px' >" +
				"<div style='position:relative;left:0px;display:table-cell;vertical-align:middle;padding:4px;color:#fff;font-weight:bold;text-align:center;height:"+height+"px;width:"+width+"px;" +
				($.browser.msie ? "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=\"true\", src=\"images/monitor_glossy.png\", sizingMethod=\"scale\")" : "" +
					"background:url(images/monitor_glossy.png) top left no-repeat;-moz-background-size:100% 100%;background-size:"+(width+1) +"px " + (height+1)+"px;-webkit-background-size:100% 100%") +
				"'>"+$('<div />').html(d.name).text()+"</div>"+
				"</div>";

			return [
			        {
			        	data : "<tr style='vertical-align: middle'>"+
							"<td style='text-align: center' colspan='2'>"+
								"<table class='vboxInvisible vboxPreviewTable' style='margin-left:auto;margin-right:auto;'>"+
									"<tr style='vertical-align:bottom; padding:0px; margin:0px;'>"+
										"<td class='vboxInvisible' style='text-align:right'><img src='images/monitor_tl.png' style='width:15px;height:17px;'/></td>"+
										"<td class='vboxInvisible'><img src='images/monitor_top.png' class='vboxPreviewMonitor' style='height:17px;width:"+width+"px'/></td>"+
										"<td class='vboxInvisible' style='text-align:left'><img src='images/monitor_tr.png' style='width:15px;height:17px;'/></td>"+
									"</tr>"+
									"<tr>"+
										"<td class='vboxInvisible' style='text-align:right'><img src='images/monitor_left.png' style='width:15px;height:"+height+"px' class='vboxPreviewMonitorSide' /></td>"+
										"<td class='vboxInvisible'><div class='vboxDetailsPreviewWrap "+ (d.state == 'Saved' ? 'vboxPreviewSaved' : '') +"' style='width: "+width+"px; height:"+height+"px; text-align:center;background-color:#000;border:0px;display:table;#position:relative;background-repeat: no-repeat;padding:0px;margin:0px;'>"+
											"<img class='vboxDetailsPreviewImg' src='images/monitor_glossy.png' vspace='0px' hspace='0px' "+
											"style='display:none;top:0px;margin:0px;border:0px;padding;0px;"+
											"background-position:top left;background-repeat:no-repeat;"+
											"-moz-background-size:100% 100%;background-size:100% 100%;-webkit-background-size:100% 100%;background-spacing:0px 0px;"+
											"position:relative;height:"+height+"px;width:"+width+"px;float:left' />"+
											divOut1+
										"</div></td>"+
										"<td class='vboxInvisible' style='text-align:left' ><img src='images/monitor_right.png' style='width:14px;height:"+height+"px' class='vboxPreviewMonitorSide' /></td>"+
									"</tr>"+
									"<tr style='vertical-align:top;'>"+
										"<td class='vboxInvisible' style='text-align:right'><img src='images/monitor_bl.png' style='width:15px;height:17px;'/></td>"+
										"<td class='vboxInvisible'><img src='images/monitor_bottom.png' class='vboxPreviewMonitor' style='height:17px;width:"+width+"px'/></td>"+
										"<td class='vboxInvisible' style='text-align:left'><img src='images/monitor_br.png' style='width:15px;height:17px;'/></td>"+
									"</tr>"+
								"</table>"+													
							"</td>"+
						"</tr>",
						rawRow: true
			        }
				];
		}
	},
	
	/*
	 * Display
	 */
	display : {
		icon: 'vrdp_16px.png',
		title:'Display',
		settingsLink: 'Display',
		rows: [
		   {
			   title: "Video Memory",
			   callback: function(d) {
				   return trans('<nobr>%1 MB</nobr>').replace('%1',d['VRAMSize']);
			   }
		   },{
			   title: 'Remote Desktop Server Port',
			   callback: function(d) {
				   
				   var chost = vboxGetVRDEAddress(d);
				
				   var rowStr = d['VRDEServer']['ports'];
				
				   // Display links?
				   if(!d._isSnapshot && (d['state'] == 'Running' || !d['VRDEServer']['ports'].match(/[^\d]/))) {
					   rowStr = " <a href='rdp.php?host=" + chost + '&port=' + d['VRDEServer']['ports'] + "&id=" + d['id'] + "&vm=" + encodeURIComponent(d['name']) + "'>" + d['VRDEServer']['ports'] + "</a>";
				   }
				   if(!d._isSnapshot && d['state'] == 'Running' && d['consoleInfo'] && parseInt(d['consoleInfo']['consolePort']) > 0) {
					   rowStr += ' <img src="images/vbox/blank.gif" style="vspace:0px;hspace:0px;height2px;width:10px;" /> (' + chost + ':' + d['consoleInfo']['consolePort'] + ')';
				   } else if(!d._isSnapshot){
					   rowStr += ' ('+chost+')';
				   }
				   return rowStr;
				   
  
			   },
			   html: true,
			   condition: function(d) {
				   return (d['VRDEServer'] && (d._isSnapshot || d['VRDEServer']['VRDEExtPack']) && d['VRDEServer']['enabled'] && d['VRDEServer']['ports']);
			   }
		   },{
			   title: "Remote Desktop Server",
			   callback: function(d) {
				   return trans('Disabled','VBoxGlobal',null,'details report (VRDE Server)');
			   },
			   condition: function(d) {
				   return !(d['VRDEServer'] && (d._isSnapshot || d['VRDEServer']['VRDEExtPack']) && d['VRDEServer']['enabled'] && d['VRDEServer']['ports']);
			   }
		   }
		]
	},
	
	/*
	 * Storage controllers
	 */
	storage : {
		icon:'hd_16px.png',
		title: 'Storage',
		settingsLink: 'Storage',
		rows: function(d) {
			
			var advancedView = $('#vboxIndex').data('vboxConfig').enableAdvancedConfig;
			
			var rows = new Array();
			
			for(var a = 0; a < d['storageControllers'].length; a++) {
				
				var con = d['storageControllers'][a];
				
				// Controller name
				rows[rows.length] = {
						title: $('<div />').text(con.name).html() + ((con.bus == 'SATA' && advancedView) ? ' (' + con.portCount + ')' : ''),
						callback: function(){return'';}
				};
						
				// Each attachment.
				for(var b = 0; b < d['storageControllers'][a]['mediumAttachments'].length; b++) {
					
					var portName = vboxStorage[d['storageControllers'][a].bus].slotName(d['storageControllers'][a]['mediumAttachments'][b].port, d['storageControllers'][a]['mediumAttachments'][b].device);

					// Medium / host device info
					var medium = (d['storageControllers'][a]['mediumAttachments'][b].medium && d['storageControllers'][a]['mediumAttachments'][b].medium.id ? vboxMedia.getMediumById(d['storageControllers'][a]['mediumAttachments'][b].medium.id) : null);
					
					// Do we need to reload media?
					if(d['storageControllers'][a]['mediumAttachments'][b].medium && d['storageControllers'][a]['mediumAttachments'][b].medium.id && medium === null) {
						
						portDesc = trans('Refresh','VBoxSelectorWnd');

					} else {
						
						// Get base medium (snapshot -> virtual disk file)
						var it = false;
						if(medium && medium.base && (medium.base != medium.id)) {
							it = true;
							medium = vboxMedia.getMediumById(medium.base);
						}

						portDesc = vboxMedia.mediumPrint(medium,false,it);
					}

					rows[rows.length] = {
						title: portName + (d['storageControllers'][a]['mediumAttachments'][b].type == 'DVD' ? ' ' + trans('[CD/DVD]') : ''),
						indented: true,
						data: portDesc,
						html: true
					};
					
				}
				
			}
			$('#vboxTabVMDetails').data('vboxMediaReload', 0);
			return rows;
		}
	},
	
	/*
	 * Audio
	 */
	audio : {
		icon:'sound_16px.png',
		title:'Audio',
		settingsLink: 'Audio',
		rows: [
		    {
			    title: '<span class="vboxDetailsNone">'+trans("Disabled",'VBoxGlobal',null,'details report (audio)')+'</span>',
			    html: true,
			    condition: function(d) { return !d['audioAdapter']['enabled']; },
			    data: ''
		    },{
		    	title: "Host Driver",
		    	callback: function(d) {
		    		return trans(vboxAudioDriver(d['audioAdapter']['audioDriver']),'VBoxGlobal');
		    	},
		    	condition: function(d) { return d['audioAdapter']['enabled']; }
		    },{
		    	title: "Controller",
		    	callback: function (d) {
		    		return trans(vboxAudioController(d['audioAdapter']['audioController']),'VBoxGlobal');
		    	},
		    	condition: function(d) { return d['audioAdapter']['enabled']; }
		    }
		]
	},
	
	/*
	 * Network adapters
	 */
	network : {
		icon: 'nw_16px.png',
		title: 'Network',
		settingsLink: 'Network',
		rows: function(d) {
			
			var vboxDetailsTableNics = 0;
			var rows = [];
			
			for(var i = 0; i < d['networkAdapters'].length; i++) {
				
				nic = d['networkAdapters'][i];
				
				// compose extra info
				var adp = '';

				if(nic.enabled) {
					vboxDetailsTableNics++;
					switch(nic.attachmentType) {
						case 'Null':
							adp = trans('Not attached','VBoxGlobal');
							break;
						case 'Bridged':
							adp = trans('Bridged adapter, %1','VBoxGlobal').replace('%1', nic.bridgedInterface);
							break;
						case 'HostOnly':
							adp = trans('Host-only adapter, \'%1\'','VBoxGlobal').replace('%1', nic.hostOnlyInterface);
							break;
						case 'NAT':
							// 'NATNetwork' ?
							adp = trans('NAT','VBoxGlobal');
							break;
						case 'Internal':
							adp = trans('Internal network, \'%1\'','VBoxGlobal').replace('%1', $('<div />').text(nic.internalNetwork).html());
							break;
						case 'Generic':
							// Check for properties
							if(nic.properties) {
								adp = trans('Generic driver, \'%1\' { %2 }','UIDetailsPagePrivate').replace('%1', $('<div />').text(nic.genericDriver).html());
								var np = nic.properties.split("\n");
								adp = adp.replace('%2', np.join(" ,"));
								break;
							}
							adp = trans('Generic driver, \'%1\'','UIDetailsPagePrivate').replace('%1', $('<div />').text(nic.genericDriver).html());
							break;					
						case 'VDE':
							adp = trans('VDE network, \'%1\'','VBoxGlobal').replace('%1', $('<div />').text(nic.VDENetwork).html());
							break;
					}

					rows[rows.length] = {
						title: trans("Adapter %1",'VBoxGlobal').replace('%1',(i + 1)),
						data: trans(vboxNetworkAdapterType(nic.adapterType)).replace(/\(.*\)/,'') + ' (' + adp + ')'
					};
				}
						
			}
			
			// No enabled nics
			if(vboxDetailsTableNics == 0) {
				
				rows[rows.length] = {
					title: '<span class="vboxDetailsNone">'+trans('Disabled','VBoxGlobal',null,'details report (network)')+'</span>',
					html: true
				};
				
			// Link nic to guest networking info?
			} else if(d['state'] == 'Running') {
				
				rows[rows.length] = {
					title: '',
					data: '<a href="javascript:vboxGuestNetworkAdaptersDialogInit(\''+d['id']+'\')">('+trans('Guest Network Adapters','VBoxGlobal')+')</a>',
					html: true
				};
				
			}
			
			return rows;

		}
	},
	
	/*
	 * Serial Ports
	 */
	serialports : {
		icon: 'serial_port_16px.png',
		title: 'Serial Ports',
		settingsLink: 'SerialPorts',
		rows: function(d) {
			
			var rows = [];
			
			var vboxDetailsTableSPorts = 0;
			for(var i = 0; i < d['serialPorts'].length; i++) {
				
				p = d['serialPorts'][i];
				
				if(!p.enabled) continue;
				
				// compose extra info
				var xtra = vboxSerialPorts.getPortName(p.IRQ,p.IOBase);
				
				var mode = p.hostMode;
				xtra += ', ' + trans(vboxSerialMode(mode),'VBoxGlobal');
				if(mode != 'Disconnected') {
					xtra += ' (' + $('<div />').text(p.path).html() + ')';
				}
				
				rows[rows.length] = {
					title: trans("Port %1",'VBoxGlobal',null,'details report (serial ports)').replace('%1',(i + 1)),
					data: xtra,
					html: true
				};
				
				vboxDetailsTableSPorts++;
						
			}
			
			if(vboxDetailsTableSPorts == 0) {
				rows[rows.length] = {
					title: '<span class="vboxDetailsNone">'+trans('Disabled','VBoxGlobal',null,'details report (serial ports)')+'</span>',
					data: '',
					html: true
				};
			}
			
			return rows;
		
		}
	},
	
	/*
	 * Parallel ports
	 */
	parallelports: {
		icon: 'parallel_port_16px.png',
		title: 'Parallel Ports',
		settingsLink: 'ParallelPorts',
		condition: function() { return $('#vboxIndex').data('vboxConfig').enableLPTConfig; },
		rows: function(d) {
			
			var rows = [];
			
			var vboxDetailsTableSPorts = 0;
			for(var i = 0; i < d['parallelPorts'].length; i++) {
				
				p = d['parallelPorts'][i];
				
				if(!p.enabled) continue;
				
				// compose extra info
				var xtra = trans(vboxParallelPorts.getPortName(p.IRQ,p.IOBase));
				xtra += ' (' + $('<div />').text(p.path).html() + ')';
				
				rows[rows.length] = {
					title: trans("Port %1",'VBoxGlobal',null,'details report (parallel ports)').replace('%1',(i + 1)),
					data: xtra
				};
				vboxDetailsTableSPorts++;
						
			}
			
			if(vboxDetailsTableSPorts == 0) {
				rows[0] = {
					title: '<span class="vboxDetailsNone">'+trans('Disabled','VBoxGlobal',null,'details report (parallel ports)')+'</span>',
					html: true
				};
			}
			return rows;
			
		}
	},
	
	/*
	 * USB
	 */
	usb : {
		icon: 'usb_16px.png',
		title: 'USB',
		settingsLink: 'USB',
		rows: function(d) {
			
			var rows = [];
			
			if(d['USBController'] && d['USBController']['enabled']) {
				var tot = 0;
				var act = 0;
				for(var i = 0; i < d['USBController'].deviceFilters.length; i++) {
					tot++;
					if(d['USBController'].deviceFilters[i].active) act++;
				}
				
				rows[0] = {
					title: trans("Device Filters"),
					data: trans('%1 (%2 active)').replace('%1',tot).replace('%2',act)
				};
				
			} else {
				
				rows[0] = {
					title: '<span class="vboxDetailsNone">'+trans("Disabled",null,null,'details report (USB)')+'</span>',
					html: true
				};
			}
			
			return rows;

		}
	},
	
	/*
	 * Shared folders list
	 */
	sharedfolders : {
		icon: 'shared_folder_16px.png',
		title: 'Shared Folders',
		translationComment : 'details report (shared folders)',
		settingsLink: 'SharedFolders',
		rows: function(d) {

			if(!d['sharedFolders'] || d['sharedFolders'].length < 1) {
				return [{
					title: '<span class="vboxDetailsNone">'+trans('None',null,null,'details report (shared folders)')+'</span>',
					html: true
				}];
			} else {
				return [{
					title: trans('Shared Folders'),
					data: d['sharedFolders'].length
				}];
			}

		}
	},
	
	/*
	 * VM Description
	 */
	description: {
		icon: 'description_16px.png',
		title: 'Description',
		settingsLink: 'General:2',
		rows : function(d) {
			return [{
				title: '',
				data: $('<tr />').attr({'class':'vboxDetailRow'}).append(
						$('<td />').attr({'class':'vboxDetailDescriptionCell','colspan':'2'})
							.html(d.description.length ? $('<div />').html(d.description).text() : '<span class="vboxDetailsNone">'+trans("None",null,null,'details report (description)')+'</span>')
				),
				rawRow: true
			}];
		}
	}
};

/**
 * Common VM Group Actions
 * @namespace vboxVMGroupActions
 */
var vboxVMGroupActions = {

	'newmachine': {
		label: 'New  Machine...',
		icon: 'new',
		click: function(){
			vboxVMActions['new'].click();
		}
	},
	
	addmachine: {
		label: 'Add Machine...',
		icon: 'vm_add',
		click: function() {
			vboxVMActions['add'].click();
		}
	},
	
	rename: {
		label: 'Rename Group...',
		icon: 'name',
		click: function(el) {
			$('#vboxIndex').data('vboxChooser').renameSelectedGroup();
		}
	},
	
	ungroup: {
		label: 'Ungroup...',
		icon: 'delete',
		click: function(el) {
			
			$('#vboxIndex').data('vboxChooser').unGroupSelectedGroup();
			
		}
	},
	
	'sort': {
		label: 'Sort',
		click: function() {
			
			$('#vboxIndex').data('vboxChooser').sortSelectedGroup();
			
		}
	}
	
};

/**
 * Common VM Actions - These assume that they will be run on the
 * selected VM as stored in $('#vboxIndex').data('vboxChooser').getSingleSelected()
 * @namespace vboxVMActions
 */
var vboxVMActions = {
		
	/** Invoke the new virtual machine wizard */
	'new':{
			label:'New...',
			toolbar_label:'New',
			icon:'vm_new',
			icon_16:'new',
			click: function(){vboxWizardNewVMInit(function(){return;});}
	},
	
	/** Add a virtual machine via its settings file */
	add: {
		label:'Add...',
		icon:'vm_add',
		click:function(){
			vboxFileBrowser($('#vboxIndex').data('vboxSystemProperties').defaultMachineFolder,function(f){
				if(!f) return;
				var l = new vboxLoader();
				l.add('machineAdd',function(){},{'file':f});
				l.onLoad = function(){
					var lm = new vboxLoader();
					lm.add('vboxGetMedia',function(d){$('#vboxIndex').data('vboxMedia',d);});
					lm.onLoad = function() {$('#vboxIndex').trigger('vmlistreload');};
					lm.run();
				};
				l.run();
				
			},false,trans('Add an existing virtual machine','VBoxSelectorWnd'),'images/vbox/machine_16px.png',true);
		}
	},

	/** Start VM */
	start: {
		name : 'start',
		label : 'Start',
		icon : 'vm_start',
		icon_16 : 'start',
		context : 'VBoxSelectorWnd',
		selectionModels : ['singleVM'],
		click : function (btn) {
		
			// Disable toolbar button that triggered this action?
			if(btn && btn.toolbar) btn.toolbar.disableButton(btn);
			
			var vm = $('#vboxIndex').data('vboxChooser').getSingleSelected();
			
			var startVM = function () {
				
				
				vboxAjaxRequest('machineSetState',{'vm':vm.id,'state':'powerUp'},function(d){
					// check for progress operation
					if(d && d.progress) {
						var icon = null;
						if(vm.state == 'Saved') icon = 'progress_state_restore_90px.png';
						else icon = 'progress_start_90px.png';
						vboxProgress(d.progress,function(){$('#vboxIndex').trigger('vmlistrefresh');},{},icon);
						return;
					}
					$('#vboxIndex').trigger('vmlistrefresh');
				});
			};
			
			// Check for memory limit
			// Paused VMs are already using all their memory
			if($('#vboxIndex').data('vboxConfig').vmMemoryStartLimitWarn && vm.state != 'Paused') {
				
				var freeMem = 0;
				var baseMem = 0;
				
				var l = new vboxLoader();
				l.add('hostGetMeminfo',function(d){freeMem = d.memoryAvailable;});
				l.add('machineGetDetails',function(d){baseMem = d.memorySize + d.VRAMSize;},{'vm':vm.id});
				l.onLoad = function() {
					if($('#vboxIndex').data('vboxConfig').vmMemoryOffset) freeMem -= $('#vboxIndex').data('vboxConfig').vmMemoryOffset;
					// A little bit of overhead
					baseMem += 50;
					if(baseMem >= freeMem) {
						var buttons = {};
						buttons[trans('Yes','QIMessageBox')] = function(){
							$(this).remove();
							startVM();
						};
						freeMem = Math.max(0,freeMem);
						vboxConfirm('<p>The selected virtual machine (<b>'+vm.name+'</b>) requires <b><i>approximately</b></i> ' + baseMem +'MB of memory, but your VirtualBox host only has ' + freeMem + 'MB '+($('#vboxIndex').data('vboxConfig').vmMemoryOffset ? ' (-'+$('#vboxIndex').data('vboxConfig').vmMemoryOffset+'MB)': '') + ' free.</p><p>Are you sure you want to start the virtual machine?</p>',buttons,trans('No','QIMessageBox'));
					} else {
						startVM();
					}
				};
				l.run();
				
			} else {
				startVM();
			}
			
			
		},
		enabled : function (chooser) { 
			if(!chooser || chooser.selectionModel != 'singleVM') return false;
			return (jQuery.inArray(chooser.getSingleSelected().state,['PoweredOff','Paused','Saved','Aborted','Teleported']) > -1);
		}	
	},
	
	/** Invoke VM settings dialog */
	settings: {
		label:'Settings...',
		toolbar_label:'Settings',
		icon:'vm_settings',
		icon_16:'settings',
		selectionModels : ['singleVM'],
		click:function(){
			
			var vm = $('#vboxIndex').data('vboxChooser').getSingleSelected();
						
			vboxVMsettingsInit(vm.id);
		},
		enabled : function (chooser) {
			return (chooser && chooser.selectionModel == 'singleVM' && jQuery.inArray(chooser.getSingleSelected().state,['PoweredOff','Aborted','Teleported','Running']) > -1);
		}
	},

	/** Clone a VM */
	clone: {
		label:'Clone...',
		icon:'vm_clone',
		icon_16:'vm_clone',
		icon_disabled:'vm_clone_disabled',
		selectionModels : ['singleVM'],
		click:function(){vboxWizardCloneVMInit(function(){return;},{vm:$('#vboxIndex').data('vboxChooser').getSingleSelected()});},
		enabled: function (chooser) {
			if(!chooser || chooser.selectionModel != 'singleVM') return false;
			return (jQuery.inArray(chooser.getSingleSelected().state,['PoweredOff','Aborted','Teleported','Saved']) > -1);
		}
	},

	
	/** Refresh a VM's details */
	refresh: {
		label:'Refresh',
		icon:'refresh',
		icon_disabled:'refresh_disabled',
		selectionModels : ['singleVM'],
		click:function(){
			
			var vm = $('#vboxIndex').data('vboxChooser').getSingleSelected();
			
			var l = new vboxLoader();
			l.add('machineGetDetails',function(d){
				// Special case for host refresh
				if(d.id == 'host') {
					$('#vboxIndex').data('vboxHostDetails',d);
				}
				$('#vboxIndex').trigger('vmChanged',[vm.id]);
			},{'vm':vm.id,'force_refresh':1});
			
			// Host refresh also refreshes system properties, VM sort order
			if(vm.id == 'host') {
				l.add('vboxSystemPropertiesGet',function(d){$('#vboxIndex').data('vboxSystemProperties',d);},{'force_refresh':1});
				l.add('hostOnlyInterfacesGet',function(d){return;},{'force_refresh':1});
			}
			l.run();
    	},
		enabled: function(chooser){
			if(!chooser || chooser.selectionModel != 'singleVM') return false;
			return (chooser.getSingleSelected().id != 'host');
		}
    },
    
    /** Delete / Remove a VM */
    remove: {
		label:'Remove',
		icon:'delete',
		selectionModels : ['singleVM'],
		click:function(){

			var vm = $('#vboxIndex').data('vboxChooser').getSingleSelected();
			
			var buttons = {};
			buttons[trans('Delete all files','UIMessageCenter')] = function(){
				$(this).empty().remove();
				var l = new vboxLoader();
				l.add('machineRemove',function(d){
					// check for progress operation
					if(d && d.progress) {
						vboxProgress(d.progress,function(){$('#vboxIndex').trigger('vmlistreload');},{},'progress_delete_90px.png');
					} else {
						$('#vboxIndex').trigger('vmlistreload');
					}					
				},{'vm':vm.id,'delete':1});
				l.run();
			};
			buttons[trans('Remove only','UIMessageCenter')] = function(){
				$(this).empty().remove();
				var l = new vboxLoader();
				l.add('machineRemove',function(d){
					// check for progress operation
					if(d && d.progress) {
						vboxProgress(d.progress,function(){$('#vboxIndex').trigger('vmlistreload');},{},'progress_delete_90px.png');
					} else {
						$('#vboxIndex').trigger('vmlistreload');
					}					
				},{'vm':vm.id,'keep':1});
				l.run();
				
			};
			var q = trans('<p>You are about to remove following virtual machines from the machine list:</p><p>%1</p><p>Would you like to delete the files containing the virtual machine from your hard disk as well? Doing this will also remove the files containing the machine\'s virtual hard disks if they are not in use by another machine.</p>','UIMessageCenter').replace('%1',vm.name);
				
			vboxConfirm(q,buttons);
			
    	
    	},
    	enabled: function (chooser) {
    		if(!chooser || chooser.selectionModel != 'singleVM') return false;
    		return (jQuery.inArray(chooser.getSingleSelected().state,['PoweredOff','Aborted','Teleported','Inaccessible','Saved']) > -1);
    	}
    },
    
    /** Create a group from VM **/
    group: {
    	label: 'Group',
    	icon: 'add_shared_folder',
    	icon_disabled: 'add_shared_folder_disabled',
    	selectionModels : ['multiVM','singleVM'],
    	click: function() {
    		$('#vboxIndex').data('vboxChooser').groupSelectedItems();
    	},
    	enabled: function(chooser) {
    		return (chooser && !(chooser.selectionModel=='singleVM' && chooser.getSingleSelected().id == 'host'));
    	}
    },
    
    /** Discard VM State */
    discard: {
		label:'Discard saved state',
		icon:'vm_discard',
		icon_16:'discard',
		selectionModels : ['singleVM'],
		click:function(){
			
			var vm = $('#vboxIndex').data('vboxChooser').getSingleSelected();
			
			var buttons = {};
			buttons[trans('Discard','UIMessageCenter')] = function(){
				$(this).empty().remove();
				var l = new vboxLoader();
				l.add('machineSetState',function(){},{'vm':vm.id,'state':'discardSavedState'});
				l.onLoad = function(){$('#vboxIndex').trigger('vmlistrefresh');};
				l.run();
			};
			vboxConfirm(trans('<p>Are you sure you want to discard the saved state of the following virtual machines?</p><p><b>%1</b></p><p>This operation is equivalent to resetting or powering off the machine without doing a proper shutdown of the guest OS.</p>','UIMessageCenter').replace('%1',vm.name),buttons);
		},
		enabled:function(chooser){
    		return (chooser && chooser.selectionModel== 'singleVM' && chooser.getSingleSelected().state== 'Saved');
		}
    },
    
    /** Show VM Logs */
    logs: {
		label:'Show Log...',
		icon:'show_logs',
		icon_disabled:'show_logs_disabled',
		selectionModels : ['singleVM'],
		click:function(){
    		vboxShowLogsDialogInit($('#vboxIndex').data('vboxChooser').getSingleSelected());
		},
		enabled:function(chooser){
			return (chooser && chooser.selectionModel== 'singleVM' && chooser.getSingleSelected().id != 'host');
		}
    },

    /** Save the current VM State */
	savestate: {
		label: 'Save the machine state',
		icon: 'fd',
		context: 'UIVMCloseDialog',
		selectionModels : ['singleVM'],
		stop_action: true,
		enabled: function(chooser){
			return (chooser && chooser.selectionModel== 'singleVM' && chooser.getSingleSelected().state== 'Running');
		},
		click: function() {vboxVMActions.powerAction('savestate');}
	},

	/** Send ACPI Power Button to VM */
	powerbutton: {
		label: 'ACPI Shutdown',
		icon: 'acpi',
		stop_action: true,
		selectionModels : ['singleVM'],
		enabled: function(chooser){
			return (chooser && chooser.selectionModel== 'singleVM' && chooser.getSingleSelected().state== 'Running');
		},
		click: function() {
			var buttons = {};
			buttons[trans('ACPI Shutdown','UIMessageCenter')] = function() {
				vboxVMActions.powerAction('powerbutton');				
			};
			vboxConfirm(trans("<p>Do you really want to send an ACPI shutdown signal " +
					"to the following virtual machines?</p><p><b>%1</b></p>",'UIMessageCenter').replace('%1', $('#vboxIndex').data('vboxChooser').getSingleSelected().name),buttons);
		}
	},
	
	/** Pause a running VM */
	pause: {
		label: 'Pause',
		icon: 'pause',
		icon_disabled: 'pause_disabled',
		selectionModels : ['singleVM'],
		enabled: function(chooser){
			return (chooser && chooser.selectionModel== 'singleVM' && chooser.getSingleSelected().state== 'Running');
		},
		click: function() {vboxVMActions.powerAction('pause'); }
	},
	
	/** Power off  a VM */
	powerdown: {
		label: 'Power Off',
		icon: 'poweroff',
		stop_action: true,
		context: 'UIMessageCenter',
		selectionModels : ['singleVM'],
		enabled: function(chooser) {
			return (chooser && chooser.selectionModel== 'singleVM' && jQuery.inArray(chooser.getSingleSelected().state,['Running','Paused','Stuck']) > -1);
		},
		click: function() {
			var buttons = {};
			buttons[trans('Power Off','UIMessageCenter')] = function() {
				$(this).empty().remove();
				vboxVMActions.powerAction('powerdown');
			};
			vboxConfirm(trans("<p>Do you really want to power off the following virtual machines?</p>" +
	           "<p><b>%1</b></p><p>This will cause any unsaved data in applications " +
	           "running inside it to be lost.</p>", 'UIMessageCenter').replace('%1', $('#vboxIndex').data('vboxChooser').getSingleSelected().name), buttons);
		}
	},
	
	/** Reset a VM */
	reset: {
		label: 'Reset',
		icon: 'reset',
		icon_disabled: 'reset_disabled',
		selectionModels : ['singleVM'],
		enabled: function(chooser){
			return (chooser && chooser.selectionModel== 'singleVM' && chooser.getSingleSelected().state== 'Running');
		},
		click: function() {
			var buttons = {};
			buttons[trans('Reset','UIMessageCenter')] = function() {
				$(this).remove();
				vboxVMActions.powerAction('reset');
			};
			vboxConfirm(trans("<p>Do you really want to reset the following virtual machines?</p><p><b>%1</b></p><p>This will cause any unsaved data in applications running inside it to be lost.</p>",'UIMessageCenter').replace('%1',$('#vboxIndex').data('vboxChooser').getSingleSelected().name),buttons);
		}
	},
	
	/** Stop actions list*/
	stop_actions: ['savestate','powerbutton','powerdown'],

	/** Stop a VM */
	stop: {
		name: 'stop',
		label: 'Close',
		icon: 'exit',
		menu: true,
		selectionModels : ['singleVM'],
		click: function () { return true; /* handled by stop context menu */ },
		enabled: function (chooser) {
			return (chooser && chooser.selectionModel== 'singleVM' && jQuery.inArray(chooser.getSingleSelected().state,['Running','Paused','Stuck']) > -1);
		}
	},
	
	/** Power Action Helper function */
	powerAction: function(pa){
		icon =null;
		switch(pa) {
			case 'powerdown': fn = 'powerDown'; icon='progress_poweroff_90px.png'; break;
			case 'powerbutton': fn = 'powerButton'; break;
			case 'sleep': fn = 'sleepButton'; break;
			case 'savestate': fn = 'saveState'; icon='progress_state_save_90px.png'; break;
			case 'pause': fn = 'pause'; break;
			case 'reset': fn = 'reset'; break;
			default: return;
		}
		var vm = $('#vboxIndex').data('vboxChooser').getSingleSelected();
		vboxAjaxRequest('machineSetState',{'vm':vm.id,'state':fn},function(d){
			// check for progress operation
			if(d && d.progress) {
				vboxProgress(d.progress,function(){
					if(pa != 'reset' && pa != 'sleep' && pa != 'powerbutton') $('#vboxIndex').trigger('vmlistrefresh');
				},{},icon);
				return;
			}
			if(pa != 'reset' && pa != 'sleep' && pa != 'powerbutton') $('#vboxIndex').trigger('vmlistrefresh');
		});		
		
	}
};


/**
 * Common Media functions object
 * @namespace vboxMedia
 */
var vboxMedia = {

	/**
	 * Return a printable string for medium m
	 * @static
	 */
	mediumPrint : function(m,nosize,usehtml) {
		var name = vboxMedia.getName(m);
		if(nosize || !m || m.hostDrive) return name;
		return name + ' (' + (m.deviceType == 'HardDisk' ? (usehtml ? '<i>' : '') + trans(m.type,'VBoxGlobal') + (usehtml ? '</i>' : '') + ', ' : '') + vboxMbytesConvert(m.logicalSize) + ')';
	},

	/**
	 * Return printable medium name
	 * @static
	 */
	getName : function(m) {
		if(!m) return trans('Empty','VBoxGlobal');
		if(m.hostDrive) {
			if (m.description && m.name) {
				return trans('Host Drive %1 (%2)','VBoxGlobal').replace('%1',m.description).replace('%2',m.name);
			} else if (m.location) {
				return trans('Host Drive \'%1\'','VBoxGlobal').replace('%1',m.location);
			} else {
				return trans('Host Drive','VBoxGlobal');
			}
		}
		return m.name;
	},

	/**
	 * Return printable medium type
	 * @static
	 */
	getType : function(m) {
		if(!m || !m.type) return trans('Normal','VBoxGlobal');
		if(m.type == 'Normal' && m.base && m.base != m.id) return trans('Differencing','VBoxGlobal');
		return trans(m.type,'VBoxGlobal');
	},
	
	/**
	 * Return printable medium format
	 * @static
	 */
	getFormat : function (m) {
		if(!m) return '';
		switch(m.format.toLowerCase()) {
			case 'vdi':
				return trans('VDI (VirtualBox Disk Image)','UINewHDWizard');
			case 'vmdk':
				return trans('VMDK (Virtual Machine Disk)','UINewHDWizard');
			case 'vhd':
				return trans('VHD (Virtual Hard Disk)','UINewHDWizard');
			case 'parallels':
			case 'hdd':
				return trans('HDD (Parallels Hard Disk)','UINewHDWizard');
			case 'qed':
				return trans('QED (QEMU enhanced disk)','UINewHDWizard');
			case 'qcow':
				return trans('QCOW (QEMU Copy-On-Write)','UINewHDWizard');
		}	
		return m.format;
	},
	
	/**
	 * Return printable virtual hard disk variant
	 * @static
	 */
	getHardDiskVariant : function(m) {
		
		var variants = $('#vboxIndex').data('vboxMediumVariants');
		
		
/*			[Standard] => 0
            [VmdkSplit2G] => 1
            [VmdkRawDisk] => 2
            [VmdkStreamOptimized] => 4
            [VmdkESX] => 8
            [Fixed] => 65536
            [Diff] => 131072
            [NoCreateDir] => 1073741824
 */
		
		switch(m.variant) {

			case variants.Standard:
	            return trans("Dynamically allocated storage", "VBoxGlobal");
	        case (variants.Standard | variants.Diff):
	            return trans("Dynamically allocated differencing storage", "VBoxGlobal");
	        case (variants.Standard | variants.Fixed):
	            return trans("Fixed size storage", "VBoxGlobal");
	        case (variants.Standard | variants.VmdkSplit2G):
	            return trans("Dynamically allocated storage split into files of less than 2GB", "VBoxGlobal");
	        case (variants.Standard | variants.VmdkSplit2G | variants.Diff):
	            return trans("Dynamically allocated differencing storage split into files of less than 2GB", "VBoxGlobal");
	        case (variants.Standard | variants.Fixed | variants.VmdkSplit2G):
	            return trans("Fixed size storage split into files of less than 2GB", "VBoxGlobal");
	        case (variants.Standard | variants.VmdkStreamOptimized):
	            return trans("Dynamically allocated compressed storage", "VBoxGlobal");
	        case (variants.Standard | variants.VmdkStreamOptimized | variants.Diff):
	            return trans("Dynamically allocated differencing compressed storage", "VBoxGlobal");
	        case (variants.Standard | variants.Fixed | variants.VmdkESX):
	            return trans("Fixed size ESX storage", "VBoxGlobal");
	        case (variants.Standard | variants.Fixed | variants.VmdkRawDisk):
	            return trans("Fixed size storage on raw disk", "VBoxGlobal");
	        default:
	        	return trans("Dynamically allocated storage", "VBoxGlobal");
	    }

	},

	/**
	 * Return media and drives available for attachment type
	 * @static
	 */
	mediaForAttachmentType : function(t,children) {
	
		var media = new Array();
		
		// DVD Drives
		if(t == 'DVD') { media = media.concat($('#vboxIndex').data('vboxHostDetails').DVDDrives);
		// Floppy Drives
		} else if(t == 'Floppy') { 
			media = media.concat($('#vboxIndex').data('vboxHostDetails').floppyDrives);
		}
		
		// media
		return media.concat(vboxTraverse($('#vboxIndex').data('vboxMedia'),'deviceType',t,true,(children ? 'children' : '')));
	},

	/**
	 * Return a medium by its location
	 * @static
	 */
	getMediumByLocation : function(p) {		
		return vboxTraverse($('#vboxIndex').data('vboxMedia'),'location',p,false,'children');
	},

	/**
	 * Return a medium by its ID
	 * @static
	 */
	getMediumById : function(id) {
		return vboxTraverse($('#vboxIndex').data('vboxMedia').concat($('#vboxIndex').data('vboxHostDetails').DVDDrives.concat($('#vboxIndex').data('vboxHostDetails').floppyDrives)),'id',id,false,'children');
	},

	/**
	 * Return a printable list of machines and snapshots this a medium is attached to
	 * @static
	 */
	attachedTo: function(m,nullOnNone) {
		var s = new Array();
		if(!m.attachedTo || !m.attachedTo.length) return (nullOnNone ? null : '<i>'+trans('Not Attached')+'</i>');
		for(var i = 0; i < m.attachedTo.length; i++) {
			s[s.length] = m.attachedTo[i].machine + (m.attachedTo[i].snapshots.length ? ' (' + m.attachedTo[i].snapshots.join(', ') + ')' : '');
		}
		return s.join(', ');
	},

	/**
	 * Update recent media menu and global recent media list
	 * @static
	 */
	updateRecent : function(m, skipPathAdd) {
		
		// Only valid media that is not a host drive or iSCSI
		if(!m || !m.location || m.hostDrive || m.format == 'iSCSI') return false;
		
	    // Update recent path
		if(!skipPathAdd) {
			vboxAjaxRequest('vboxRecentMediaPathSave',{'type':m.deviceType,'folder':vboxDirname(m.location)},function(){});
			$('#vboxIndex').data('vboxRecentMediaPaths')[m.deviceType] = vboxDirname(m.location);
		}
		
		// Update recent media
		/////////////////////////
		
		// find position (if any) in current list
		var pos = jQuery.inArray(m.location,$('#vboxIndex').data('vboxRecentMedia')[m.deviceType]);		
		
		// Medium is already at first position, return
		if(pos == 0) return false;
		
		// Exists and not in position 0, remove from list
		if(pos > 0) {
			$('#vboxIndex').data('vboxRecentMedia')[m.deviceType].splice(pos,1);
		}
		
		// Add to list
		$('#vboxIndex').data('vboxRecentMedia')[m.deviceType].splice(0,0,m.location);
		
		// Pop() until list only contains 5 items
		while($('#vboxIndex').data('vboxRecentMedia')[m.deviceType].length > 5) {
			$('#vboxIndex').data('vboxRecentMedia')[m.deviceType].pop();
		}

		// Update Recent Media in background
		vboxAjaxRequest('vboxRecentMediaSave',{'type':m.deviceType,'list':$('#vboxIndex').data('vboxRecentMedia')[m.deviceType]},function(){});
		
		return true;

	},
	
	/**
	 * List of actions performed on Media in phpVirtualBox
	 * @static
	 * @namespace
	 */
	actions : {
		
		/**
		 * Choose existing medium file
		 * @static
		 */
		choose : function(path,type,callback) {
		
			if(!path) path = $('#vboxIndex').data('vboxRecentMediaPaths')[type];

			title = null;
			icon = null;
			switch(type) {
				case 'HardDisk':
					title = trans('Choose a virtual hard disk file...','UIMachineSettingsStorage');
					icon = 'images/vbox/hd_16px.png';
					break;
				case 'Floppy':
					title = trans('Choose a virtual floppy disk file...','UIMachineSettingsStorage');
					icon = 'images/vbox/fd_16px.png';
					break;
				case 'DVD':
					title = trans('Choose a virtual CD/DVD disk file...','UIMachineSettingsStorage');
					icon = 'images/vbox/cd_16px.png';
					break;					
			}
			vboxFileBrowser(path,function(f){
				if(!f) return;
				var med = vboxMedia.getMediumByLocation(f);
				if(med && med.deviceType == type) {
					vboxMedia.updateRecent(med);
					callback(med);
					return;
				} else if(med) {
					return;
				}
				var ml = new vboxLoader();
				ml.add('mediumAdd',function(ret){
					var l = new vboxLoader();
					if(ret && ret.id) {
						var med = vboxMedia.getMediumById(ret.id);
						// Not registered yet. Refresh media.
						if(!med)
							l.add('vboxGetMedia',function(dret){$('#vboxIndex').data('vboxMedia',dret);});
					}
					l.onLoad = function() {
						if(ret && ret.id) {
							var med = vboxMedia.getMediumById(ret.id);
							if(med && med.deviceType == type) {
								vboxMedia.updateRecent(med);
								callback(med);
								return;
							}
						}
					};
					l.run();
				},{'path':f,'type':type});
				ml.run();
			},false,title,icon);
		} // </ choose >
	
	} // </ actions >
};

/**
 * Base Wizard class (new HardDisk, VM, etc..)
 * @class vboxWizard
 * @constructor
 * @param {String} name - name of wizard
 * @param {String} title - title of wizard dialog window
 * @param {String} bg - optional URL to background image to use
 * @param {String} icon - optional URL to icon to use on dialog
 */
function vboxWizard(name, title, bg, icon) {
	
	var self = this;

	this.steps = 0;
	this.name = name;
	this.title = title;
	this.finish = null;
	this.width = 700;
	this.height = 400;
	this.bg = bg;
	this.backText = trans('Back','QIArrowSplitter');
	this.nextText = trans('Next','QIArrowSplitter');
	this.cancelText = trans('Cancel','QIMessageBox');
	this.finishText = 'Finish';
	this.context = '';
	this.perPageContext = '';
	this.backArrow = $('<div />').html('&laquo;').text();
	this.nextArrow = $('<div />').html('&raquo;').text();
	
	/**
	 * Initialize / display wizard
	 * @memberOf vboxWizard
	 * @name vboxWizard.run
	 */
	self.run = function() {

		var d = $('<div />').attr({'id':self.name+'Dialog','style':'display: none','class':'vboxWizard'});
		
		var f = $('<form />').attr({'name':('frm'+self.name),'onSubmit':'return false;','style':'height:100%;margin:0px;padding:0px;border:0px;'});

		// main table
		var tbl = $('<table />').attr({'class':'vboxWizard','style':'height: 100%; margin:0px; padding:0px;border:0px;'});
		var tr = $('<tr />');

		
		var td = $('<td />').attr({'id':self.name+'Content','class':'vboxWizardContent'});
		
		if(self.bg) {
			$(d).css({'background':'url('+self.bg+') ' + (self.width - 360) +'px -60px no-repeat','background-color':'#fff'});				
		}
		
		// Title and content table
		$('<h3 />').attr('id',self.name+'Title').html(self.title).appendTo(td);

		$(tr).append(td).appendTo(tbl);		
		
		f.append(tbl);
		d.append(f);
		
		$('#vboxIndex').append(d);
		
		
		// load panes
		var l = new vboxLoader();
		l.addFileToDOM('panes/'+self.name+'.html',$('#'+self.name+'Content'));
		
		l.onLoad = function(){
		
			// Opera hidden select box bug
			////////////////////////////////
			if($.browser.opera) {
				$('#'+self.name+'Content').find('select').bind('change',function(){
					$(this).data('vboxSelected',$(this).val());
				}).bind('show',function(){
					$(this).val($(this).data('vboxSelected'));
				}).each(function(){
					$(this).data('vboxSelected',$(this).val());
				});
			}

			
			// Show / Hide description button
			/*
			 * TODO
			if(!self.stepButtons) self.stepButtons = [];
			self.stepButtons[self.stepButtons.length] = {
					name: trans('Hide Description', 'UIWizard'),
					click: function() {
				
					// Hide back button
					$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+self.backArrow + ' '+self.backText+'")').parent().hide();
	
					// Show /hide buttons
					$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+trans('Hide Description', 'UIWizard')+'")').parent().hide();
					$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+trans('Show Description', 'UIWizard')+'")').parent().show();
					
					// Go to last step
					self.displayStep(self.steps);
					
					// Add class to show that wizard is in no description mode and trigger mode
					$('#'+self.name+'Content').addClass('vboxWizardNoDescription').trigger('hideDescription');
					
					// Hide title
					$('#'+self.name+'Title').hide();
					
				},
				steps: [1]
			};
			*/
			
			// buttons
			var buttons = { };
			/*
			 * TODO
			buttons[trans('Show Description', 'UIWizard')] = function() {

				// Show / hide buttons
				$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+trans('Show Description', 'UIWizard')+'")').parent().hide();
				$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+trans('Hide Description', 'UIWizard')+'")').parent().show();
				
				// Show title
				$('#'+self.name+'Title').show();
				
				// Show back button
				$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+self.backArrow + ' '+self.backText+'")').parent().show();

				// Remove class and trigger show description
				$('#'+self.name+'Content').removeClass('vboxWizardNoDescription').trigger('showDescription');
				
				self.displayStep(1);
			};
			*/
			if(self.stepButtons) {
				for(var i = 0; i < self.stepButtons.length; i++) {
					buttons[self.stepButtons[i].name] = self.stepButtons[i].click;
				}
			}
			buttons[self.backArrow + ' '+self.backText] = self.displayPrev;
			buttons[(self.steps > 1 ? self.nextText +' '+self.nextArrow : self.finishText)] = self.displayNext;
			buttons[self.cancelText] = self.close;
			
			// Translations
			if(self.perPageContext) {

				for(var s = 1; s <= self.steps; s++) {
					vboxInitDisplay($('#'+self.name+'Step'+s),self.perPageContext.replace('%1',s));
				}
				
			} else {
				vboxInitDisplay(self.name+'Content',self.context);
			}
			
			
			$(d).dialog({'closeOnEscape':true,'width':self.width,'height':self.height,'buttons':buttons,'modal':true,'autoOpen':true,'stack':true,'dialogClass':'vboxDialogContent vboxWizard','title':(icon ? '<img src="images/vbox/'+icon+'_16px.png" class="vboxDialogTitleIcon" /> ' : '') + self.title});

			$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+trans('Show Description', 'UIWizard')+'")').parent().hide();
			self.displayStep(1);
		};
		l.run();
				
	};
	
	/**
	 * Close wizard
	 * @memberOf vboxWizard
	 */
	self.close = function() {
		$('#'+self.name+'Dialog').trigger('close').empty().remove();
	};
	
	/**
	 * Display a step
	 * @memberOf vboxWizard
	 * @param {Integer} step - step to display
	 */
	self.displayStep = function(step) {
		self._curStep = step;
		for(var i = 0; i < self.steps; i++) {
			$('#'+self.name+'Step'+(i+1)).css({'display':'none'});
		}
		/* update buttons */
		if(self.stepButtons) {
			for(var i = 0; i < self.stepButtons.length; i++) {
				$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+self.stepButtons[i].name+'")').parent().css({'display':(jQuery.inArray(step,self.stepButtons[i].steps) > -1 ? '' : 'none')});
			}
		}
		if(step == 1) {
			$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+self.backText+'")').parent().addClass('disabled').blur();
			$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+self.finishText+'")').html($('<div />').text((self.steps > 1 ? self.nextText+' '+self.nextArrow : self.finishText)).html());
		} else {
			
			$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+self.backText+'")').parent().removeClass('disabled');
			
			if(step == self.steps) {
				$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+self.nextArrow+'")').html($('<div />').text(self.finishText).html());
			} else {
				$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+self.finishText+'")').html($('<div />').text(self.nextText+' '+self.nextArrow).html());
			}
		}
		$('#'+self.name+'Title').html(trans($('#'+self.name+'Step'+step).attr('title'),(self.perPageContext ? self.perPageContext.replace('%1',step) : self.context)));
		$('#'+self.name+'Step'+step).css({'display':''});

		// Opera hidden select box bug
		////////////////////////////////
		if($.browser.opera) {
			$('#'+self.name+'Step'+step).find('select').trigger('show');
		}

		$('#'+self.name+'Step'+step).trigger('show',self);

	};
	
	/**
	 * Set current wizard step to be the last step in list
	 * @memberOf vboxWizard
	 */
	self.setLast = function() {
		$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+self.nextText+'")').html($('<div />').text(self.finishText).html());
		self._origSteps = self.steps;
		self.steps = self._curStep;
	};

	/**
	 * Unset the current wizard step so that it is not forced to be the last one in the list
	 * @memberOf vboxWizard
	 */
	self.unsetLast = function() {
		$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+self.finishText+'")').html($('<div />').text(self.nextText+' '+self.nextArrow).html());
		if(self._origSteps) self.steps = self._origSteps;
	};
	
	/**
	 * Display previous step
	 * @memberOf vboxWizard
	 */
	self.displayPrev = function() {
		if(self._curStep <= 1) return;
		self.displayStep(self._curStep - 1);
	};
	
	/**
	 * Display next step
	 * @memberOf vboxWizard
	 */
	self.displayNext = function() {
		if(self._curStep >= self.steps) {
			self.onFinish(self,$('#'+self.name+'Dialog'));
			return;
		}
		self.displayStep(self._curStep + 1);
	};
	
}
/**
 * Common toolbar class
 * @constructor
 * @class vboxToolbar
 * @param {Array} buttons - buttons to add to toolbar
 */
function vboxToolbar(buttons) {

	var self = this;
	self.buttons = buttons;
	self.size = 22;
	self.addHeight = 24;
	self.lastItem = null;
	self.id = null;
	self.buttonStyle = '';
	self.enabled = true;
	self.mutliSelect = false; // true if multiple items are selected

	/**
	 * Update buttons to be enabled / disabled
	 * @memberOf vboxToolbar
	 * @param {Object|Null} item - item to check
	 */
	self.update = function(item) {
		
		// Event target or manually passed item
		self.lastItem = item;
		
		if(!self.enabled) return;
		
		for(var i = 0; i < self.buttons.length; i++) {
			if(self.buttons[i].enabled && !self.buttons[i].enabled(self.lastItem)) {
				self.disableButton(self.buttons[i]);
			} else {
				self.enableButton(self.buttons[i]);
			}
		}		
	};

	/**
	 * Enable entire toolbar. Calls self.update()
	 * @memberOf vboxToolbar
	 * @param {Object} e - event
	 * @param {Object} item - item to pass to update
	 */ 
	self.enable = function(e, item) {
		self.enabled = true;
		self.update((item||self.lastItem));
	};

	/**
	 * Disable entire toolbar
	 * @memberOf vboxToolbar
	 */
	self.disable = function() {
		self.enabled = false;
		for(var i = 0; i < self.buttons.length; i++) {
			self.disableButton(self.buttons[i]);
		}		
	};
	
	/**
	 * Enable a single button
	 * @memberOf vboxToolbar
	 * @param {Object} b - button to enable
	 */
	self.enableButton = function(b) {
		$('#vboxToolbarButton-'+self.id+'-'+b.name).addClass('vboxEnabled').removeClass('vboxDisabled').children('img.vboxToolbarImg').attr('src','images/vbox/'+b.icon+'_'+self.size+'px.png');
	};

	/**
	 * Disable a single button
	 * @memberOf vboxToolbar
	 * @param {Object} b - button to disable 
	 */
	self.disableButton = function(b) {
		$('#vboxToolbarButton-'+self.id+'-'+b.name).addClass('vboxDisabled').removeClass('vboxEnabled').children('img.vboxToolbarImg').attr('src','images/vbox/'+b.icon+'_disabled_'+self.size+'px.png');
	};

	/**
	 * Set button label
	 * @memberOf vboxToolbar
	 * @param {String} bname - name of button to set label for
	 * @param {String} l - new label for button
	 */
	self.setButtonLabel = function(bname,l) {
		$('#vboxToolbarButton-'+self.id+'-'+bname).find('span.vboxToolbarButtonLabel').html(l);
	};
	
	/**
	 * Generate HTML element for button
	 * @memberOf vboxToolbar
	 * @param {Object} b - button object containing various button parameters
	 * @return {HTMLNode} button element
	 */
	self.buttonElement = function(b) {

		// Pre-load disabled version of icon if enabled function exists
		if(b.enabled) {
			var a = new Image();
			a.src = "images/vbox/"+b.icon+"_disabled_"+self.size+"px.png";
		}
		
		// TD
		var td = $('<td />').attr({'id':'vboxToolbarButton-' + self.id + '-' + b.name,
			'class':'vboxToolbarButton ui-corner-all vboxEnabled vboxToolbarButton'+self.size,
			'style':self.buttonStyle+'; min-width: '+(self.size+12)+'px;'
		}).html('<img src="images/vbox/'+b.icon+'_'+self.size+'px.png" class="vboxToolbarImg" style="height:'+self.size+'px;width:'+self.size+'px;"/><br /><span class="vboxToolbarButtonLabel">' + trans(b.label,(b.context ? b.context : (self.context ? self.context : null))).replace(/\./g,'')+'</span>').bind('click',function(){
			if($(this).hasClass('vboxDisabled')) return;
			$(this).data('toolbar').click($(this).data('name'));
		// store data
		}).data(b);
		
		if(!self.noHover) {
			$(td).hover(
					function(){if($(this).hasClass('vboxEnabled')){$(this).addClass('vboxToolbarButtonHover');}},
					function(){$(this).removeClass('vboxToolbarButtonHover');}		
			).mousedown(function(e){
				if($.browser.msie && e.button == 1) e.button = 0;
				if(e.button != 0 || $(this).hasClass('vboxDisabled')) return true;
				$(this).addClass('vboxToolbarButtonDown');

				var e = jQuery.Event("mouseup", {button:0});
				$(this).siblings().trigger(e);
				
				var btn = $(this);
				$(document).one('mouseup',function(){
					$(btn).removeClass('vboxToolbarButtonDown');
				});
			});
		}
		
		return td;
		
	};

	/**
	 * Add buttons to HTML node where id = id param
	 * @memberOf vboxToolbar
	 * @param {String} id - HTMLNode id to add buttons to
	 */
	self.addButtons = function(id) {
		
		self.id = id;
		self.height = self.size + self.addHeight; 
		
		//Create table
		var tbl = $('<table />').attr({'class':'vboxToolbar vboxToolbar'+this.size});
		var tr = $('<tr />');
		
		for(var i = 0; i < self.buttons.length; i++) {
			
			if(self.buttons[i].separator) {
				$('<td />').attr({'class':'vboxToolbarSeparator'}).html('<br />').appendTo(tr);
			}

			self.buttons[i].toolbar = self;
			$(tr).append(self.buttonElement(self.buttons[i]));
			

		}

		$(tbl).append(tr);
		$('#'+id).append(tbl).addClass('vboxToolbar vboxToolbar'+this.size).bind('disable',self.disable).bind('enable',self.enable);
		
		// If button can be enabled / disabled, disable by default
		for(var i = 0; i < self.buttons.length; i++) {
			if(self.buttons[i].enabled) {
				self.disableButton(self.buttons[i]);
			}
		}
	};

	/**
	 * Return button by name
	 * @memberOf vboxToolbar
	 * @param {String} n - button name
	 * @return {Object} button
	 */ 
	self.getButtonByName = function(n) {
		for(var i = 0; i < self.buttons.length; i++) {
			if(self.buttons[i].name == n)
				return self.buttons[i];
		}
		return null;
	};
	
	/**
	 * Trigger click event on button who's name = btn param
	 * @memberOf vboxToolbar
	 * @param {String} btn - name of button
	 * @return return value of .click() function performed on button
	 */
	self.click = function(btn) {
		var b = self.getButtonByName(btn);
		return b.click(btn);
	};
		
}

/**
 * Toolbar class for a small toolbar
 * @constructor
 * @class vboxToolbarSmall
 * @super vboxToolbar
 * @param {Array} buttons - list of buttons for toolbar
 */
function vboxToolbarSmall(buttons) {

	var self = this;
	self.parentClass = vboxToolbar;
	self.parentClass();
	self.selected = null;
	self.buttons = buttons;
	self.lastItem = null;
	self.buttonStyle = '';
	self.enabled = true;
	self.size = 16;
	self.disabledString = 'disabled';
	self.buttonCSS = {};

	/**
	 * Enable a single button
	 * @memberOf vboxToolbarSmall
	 * @param {Object} b - button to enable
	 * @return null
	 */
	self.enableButton = function(b) {
		if(b.noDisabledIcon)
			$('#vboxToolbarButton-' + self.id + '-' + b.name).css('display','').prop('disabled',false);
		else
			$('#vboxToolbarButton-' + self.id + '-' + b.name).css('background-image','url(images/vbox/' + (b.icon_exact ? b.icon : b.icon + '_'+self.size)+'px.png)').prop('disabled',false);
	};
	/**
	 * Disable a single button
	 * @memberOf vboxToolbarSmall
	 * @param {Object} b - button to disable
	 * @return null
	 */
	self.disableButton = function(b) {
		if(b.noDisabledIcon)
			$('#vboxToolbarButton-' + self.id + '-' + b.name).css('display','none').prop('disabled',false).removeClass('vboxToolbarSmallButtonHover').addClass('vboxToolbarSmallButton');
		else
			$('#vboxToolbarButton-' + self.id + '-' + b.name).css('background-image','url(images/vbox/' + (b.icon_exact ? b.icon_disabled : b.icon + '_'+self.disabledString+'_'+self.size)+'px.png)').prop('disabled',true).removeClass('vboxToolbarSmallButtonHover').addClass('vboxToolbarSmallButton');
	};

	/**
	 * Add CSS to be applied to button
	 * @param {String} b button name
	 * @param {Object} css css to be applied to button
	 */
	self.addButtonCSS = function(b, css) {
		self.buttonCSS[b] = css;
	};
	
	/**
	 * Generate HTML element for button
	 * @memberOf vboxToolbarSmall
	 * @param {Object} b - button object containing various button parameters
	 * @return {HTMLNode} button element
	 */
	self.buttonElement = function(b) {

		// Pre-load disabled version of icon if enabled function exists
		if(b.enabled && !b.noDisabledIcon) {
			var a = new Image();
			a.src = "images/vbox/" + (b.icon_exact ? b.icon_disabled : b.icon + '_'+self.disabledString+'_'+self.size)+'px.png';
		}

		var btn = $('<input />').attr({'id':'vboxToolbarButton-' + self.id + '-' + b.name,'type':'button','value':'',
			'class':'vboxImgButton vboxToolbarSmallButton ui-corner-all',
			'title':trans(b.label,(b.context ? b.context : (self.context ? self.context : null))).replace(/\./g,''),
			'style':self.buttonStyle+' background-image: url(images/vbox/' + b.icon + '_'+self.size+'px.png);'
		}).click(b.click);		
		
		if(!self.noHover) {
			$(btn).hover(
					function(){if(!$(this).prop('disabled')){$(this).addClass('vboxToolbarSmallButtonHover').removeClass('vboxToolbarSmallButton');}},
					function(){$(this).addClass('vboxToolbarSmallButton').removeClass('vboxToolbarSmallButtonHover');}		
			);
		
		}
		
		// Check for button specific CSS
		if(self.buttonCSS[b.name]) btn.css(self.buttonCSS[b.name]);
		
		return btn;
		
	};

	/**
	 * Add buttons to HTML node where id = id param
	 * @memberOf vboxToolbarSmall
	 * @param {String} id - HTMLNode id to add buttons to
	 * @return null
	 */
	self.addButtons = function(id) {
		
		self.id = id;
		
		var targetElm = $('#'+id);
		
		if(!self.buttonStyle)
			self.buttonStyle = 'height: ' + (self.size+8) + 'px; width: ' + (self.size+8) + 'px; ';
		
		for(var i = 0; i < self.buttons.length; i++) {
			
			if(self.buttons[i].separator) {
				$(targetElm).append($('<hr />').attr({'style':'display: inline','class':'vboxToolbarSmall vboxSeperatorLine'}));
			}

			$(targetElm).append(self.buttonElement(self.buttons[i])); 
				
		}

		$(targetElm).attr({'name':self.name}).addClass('vboxToolbarSmall vboxEnablerTrigger vboxToolbarSmall'+self.size).bind('disable',self.disable).bind('enable',self.enable);
		
	};
	
}

/**
 * Media menu button class
 * @constructor
 * @class vboxButtonMediaMenu
 * @param {String} type - type of media to display
 * @param {Function} callback - callback to run when media is selected
 * @param {String} mediumPath - path to use when selecting media
 */
function vboxButtonMediaMenu(type,callback,mediumPath) {
	
	var self = this;
	this.buttonStyle = '';
	this.enabled = true;
	this.size = 16;
	this.disabledString = 'disabled';
	this.type = type;
	this.lastItem = null;
	
	/** vboxMediaMenu to display when button is clicked */
	self.mediaMenu = new vboxMediaMenu(type,callback,mediumPath);
	
	/* Static button type list */
	self.buttons = {
			
		HardDisk : {
			name : 'mselecthdbtn',
			label : 'Set up the virtual hard disk',
			icon : 'hd',
			click : function () {
				return;				
			}
		},
		
		DVD : {
			name : 'mselectcdbtn',
			label : 'Set up the virtual CD/DVD drive',
			icon : 'cd',
			click : function () {
				return;				
			}
		},
	
		Floppy : {
			name : 'mselectfdbtn',
			label : 'Set up the virtual floppy drive',
			icon : 'fd',
			click : function () {
				return;				
			}
		}
	};
	
	// Set button based on passed type
	self.button = self.buttons[self.type];

	/** 
	 * Update button to be enabled / disabled
	 * @memberOf vboxButtonMediaMenu
	 * @param {Object|Null} target - item to test in button's enabled() fuction
	 * @param {Object|Null} item - item to test in button's enabled() fuction
	 * @return null
	 */
	self.update = function(target,item) {
		
		if(!self.enabled) return;
		
		self.lastItem = (item||target);
		
		if(self.button.enabled && !self.button.enabled(self.lastItem)) {
			self.disableButton();
		} else {
			self.enableButton();
		}
	};
	/**
	 * Enable this button
	 * @memberOf vboxButtonMediaMenu
	 * @return null
	 */
	self.enableButton = function() {
		var b = self.button;
		$('#vboxButtonMenuButton-' + self.id + '-' + b.name).css('background-image','url(images/vbox/' + b.icon + '_'+self.size+'px.png)').removeClass('vboxDisabled').html('<img src="images/downArrow.png" style="margin:0px;padding:0px;float:right;width:6px;height:6px;" />');
	};
	/**
	 * Disable this button
	 * @memberOf vboxButtonMediaMenu
	 * @return null
	 */
	self.disableButton = function() {
		var b = self.button;
		$('#vboxButtonMenuButton-' + self.id + '-' + b.name).css('background-image','url(images/vbox/' + b.icon + '_'+self.disabledString+'_'+self.size+'px.png)').removeClass('vboxToolbarSmallButtonHover').addClass('vboxDisabled').html('');
	};

	/**
	 * Enable button and menu
	 * @memberOf vboxButtonMediaMenu
	 * @return null
	 */
	self.enable = function(e, item) {
		self.enabled = true;
		self.update((item||self.lastItem));
		self.getButtonElm().enableContextMenu();
	};

	/**
	 * Disable button and menu
	 * @memberOf vboxButtonMediaMenu
	 * @return null
	 */
	self.disable = function() {
		self.enabled = false;
		self.disableButton();
		self.getButtonElm().disableContextMenu();
	};
	
	
	/**
	 * Generate HTML element for button
	 * @memberOf vboxButtonMediaMenu
	 * @return {HTMLNode}
	 */
	self.buttonElement = function() {

		var b = self.button;
		
		// Pre-load disabled version of icon if enabled function exists
		if(b.enabled) {
			var a = new Image();
			a.src = "images/vbox/" + b.icon + "_" + self.disabledString + "_" + self.size + "px.png";
		}
		
		return $('<td />').attr({'id':'vboxButtonMenuButton-' + self.id + '-' + b.name,'type':'button','value':'',
			'class':'vboxImgButton vboxToolbarSmallButton vboxButtonMenuButton ui-corner-all',
			'title':trans(b.label,'UIMachineSettingsStorage'),
			'style':self.buttonStyle+' background-image: url(images/vbox/' + b.icon + '_'+self.size+'px.png);text-align:right;vertical-align:bottom;'
		}).click(function(e){
			if($(this).hasClass('vboxDisabled')) return;
			$(this).addClass('vboxButtonMenuButtonDown');
			var tbtn = $(this);
			e.stopPropagation();
			e.preventDefault();
			$(document).one('mouseup',function(){
				$(tbtn).removeClass('vboxButtonMenuButtonDown');
			});
		}).html('<img src="images/downArrow.png" style="margin:0px;padding:0px;float:right;width:6px;height:6px;" />').hover(
					function(){if(!$(this).hasClass('vboxDisabled')){$(this).addClass('vboxToolbarSmallButtonHover');}},
					function(){$(this).removeClass('vboxToolbarSmallButtonHover');}		
		);
		
		
	};
	
	/**
	 * Return a jquery object containing button element.
	 * @memberOf vboxButtonMediaMenu
	 * @return {Object} jQuery object containing button element
	 */
	self.getButtonElm = function () {
		return $('#vboxButtonMenuButton-' + self.id + '-' + self.button.name);
	};

	/**
	 * Add button to element with id
	 * @memberOf vboxButtonMediaMenu
	 * @param {String} id - HTMLNode id to add button to
	 */
	self.addButton = function(id) {
		
		self.id = id;
		
		var targetElm = $('#'+id);
		
		if(!self.buttonStyle)
			self.buttonStyle = 'height: ' + (self.size + ($.browser.msie || $.browser.webkit ? 3 : 7)) + 'px; width: ' + (self.size+10) + 'px; ';
		
		var tbl = $('<table />').attr({'style':'border:0px;margin:0px;padding:0px;'+self.buttonStyle});
		$('<tr />').css({'vertical-align':'bottom'}).append(self.buttonElement()).appendTo(tbl);
		
		$(targetElm).attr({'name':self.name}).addClass('vboxToolbarSmall vboxButtonMenu vboxEnablerTrigger').bind('disable',self.disable).bind('enable',self.enable).append(tbl);
		
		// Generate and attach menu
		self.mediaMenu.menuElement();
		
		self.getButtonElm().contextMenu({
	 		menu: self.mediaMenu.menu_id(),
	 		mode:'menu',
	 		button: 0
	 	},self.mediaMenu.menuCallback);
		
		
	};
	
	/**
	 * Update media menu's "Remove Medium" item
	 * @memberOf vboxButtonMediaMenu
	 * @param {Boolean} enabled - whether the item should be enabled or not
	 */
	self.menuUpdateRemoveMedia = function(enabled) {
		self.mediaMenu.menuUpdateRemoveMedia(enabled);
	};
}

/**
 *  Media menu class
 *  @constructor
 *  @class vboxMediaMenu
 *  @param {String} type - type of media to display
 *  @param {Function} callback - callback function to run when medium is selected
 *  @param {String} mediumPath - path to use when selecting media
 */
function vboxMediaMenu(type,callback,mediumPath) {

	var self = this;
	self.type = type;
	self.callback = callback;
	self.mediumPath = mediumPath;
	self.removeEnabled = true;
	
	/**
	 * Generate menu element ID
	 * @memberOf vboxMediaMenu
	 * @return {String} string to use for menu node id
	 */
	self.menu_id = function(){
		return 'vboxMediaListMenu'+self.type;
	};
		
	/**
	 * Generate menu element
	 * @memberOf vboxMediaMenu
	 * @return {HTMLNode} menu element
	 */
	self.menuElement = function() {
		
		// Pointer already held
		if(self._menuElm) return self._menuElm;
		
		var id = self.menu_id();
		
		// Hold pointer
		self._menu = new vboxMenu(id,id);
		self._menu.context = 'UIMachineSettingsStorage';
		
		// Add menu
		self._menu.addMenu(self.menuGetDefaults());
		
		// Update recent list
		self.menuUpdateRecent();
		
		self._menu.update();
		
		self._menuElm = $('#'+self.menu_id());
		
		return self._menuElm;
	};
	
	/**
	 * Generate and return host drives
	 * @memberOf vboxMediaMenu
	 * @return {Array} array of objects that can be added to menu
	 */
	self.menuGetDrives = function() {
		
		var menu = [];
		
		// Add host drives
		var meds = vboxMedia.mediaForAttachmentType(self.type);
		for(var i =0; i < meds.length; i++) {
			if(!meds[i].hostDrive) continue;
			menu[menu.length] = {'name':meds[i].id,'label':vboxMedia.getName(meds[i]),'pretranslated':true};
		}
		
		return menu;
		
	};
	
	
	/**
	 * List of default menu items to use for media of type self.type
	 * @memberOf vboxMediaMenu
	 * @return {Array} List of default menu items to use for media of type self.type
	 */
	self.menuGetDefaults = function () {
		
		menus = [];
		
		switch(self.type) {
			
			// HardDisk defaults
			case 'HardDisk':
		
				// create hard disk
				menus[menus.length] = {'name':'createD','icon':'hd_new','label':'Create a new hard disk...'};

				// choose hard disk
				menus[menus.length] = {'name':'chooseD','icon':'select_file','label':'Choose a virtual hard disk file...'};
				
				// Add VMM?
				if($('#vboxIndex').data('vboxConfig').enableAdvancedConfig) {
					menus[menus.length] = {'name':'vmm','icon':'diskimage','label':'Virtual Media Manager...','context':'VBoxSelectorWnd'};
				}

				// recent list place holder
				menus[menus.length] = {'name':'vboxMediumRecentBefore','cssClass':'vboxMediumRecentBefore','enabled':function(){return false;},'hide_on_disabled':true};
								
				break;
				
			// CD/DVD Defaults
			case 'DVD':
				
				// Choose disk image
				menus[menus.length] = {'name':'chooseD','icon':'select_file','label':'Choose a virtual CD/DVD disk file...'};

				// Add VMM?
				if($('#vboxIndex').data('vboxConfig').enableAdvancedConfig) {
					menus[menus.length] = {'name':'vmm','icon':'diskimage','label':'Virtual Media Manager...','context':'VBoxSelectorWnd'};
				}
				
				// Add host drives
				menus = menus.concat(self.menuGetDrives());
								
				// Add remove drive
				menus[menus.length] = {'name':'removeD','icon':'cd_unmount','cssClass':'vboxMediumRecentBefore',
						'label':'Remove disk from virtual drive','separator':true,
						'enabled':function(){return self.removeEnabled;}};

				break;
			
			// Floppy defaults
			default:

				// Choose disk image
				menus[menus.length] = {'name':'chooseD','icon':'select_file','label':'Choose a virtual floppy disk file...'};

				// Add VMM?
				if($('#vboxIndex').data('vboxConfig').enableAdvancedConfig) {
					menus[menus.length] = {'name':'vmm','icon':'diskimage','label':'Virtual Media Manager...','context':'VBoxSelectorWnd'};
				}
				
				// Add host drives
				menus = menus.concat(self.menuGetDrives());

				// Add remove drive
				menus[menus.length] = {'name':'removeD','icon':'fd_unmount','cssClass':'vboxMediumRecentBefore',
						'label':'Remove disk from virtual drive','separator':true,
						'enabled':function(){return self.removeEnabled;}};

				break;
								
		}
		
		return menus;
		
	};

	/**
	 * Update "recent" media list menu items
	 * @memberOf vboxMediaMenu
	 */
	self.menuUpdateRecent = function() {
		
		var elm = $('#'+self.menu_id());
		var list = $('#vboxIndex').data('vboxRecentMedia')[self.type];
		elm.children('li.vboxMediumRecent').remove();
		var ins = elm.children('li.vboxMediumRecentBefore').last();
		for(var i = 0; i < list.length; i++) {
			if(!list[i]) continue;
			if(!vboxMedia.getMediumByLocation(list[i])) continue;
			
			$('<li />').attr({'class':'vboxMediumRecent'}).append(
					$('<a />').attr({
						'href' : '#path:'+list[i],
						'title' : list[i]
					}).text(vboxBasename(list[i]))
			).insertBefore(ins);
		}
	};
		
	/**
	 * Update "remove image from disk" menu item
	 * @memberOf vboxMediaMenu
	 * @param {Boolean} enabled - whether the item should be enabled or not
	 * @return null
	 */
	self.menuUpdateRemoveMedia = function(enabled) {
		self.removeEnabled = (enabled ? true : false);
		if(!self._menu) self.menuElement();
		else self._menu.update();
	};
	
	/**
	 * Update recent media menu and global recent media list
	 * @memberOf vboxMediaMenu
	 * @param {Object} m - medium object
	 * @param {Boolean} skipPathAdd - don't add medium's path to vbox's list of recent media paths
	 */
	self.updateRecent = function(m, skipPathAdd) {
		
		if(vboxMedia.updateRecent(m, skipPathAdd)) { // returns true if recent media list has changed
			// Update menu
			self.menuUpdateRecent();
		}
	};
	
	/**
	 * Function called when menu item is selected
	 * @memberOf vboxMediaMenu
	 * @param {String} action - menu item's href value (text in a href="#...")
	 */
	self.menuCallback = function(action) {
		
		switch(action) {
		
			// Create hard disk
			case 'createD':
				vboxWizardNewHDInit(function(id){
					if(!id) return;
					var med = vboxMedia.getMediumById(id);
					self.callback(med);
					self.menuUpdateRecent(med);
				},{'path':(self.mediumPath ? self.mediumPath : $('#vboxIndex').data('vboxRecentMediaPaths')[self.type])+$('#vboxIndex').data('vboxConfig').DSEP}); 				
				break;
			
			// VMM
			case 'vmm':
				// vboxVMMDialogInit(callback,type,hideDiff,mPath)
				vboxVMMDialogInit(function(m){
					if(m) {
						self.callback(vboxMedia.getMediumById(m));
						self.menuUpdateRecent();
					}
				},self.type,true,(self.mediumPath ? self.mediumPath : $('#vboxIndex').data('vboxRecentMediaPaths')[self.type]));
				break;
				
			// Choose medium file
			case 'chooseD':
				
				vboxMedia.actions.choose(self.mediumPath,self.type,function(med){
					self.callback(med);
					self.menuUpdateRecent();
				});
				
				break;
				
			// Existing medium was selected
			default:
				if(action.indexOf('path:') == 0) {
					var path = action.substring(5);
					var med = vboxMedia.getMediumByLocation(path);
					if(med && med.deviceType == self.type) {
						self.callback(med);
						self.updateRecent(med,true);
					}
					return;
				}
				var med = vboxMedia.getMediumById(action);
				self.callback(med);
				self.updateRecent(med,true);
		}
	};
		
		
}



/**
 * Singleton Data Mediator Object
 * 
 * Queues data requests and responses so that multiple requests for the same data do not generate
 * multiple server requests while an existing request is still in progress.
 * @namespace vboxVMDataMediator
 */
var vboxVMDataMediator = {
	
	_data : {},
	
	_inProgress : {},
	
	/**
	 * Get VM data
	 * @param {String} id - uuid of virtual machine
	 * @param {Function} callback - callback to run when data is returned
	 */
	get : function(id,callback) {
		
		// Data exists - should rarely happen - if ever
		if(vboxVMDataMediator._data[id]) {
			callback(vboxVMDataMediator._data[id]);
			return;
		}
		
		// In progress. Add callback to list
		if(vboxVMDataMediator._inProgress[id]) {
			
			vboxVMDataMediator._inProgress[id][vboxVMDataMediator._inProgress[id].length] = callback;
			vboxVMDataMediator._inProgress[id] = $.unique(vboxVMDataMediator._inProgress[id]);
			
		// Not in progress, create list && get data
		} else {
			
			vboxVMDataMediator._inProgress[id] = [callback];
			vboxAjaxRequest('machineGetDetails', {'vm':id}, vboxVMDataMediator._ajaxhandler,{'id':id});
			
		}
	},
	
	/**
	 * Handle returned ajax data
	 * @param {Object} data - data returned from AJAX call
	 * @param {Object} keys - keys.id holds requested VM's uuid
	 */
	_ajaxhandler : function(data, keys) {
		
		// First set data
		vboxVMDataMediator._data[keys['id']] = data;
		
		// Grab callbacks in temp var and delete callbacks queued in ._inProgress
		callbacks = vboxVMDataMediator._inProgress[keys['id']];
		delete vboxVMDataMediator._inProgress[keys['id']];
		
		if(callbacks && callbacks.length) {
			for(var i = 0; i < callbacks.length; i++)
				callbacks[i](data);
		}
		
		delete vboxVMDataMediator._data[keys['id']];
		
	}
};



/**
 * Menu class for use with context or button menus
 * @constructor
 * @class vboxMenu
 * @param {String} name - name of menu
 * @param {String} id - optional HTMLNode id of menu to use
 */
function vboxMenu(name, id) {

	var self = this;
	self.name = name;
	self.context = 'VBoxGlobal';
	self.menuItems = {};
	self.iconStringDisabled = '_dis';
	self.id = id;
	
	/**
	 * return menu id
	 * @memberOf vboxMenu
	 * @return {String} the HTMLNode id of this menu
	 */
	self.menuId = function() {
		if(self.id) return self.id;
		return self.name + 'Menu';
	};
	
	/**
	 * Add menu to menu object
	 * @memberOf vboxMenu
	 * @param {Object} m - menu configuration object
	 */
	self.addMenu = function(m) {
		$('#vboxIndex').append(self.menuElement(m,self.menuId()));
	};

	/**
	 *  Traverse menu configuration object and generate a <UL> containing menu items
	 *  @memberOf vboxMenu
	 *  @param {Object} m - menu configuration object
	 *  @param {String} mid - the optional id to use for the generated HTMLNode
	 *  @return {HTMLNode} menu <UL> node containing menu items and submenus
	 */
	self.menuElement = function(m,mid) {

		var ul = null;
		
		if(mid) {
			ul = $('#'+mid);
			if(ul && ul.attr('id')) {
				ul.empty();
			} else {
				ul = $('<ul />').attr({'id':mid,'style':'display: none;'});
			}
		} else {
			ul = $('<ul />').attr({'style':'display: none;'});
		}
		
		ul.addClass('contextMenu');
		
		for(var i in m) {
			
			if(typeof i == 'function') continue;

			
			// get menu item
			var item = self.menuItem(m[i]);
			
			// Add to menu list
			self.menuItems[m[i].name] = m[i];

			// Children?
			if(m[i].children && m[i].children.length) {
				item.append(self.menuElement(m[i].children));
			}
			
			ul.append(item);
			
		}
		
		return ul;
		
	};
	
	/**
	 * Menu click callback
	 * @memberOf vboxMenu
	 * @param {Integer} i - menu item index number
	 * @param {Object} item - optional selected item
	 * @return return value of menu item's click() function
	 */
	self.menuClickCallback = function(i, item) {
		return self.menuItems[i].click(item);
	};
	
	/**
	 * generate menu item HTML
	 * @memberOf vboxMenu
	 * @param {Object} i - menu item's configuration object
	 * @return {HTMLNode} <li> containing menu item
	 */
	self.menuItem = function(i) {

		return $('<li />').addClass((i.separator ? 'separator' : '')).addClass((i.cssClass ? i.cssClass : '')).append($('<a />')
			.html((i.label ? (i.pretranslated ? i.label : trans(i.label,(i.context ? i.context : self.context))):''))
			.attr({
				'style' : (i.icon ? 'background-image: url('+self.menuIcon(i,false)+')' : ''),
				'id': self.name+i.name,'href':'#'+i.name
			}));		
		
	};
	
	/**
	 * Return a URL to use for menu item's icon
	 * @memberOf vboxMenu
	 * @param {Object} i - menu item configuration object
	 * @param {Boolean} disabled - whether or not the icon should be disabled
	 * @return {String} url to icon to use
	 */
	self.menuIcon = function(i,disabled) {
		
		if(!i.icon) return '';
		
		// absolute url?
		if(i.icon_absolute) {
			if(disabled) return i.icon_disabled;
			return i.icon;
		}

		// exact icon?
		if(i.icon_exact) {
			if(disabled) return 'images/vbox/' + i.icon_disabled + 'px.png';
			return 'images/vbox/' + i.icon + 'px.png';
		}
		
		if(disabled) {
			return 'images/vbox/' + (i.icon_disabled ? i.icon_disabled : (i.icon_16 ? i.icon_16 : i.icon) + (i.iconStringDisabled ? i.iconStringDisabled : self.iconStringDisabled)) + '_16px.png';
		}
		
		return 'images/vbox/' + (i.icon_16 ? i.icon_16 : i.icon) + '_16px.png';
		
	};
	
	/**
	 * Update all menu items
	 * @memberOf vboxMenu
	 * @param {Object} chooser - phpVirtualBox chooser object
	 * @return null
	 */
	self.update = function(chooser) {
		
		for(var i in self.menuItems) {
			
			
			if(typeof i != 'string') continue;
			
			
			// If enabled function doesn't exist, there's nothing to do
			if(!self.menuItems[i].enabled) continue;
						
			var mi = $('#'+self.name+i);
			
			// Disabled
			if((chooser && self.menuItems[i].selectionModels && jQuery.inArray(chooser.selectionModel,self.menuItems[i].selectionModels) == -1) || !self.menuItems[i].enabled(chooser)) {
				
				if(self.menuItems[i].hide_on_disabled) {
					mi.parent().hide();
				} else {
					self.disableItem(i,mi);
				}
			
			// Enabled
			} else {
				if(self.menuItems[i].hide_on_disabled) { 
					mi.parent().show();
				} else {
					self.enableItem(i,mi);
				}
			}
			
		}
	};

	/**
	 * Disable a single menu item
	 * @memberOf vboxMenu
	 * @param {String} i - menu item's name
	 * @param {Object} mi - optional menu item HTMLNode or jQuery object
	 */
	self.disableItem = function(i, mi) {
		if(!mi) mi = $('#'+self.name+i);
		if(self.menuItems[i].icon)
			mi.css({'background-image':'url('+self.menuIcon(self.menuItems[i],true)+')'}).parent().addClass('disabled');
		else
			mi.parent().addClass('disabled');		
	};
	
	/**
	 * Enable a single menu item
	 * @memberOf vboxMenu
	 * @param {String} i - menu item's name
	 * @param {Object} mi - optional menu item HTMLNode or jQuery object
	 */	
	self.enableItem = function(i, mi) {
		if(!mi) mi = $('#'+self.name+i);
		if(self.menuItems[i].icon)
			mi.css({'background-image':'url('+self.menuIcon(self.menuItems[i],false)+')'}).parent().removeClass('disabled');
		else
			mi.parent().removeClass('disabled');		
	};
	
}

/**
 * Menu bar class
 * @constructor
 * @class vboxMenuBar
 * @param {String} name - name of this menu bar
 */
function vboxMenuBar(name) {
	
	var self = this;
	this.name = name;
	this.menus = new Array();
	this.menuClick = {};
	this.iconStringDisabled = '_dis';
	this.context = null;
	
	/**
	 * Add a menu to this object
	 * @memberOf vboxMenuBar
	 * @param {Object} m - menu configuration object
	 * @return void
	 */
	self.addMenu = function(m) {
		
		// Create menu object
		m.menuObj = new vboxMenu(m.name);
		
		// Propagate config
		if(m.context) m.menuObj.context = m.context;
		else if(self.context) m.menuObj.context = self.context;
		m.menuObj.iconStringDisabled = self.iconStringDisabled;
		
		// Add menu
		m.menuObj.addMenu(m.menu);
		self.menus[self.menus.length] = m;
				
	};

	/**
	 * Add menu bar to element identified by ID
	 * @memberOf vboxMenuBar
	 * @param {String} id - HTMLNode id of node to add menu bar to
	 */
	self.addMenuBar = function(id) {
		
		$('#'+id).prepend($('<div />').attr({'class':'vboxMenuBar','id':self.name+'MenuBar'}));
		
		for(var i = 0; i < self.menus.length; i++) {
			$('#'+self.name+'MenuBar').append(
					$('<span />').attr({'id':'vboxMenuBarMenu'+self.name+self.menus[i].name}).html(trans(self.menus[i].label,(self.menus[i].context ? self.menus[i].context : self.context)))
					.contextMenu({
					 		menu: self.menus[i].menuObj.menuId(),
					 		button: 0,
					 		mode: 'menu',
					 		menusetup : function(el) {
								$(el).parent().data('vboxMenubarActive', true);
								$(document).one('mousedown',function(){
									$(el).parent().data('vboxMenubarActive', false);
								});
							}					 		
						},
						self.menus[i].menuObj.menuClickCallback
					).hover(
						function(){
							$(this).addClass('vboxBordered');
							if($(this).parent().data('vboxMenubarActive')) {
								
								// Hide any showing menu
								var e = jQuery.Event("mouseup", {button:0});
								$(this).trigger(e);
								var e = jQuery.Event("mousedown", {button:0});
								$(this).trigger(e);
								var e = jQuery.Event("mouseup", {button:0});
								$(this).trigger(e);
							}
						},
						function(){
							$(this).removeClass('vboxBordered');
						}
					).disableSelection()
				);
		}
		self.update();
		
	};
	
	
	/**
	 * Update Menu items
	 * @memberOf vboxMenuBar
	 * @param {Object} item - item to use in menu configuration items' update() test
	 * @return void
	 */
	self.update = function(item) {
		
		for(var i = 0; i < self.menus.length; i++) {
			
			// check for enabled function on entire menu object
			if(self.menus[i].enabled) {
				if(self.menus[i].enabled(item)) {
					$('#vboxMenuBarMenu'+self.name+self.menus[i].name).show();
				} else {
					$('#vboxMenuBarMenu'+self.name+self.menus[i].name).hide();
					continue;
				}
			}
			self.menus[i].menuObj.update(item);
		}
		
	};
	
	
}

/**
 * Loads data, scripts, and HTML files and optionally displays 
 * "Loading ..." screen until all items have completed loading
 * @constructor
 * @class vboxLoader
 */
function vboxLoader() {

	var self = this;
	this._load = [];
	this.onLoad = null;
	this._loadStarted = {};
	this.hideRoot = false;
	this.noLoadingScreen = false;

	/**
	 * Add data item to list of items to load
	 * @memberOf vboxLoader
	 * @param {String} dataFunction - function to pass to vboxAjaxRequest()
	 * @param {Function} callback - callback to run when data is returned
	 * @param {Object} params - params to pass to vboxAjaxRequest()
	 * @see vboxAjaxRequest()
	 */
	self.add = function(dataFunction, callback, params) {
		if (params === undefined) params = {};
		this._load[this._load.length] = {
			'dataFunction' : dataFunction,
			'type' : 'data',
			'callback' : callback,
			'params' : params
		};
	};

	/**
	 * Add file to list of items to load
	 * @memberOf vboxLoader
	 * @param {String} file - URL of file to load
	 * @param {Function} callback - callback to run when file is loaded
	 * @see vboxAjaxRequest()
	 */
	self.addFile = function(file,callback) {
		params = {};		
		this._load[this._load.length] = {
				'type' : 'file',
				'callback' : callback,
				'file' : file,
				'params' : params
			};		
	};

	/**
	 * Add file to list of items to load. Append resulting file to element.
	 * @memberOf vboxLoader
	 * @param {String} file - URL of file to load
	 * @param {jQueryObject} elm - element to append file to
	 */
	self.addFileToDOM = function(file,elm) {
		if(elm === undefined) elm = $('body').children('div').first();
		var callback = function(f){elm.append(f);};
		self.addFile(file,callback,{});
	};
	
	/**
	 * Add file to list of items to load
	 * @memberOf vboxLoader
	 * @param {String} file - URL of script file to load
	 * @param {Function} callback - callback to run when file is loaded
	 * @see vboxAjaxRequest()
	 */	
	self.addScript = function(file,callback) {
		params = {};		
		this._load[this._load.length] = {
				'type' : 'script',
				'callback' : callback,
				'file' : file,
				'params' : params
			};		
	};
	
	
	/**
	 * Load data and optionally present "Loading..." screen
	 * @memberOf vboxLoader
	 * @return null
	 */
	self.run = function() {

		this._loadStarted = {'data':false,'files':false,'scripts':false};
		
		if(!self.noLoadingScreen) {

			var div = $('<div />').attr({'id':'vboxLoaderDialog','title':'','style':'display: none;','class':'vboxDialogContent'});
	
			var tbl = $('<table />');
			var tr = $('<tr />');

			$('<td />').attr('class', 'vboxLoaderSpinner').html('<img src="images/spinner.gif" />').appendTo(tr);
			
			$('<td />').attr('class','vboxLoaderText').html(trans('Loading ...','UIVMDesktop')).appendTo(tr);

			$(tbl).append(tr).appendTo(div);
			
			if(self.hideRoot)
				$('#vboxIndex').css('display', 'none');

			$(div).dialog({
				'dialogClass' : 'vboxLoaderDialog',
				'width' : 'auto',
				'height' : 60,
				'modal' : true,
				'resizable' : false,
				'draggable' : false,
				'closeOnEscape' : false,
				'buttons' : {}
			});
		}
		
		this._loadOrdered();
	};
	
	/**
	 * Load items in order of data, scripts, then files
	 * @memberOf vboxLoader
	 */
	self._loadOrdered = function() {
		
		var dataLeft = 0;
		var scriptsLeft = 0;
		var filesLeft = 0;

		for ( var i = 0; i < self._load.length; i++) {
			if(!self._load[i]) continue;
			if(self._load[i].type == 'data') {
				dataLeft = 1;
			} else if(self._load[i].type == 'script') {
				scriptsLeft = 1;
			} else if(self._load[i].type == 'file') {
				filesLeft = 1;
			}
		}
		
		// Everything loaded? Stop
		if(dataLeft + scriptsLeft + filesLeft == 0) { self._stop();	return; }
		
		// Data left to load
		if(dataLeft) {
			if(self._loadStarted['data']) return;
			self._loadStarted['data'] = true;
			self._loadData();
			return;
		}
		
		// Scripts left to load
		if(scriptsLeft) {
			if(self._loadStarted['scripts']) return;
			self._loadStarted['scripts'] = true;
			self._loadScripts();
			return;
		}

		// files left to load
		if(self._loadStarted['files']) return;
		self._loadStarted['files'] = true;
		self._loadFiles();
		
		
	};
	

	/**
	 * Load all data in queue
	 * @memberOf vboxLoader
	 */
	self._loadData = function() {
		for ( var i = 0; i < self._load.length; i++) {
			if(self._load[i] && self._load[i].type == 'data') {
				vboxAjaxRequest(self._load[i].dataFunction,self._load[i].params,self._ajaxhandler,{'id':i});
			}
		}
	};

	/**
	 * Load all scripts in queue
	 * @memberOf vboxLoader
	 */
	self._loadScripts = function() {
		for ( var i = 0; i < self._load.length; i++) {
			if(self._load[i] && self._load[i].type == 'script') {
				vboxGetScript(self._load[i].file,self._ajaxhandler,{'id':i});
			}
		}
	};

	/**
	 * Load all files in queue
	 * @memberOf vboxLoader
	 */
	self._loadFiles = function() {
		for ( var i = 0; i < self._load.length; i++) {
			if(self._load[i] && self._load[i].type == 'file') {
				vboxGetFile(self._load[i].file,self._ajaxhandler,{'id':i});
			}
		}
	};
	
	/**
	 * AJAX call returned. Call appropriate callback and check for completion
	 * @memberOf vboxLoader
	 * @param {Object} d - data returned from ajax call
	 * @param {Object} i - extra data - contains request id
	 */
	self._ajaxhandler = function(d, i) {
		if(self._load[i.id].callback) self._load[i.id].callback(d,self._load[i.id].params);
		self._load[i.id].loaded = true;
		delete self._load[i.id];
		self._loadOrdered();
	};

	
	/**
	 * Remove loading screen and show body
	 * @memberOf vboxLoader
	 */
	self._stop = function() {

		if(self.onLoad) self.onLoad();

		if(!self.noLoadingScreen) $('#vboxLoaderDialog').empty().remove();
		
		if(self.hideRoot) $('#vboxIndex').css('display', '');
		
		if(self.onShow) self.onShow();
	};

}

/**
 * Serial port object
 * @constructor
 * @class vboxSerialPorts
 */
var vboxSerialPorts = {
	
	ports : [
      { 'name':"COM1", 'irq':4, 'port':'0x3F8' },
      { 'name':"COM2", 'irq':3, 'port':'0x2F8' },
      { 'name':"COM3", 'irq':4, 'port':'0x3E8' },
      { 'name':"COM4", 'irq':3, 'port':'0x2E8' },
	],
	
	/**
	 * Return port name based on irq and port
	 * @param {Integer} irq - irq number
	 * @param {String} port - IO port
	 * @return {String} port name
	 */
	getPortName : function(irq,port) {
		for(var i = 0; i < vboxSerialPorts.ports.length; i++) {
			if(vboxSerialPorts.ports[i].irq == irq && vboxSerialPorts.ports[i].port.toUpperCase() == port.toUpperCase())
				return vboxSerialPorts.ports[i].name;
		}
		return 'User-defined';
	}
	
};

/**
 * LPT port object
 * @constructor
 * @class vboxParallelPorts
 */
var vboxParallelPorts = {
	
	ports : [
      { 'name':"LPT1", 'irq':7, 'port':'0x3BC' },
      { 'name':"LPT2", 'irq':5, 'port':'0x378' },
      { 'name':"LPT3", 'irq':5, 'port':'0x278' }
	],

	/**
	 * Return port name based on irq and port
	 * 
	 * @param {Integer} irq - irq number
	 * @param {String} port - IO port
	 * @return {String} port name
	 */	
	getPortName : function(irq,port) {
		for(var i = 0; i < vboxParallelPorts.ports.length; i++) {
			if(vboxParallelPorts.ports[i].irq == irq && vboxParallelPorts.ports[i].port.toUpperCase() == port.toUpperCase())
				return vboxParallelPorts.ports[i].name;
		}
		return 'User-defined';
	}
	
};


/**
 * Common VM storage / controller object
 * @namespace vboxStorage
 */
var vboxStorage = {

	/**
	 * Return list of bus types
	 * @memberOf vboxStorage
	 * @static
	 * @return {Array} list of all storage bus types
	 */
	getBusTypes : function() {
		var busts = [];
		for(var i in vboxStorage) {
			if(typeof i == 'function') continue;
			if(!vboxStorage[i].maxPortCount) continue;
			busts[busts.length] = i;
		}
		return busts;
	},
	
	IDE : {
		maxPortCount : 2,
		maxDevicesPerPortCount : 2,
		types :['PIIX3','PIIX4','ICH6' ],
		ignoreFlush : true,
		slotName : function(p,d) {
			switch(p+'-'+d) {
				case '0-0' : return (trans('IDE Primary Master','VBoxGlobal'));
				case '0-1' : return (trans('IDE Primary Slave','VBoxGlobal'));
				case '1-0' : return (trans('IDE Secondary Master','VBoxGlobal'));
				case '1-1' : return (trans('IDE Secondary Slave','VBoxGlobal'));
			}
		},
		driveTypes : ['dvd','disk'],
		slots : function() { return {
		          	'0-0' : (trans('Primary','VBoxGlobal') + ' ' + trans('Master','VBoxGlobal')),
		          	'0-1' : (trans('Primary','VBoxGlobal') + ' ' + trans('Slave','VBoxGlobal')),
		          	'1-0' : (trans('Secondary','VBoxGlobal') + ' ' + trans('Master','VBoxGlobal')),
		          	'1-1' : (trans('Secondary','VBoxGlobal') + ' ' + trans('Slave','VBoxGlobal'))
			};
		}
	},
		
	SATA : {
		maxPortCount : 30,
		maxDevicesPerPortCount : 1,
		ignoreFlush : true,
		types : ['IntelAhci'],
		driveTypes : ['dvd','disk'],
		slotName : function(p,d) { return trans('SATA Port %1','VBoxGlobal').replace('%1',p); },
		slots : function() {
					var s = {};
					for(var i = 0; i < 30; i++) {
						s[i+'-0'] = trans('SATA Port %1','VBoxGlobal').replace('%1',i);
					}
					return s;
				}
	},
		
	SCSI : {
		maxPortCount : 16,
		maxDevicesPerPortCount : 1,
		driveTypes : ['disk'],
		types : ['LsiLogic','BusLogic'],
		ignoreFlush : true,
		slotName : function(p,d) { return trans('SCSI Port %1','VBoxGlobal').replace('%1',p); },
		slots : function() {
						var s = {};
						for(var i = 0; i < 16; i++) {
							s[i+'-0'] = trans('SCSI Port %1','VBoxGlobal').replace('%1',i);
						}
						return s;				
					}
	},
		
	Floppy : {
		maxPortCount : 1,
		maxDevicesPerPortCount : 2,
		types : ['I82078'],
		driveTypes : ['floppy'],
		slotName : function(p,d) { return trans('Floppy Device %1','VBoxGlobal').replace('%1',d); },
		slots : function() { return { '0-0':trans('Floppy Device %1','VBoxGlobal').replace('%1','0'), '0-1' :trans('Floppy Device %1','VBoxGlobal').replace('%1','1') }; }
	},

	
	SAS : {
		maxPortCount : 8,
		maxDevicesPerPortCount : 1,
		types : ['LsiLogicSas'],
		driveTypes : ['disk'],
		slotName : function(p,d) { return trans('SAS Port %1','VBoxGlobal').replace('%1',p); },
		slots : function() {
						var s = {};
						for(var i = 0; i < 8; i++) {
							s[i+'-0'] = trans('SAS Port %1','VBoxGlobal').replace('%1',i);
						}
						return s;				
					},
		displayInherit : 'SATA'
	}

};

/**
 * Storage Controller Types conversions
 * @param {String} c - storage controller type
 * @return {String} string used for translation
 */
function vboxStorageControllerType(c) {
	switch(c) {
		case 'LsiLogic': return 'Lsilogic';
		case 'LsiLogicSas': return 'LsiLogic SAS';
		case 'IntelAhci': return 'AHCI';
	}
	return c;
}
/**
 * Serial port mode conversions
 * @param {String} m - serial port mode
 * @return {String} string used for translation
 */
function vboxSerialMode(m) {
	switch(m) {
		case 'HostPipe': return 'Host Pipe';
		case 'HostDevice': return 'Host Device';
		case 'RawFile': return 'Raw File';
	}
	return m;
}

/**
 * Network adapter type conversions
 * @param {String} t - network adapter type
 * @return {String} string used for translation
 */
function vboxNetworkAdapterType(t) {
	switch(t) {
		case 'Am79C970A': return 'PCnet-PCI II (Am79C970A)';
		case 'Am79C973': return 'PCnet-FAST III (Am79C973)';
		case 'I82540EM': return 'Intel PRO/1000 MT Desktop (82540EM)';
		case 'I82543GC': return 'Intel PRO/1000 T Server (82543GC)';
		case 'I82545EM': return 'Intel PRO/1000 MT Server (82545EM)';
		case 'Virtio': return 'Paravirtualized Network (virtio-net)';
	}
}

/**
 * Audio controller conversions
 * @param {String} c - audio controller type
 * @return {String} string used for translation
 */
function vboxAudioController(c) {
	switch(c) {
		case 'AC97': return 'ICH AC97';
		case 'SB16': return 'SoundBlaster 16';
		case 'HDA': return 'Intel HD Audio';
	}
}
/**
 * Audio driver conversions
 * @param {String} d - audio driver type
 * @return {String} string used for translation
 */
function vboxAudioDriver(d) {
	switch(d) {
		case 'OSS': return 'OSS Audio Driver';
		case 'ALSA': return 'ALSA Audio Driver';
		case 'Pulse': return 'PulseAudio';
		case 'WinMM': return 'Windows Multimedia';
		case 'DirectSound': return 'Windows DirectSound';
		case 'Null': return 'Null Audio Driver';
		case 'SolAudio': return 'Solaris Audio';
	}
	return d;
}
/**
 * VM storage device conversions
 * @param {String} d - storage device type
 * @return {String} string used for translation
 */
function vboxDevice(d) {
	switch(d) {
		case 'DVD': return 'CD/DVD-ROM';
		case 'HardDisk': return 'Hard Disk';
	}
	return d;
}

/**
 * VM State conversions
 * @param {String} state - virtual machine state
 * @return {String} string used for translation
 */
function vboxVMState(state) {
	switch(state) {
		case 'PoweredOff': return 'Powered Off';
		case 'LiveSnapshotting': return 'Live Snapshotting';
		case 'TeleportingPausedVM': return 'Teleporting Paused VM';
		case 'TeleportingIn': return 'Teleporting In';
		case 'TakingLiveSnapshot': return 'Taking Live Snapshot';
		case 'RestoringSnapshot': return 'Restoring Snapshot';
		case 'DeletingSnapshot': return 'Deleting Snapshot';
		case 'SettingUp': return 'Setting Up';
		default: return state;
	}
}
