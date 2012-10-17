/**
 * @fileOverview Common classes and objects used
 * @author Ian Moore (imoore76 at yahoo dot com)
 * @version $Id$
 * @copyright Copyright (C) 2010-2012 Ian Moore (imoore76 at yahoo dot com)
 */


/**
 * Host details sections used on details tab
 * 
 * @namespace vboxHostDetailsSections
 */

var vboxHostDetailsSections = {
	
	/*
	 * General
	 */
	hostgeneral: {
		icon:'machine_16px.png',
		title:trans('General','VBoxGlobal'),
		settingsLink: 'General',
		multiSelectDetailsTable: true,
		rows : [
		   {
			   title: trans('Name', 'VBoxGlobal'),
			   callback: function() { return $('#vboxPane').data('vboxConfig').name; },
			   condition: function() { return $('#vboxPane').data('vboxConfig').servers.length; }
		   },
		   {
			   title: trans('OS Type', 'VBoxGlobal'),
			   callback: function(d) {
				   return d['operatingSystem'] + ' (' + d['OSVersion'] +')';
			   }
		   },
		   {
			   title: 'VirtualBox',
			   callback: function() {
				   return $('#vboxPane').data('vboxConfig').version.string+' ('+$('#vboxPane').data('vboxConfig').version.revision+')';
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
			   title: trans("Processor(s)",'VBoxGlobal'),
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

			
			var showFree = $('#vboxPane').data('vboxConfig').hostMemInfoShowFreePct;
			var memRes = $('#vboxPane').data('vboxConfig').vmMemoryOffset;
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
				interval = Math.max(3,parseInt($('#vboxPane').data('vboxConfig').hostMemInfoRefreshInterval));
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
				
				/* Interface Name */
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
 * 
 * @namespace vboxVMDetailsInfo
 */

var vboxVMDetailsSections = {
	
	/*
	 * General
	 */
	general: {
		icon:'machine_16px.png',
		title:trans('General','VBoxGlobal'),
		settingsLink: 'General',
		multiSelectDetailsTable: true,
		rows : [
		   {
			   title: trans('Name', 'VBoxGlobal'),
			   attrib: 'name'
		   },
		   {
			   title: trans('OS Type', 'VBoxGlobal'),
			   attrib: 'OSTypeDesc'
		   },
		   {
			   title: trans('Guest Additions Version'),
			   attrib: 'guestAdditionsVersion'
		   },
		   {
			   title: trans('Groups','UIGDetails'),
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
		title:trans('System','VBoxGlobal'),
		settingsLink: 'System',
		redrawMachineEvents: ['vboxCPUExecutionCapChanged'],
		multiSelectDetailsTable: true,
		rows : [
		   {
			   title: trans('Base Memory','VBoxGlobal'),
			   callback: function(d) {
				   return trans('<nobr>%1 MB</nobr>').replace('%1',d['memorySize']);
			   }
		   },{
			   title: trans("Processor(s)",'VBoxGlobal'),
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
			   condition: function() { return $('#vboxPane').data('vboxConfig').enableAdvancedView; }
		   },{
			   title: trans("Nested Paging"),
			   callback: function(d) {
				   return (d['HWVirtExProperties'].NestedPaging ? trans('Enabled') : trans('Disabled'));
			   },
			   condition: function() { return $('#vboxPane').data('vboxConfig').enableAdvancedView; }
		   },{
			   title: trans("Large Pages"),
			   callback: function(d) {
				   return (d['HWVirtExProperties'].LargePages? trans('Enabled') : trans('Disabled'));
			   },
			   condition: function() { return $('#vboxPane').data('vboxConfig').enableAdvancedView; }
		   },{
			   title: trans("Exclusive use of the hardware virtualization extensions"),
			   callback: function(d) {
				   return (d['HWVirtExProperties'].Exclusive ? trans('Enabled') : trans('Disabled'));
			   },
			   condition: function() { return $('#vboxPane').data('vboxConfig').enableAdvancedView; } 
		   }
		]
	},
	
	/*
	 * Preview box
	 */
	preview : {
		icon:'fullscreen_16px.png',
		_resolutionCache : {},
		title:trans('Preview'),
		settingsLink: 'Display',
		rerenderOnStateChange: true,
		multiSelectDetailsTable: true,
		noSnapshot: true,
		noFooter: true,
		_updateInterval : undefined,
		condition: function() {
			
			// Update our default updateInterval here
			if(vboxVMDetailsSections.preview._updateInterval === undefined) {
				// Try local data first
				var updateInterval = vboxGetLocalDataItem('previewUpdateInterval');
				if(updateInterval === null || updateInterval === undefined) {
					updateInterval = $('#vboxPane').data('vboxConfig').previewUpdateInterval;
					if(updateInterval === null || updateInterval === undefined) {
						updateInterval = 3;
					}
					vboxSetLocalDataItem('previewUpdateInterval', parseInt(updateInterval));
				}
				vboxVMDetailsSections.preview._updateInterval = parseInt(updateInterval);
			}
			
			return !($('#vboxPane').data('vboxConfig').noPreview);
		},

		/*
		 * 
		 * Preivew Update Menu
		 * 
		 */
		contextMenu : function() {
			
			var menu = $('#vboxDetailsPreviewMenu');
			if(menu[0]) return menu;
			

			/* Menu List */
			var ul = $('<ul />')
				.attr({'class':'contextMenu contextMenuNoBG','style':'display: none','id':'vboxDetailsPreviewMenu'})
				.click(function(){$(this).hide();})
				.bind('contextmenu', function() { return false; })
				
				// Menu setup for "open in new window"
				.bind('beforeshow', function(e, vmid) {
					
					var d = vboxVMDataMediator.getVMData(vmid);
					
					if(vboxVMStates.isRunning(d) || vboxVMStates.isSaved(d)) {
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
							.click(function(){
								vboxSetLocalDataItem('previewUpdateInterval','0');
								vboxVMDetailsSections.preview._updateInterval = 0;
							})
							.prop('checked', parseInt(vboxVMDetailsSections.preview._updateInterval) == 0)
						
					).append(
							
						$('<span />')
							.html(trans('Update Disabled','UIVMPreviewWindow'))
					)
					
				).appendTo(ul);


			// Update intervals
			var ints = [3,5,10,20,30,60];
			
			// check for update interval
			if(vboxVMDetailsSections.preview._updateInterval > 0 && jQuery.inArray(vboxVMDetailsSections.preview._updateInterval, ints) < 0) {
				ints[ints.length] = vboxVMDetailsSections.preview._updateInterval;
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
					
					var lastIntervalNone = (parseInt(vboxVMDetailsSections.preview._updateInterval) == 0);
					
					vboxSetLocalDataItem('previewUpdateInterval',$(this).val());
					vboxVMDetailsSections.preview._updateInterval = $(this).val();
					
					// Kick off preview updates if the last interval was 0
					if(lastIntervalNone) {
						var selVMData = vboxChooser.getSelectedVMsData();
						for(var i = 0; i < selVMData.length; i++) {
							vboxVMDetailsSections.preview.onRender(selVMData[0]);
						}
					}
					
					
				}).prop('checked', parseInt(vboxVMDetailsSections.preview._updateInterval) == ints[i]);
				
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
			
			if(!vboxVMDetailsSections.preview._updateInterval || (!vboxVMStates.isRunning(d) && !vboxVMStates.isSaved(d))) {
				var timer = $('#vboxPane').data('vboxPreviewTimer-'+d.id);
				if(timer) {
					$('#vboxPane').data('vboxPreviewTimer-'+d.id, null);
					window.clearInterval(timer);
				}
				vboxVMDetailsSections.preview._drawPreview(d.id, d.state, d.lastStateChange);
				return;
			}
		
			vboxVMDetailsSections.preview._drawPreview(d.id,d.state,d.lastStateChange);
			
			if(vboxVMStates.isRunning(d)) {
				
				var timer = $('#vboxPane').data('vboxPreviewTimer-'+d.id);
				if(timer) window.clearInterval(timer);
				
				$('#vboxPane').data('vboxPreviewTimer-'+d.id,
					window.setInterval('vboxVMDetailsSections.preview._drawPreview("'+d.id+'","'+d.state+'",'+d.lastStateChange+')',
							vboxVMDetailsSections.preview._updateInterval * 1000));

			}
		},
		
		_drawPreview: function(vmid, vmstate, lastStateChange,skipexistcheck) {
			
			// Does the target still exist?
			if(!skipexistcheck && !$('#vboxDetailsGeneralTable-'+vmid)[0]) {
				var timer = $('#vboxPane').data('vboxPreviewTimer-'+vmid);
				if(timer) window.clearInterval(timer);
				$('#vboxPane').data('vboxPreviewTimer-'+vmid, null);
				return;
			}

			var width = $('#vboxPane').data('vboxConfig')['previewWidth'];
			
			var __vboxDrawPreviewImg = new Image();			
			__vboxDrawPreviewImg.onload = function() {

				var height = 0;
				var baseStr = 'vboxDetailsGeneralTable-'+vmid;

				// Does the target still exist?
				if(!skipexistcheck && !$('#vboxDetailsGeneralTable-'+vmid)[0]) {
					var timer = $('#vboxPane').data('vboxPreviewTimer-'+vmid);
					if(timer) window.clearInterval(timer);
					$('#vboxPane').data('vboxPreviewTimer-'+vmid, null);
					return;
				}

				// Error or machine not running
				if(this.height <= 1) {

					$('#'+baseStr+' img.vboxDetailsPreviewImg').css({'display':'none'}).attr('src','images/vbox/blank.gif');
					$('#'+baseStr+' div.vboxDetailsPreviewVMName').css('display','');
					
					width = $('#vboxPane').data('vboxConfig')['previewWidth'];
					height = parseInt(width / $('#vboxPane').data('vboxConfig')['previewAspectRatio']);
					
					// Clear interval if set
					var timer = $('#vboxPane').data('vboxPreviewTimer-'+vmid);
					if(timer) window.clearInterval(timer);

					
										
				} else {

					// Calculate height based on width
					width = $('#vboxPane').data('vboxConfig')['previewWidth'];
					factor = width / this.width;
					if(!factor) factor = 1;
					height = parseInt(this.height * factor);

					// Set cached resolution
					vboxVMDetailsSections.preview._resolutionCache[vmid] = {
						'width' : width,
						'height' : height
					};
									
					
					$('#'+baseStr+' div.vboxDetailsPreviewVMName').css('display','none');
					$('#'+baseStr+' img.vboxDetailsPreviewImg').css({'display':'','height':height+'px','width':width+'px'});
					
					// IE uses filter
					if($.browser.msie) {
						
						if(vboxVMStates.isRunning(d)) {
							
							// Setting background URL keeps image from being
							// requested again, but does not allow us to set
							// the size of the image. This is fine, since the
							// image is returned in the size requested.
							$('#'+baseStr+' img.vboxDetailsPreviewImg').css({"filter":""}).parent().css({'background':'url('+this.src+')'});
						
						} else {
							
							// This causes the image to be requested again, but
							// is the only way to size the background image.
							// Saved preview images are not returned in the size
							// requested and must be resized at runtime by
							// the browser.
							$('#'+baseStr+' img.vboxDetailsPreviewImg').css({"filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true', src='"+this.src+"', sizingMethod='scale')"}).parent().css({'background':'#000'});
						}
						
					// Webkit based browsers will re-download the image if we
					// just set the image source
					} else if($.browser.webkit) {
						
						$('#'+baseStr+' img.vboxDetailsPreviewImg').css({'background-image':'url('+vboxVMDetailsSections.preview.__getBase64Image(this)+')'});
					
					} else {

						$('#'+baseStr+' img.vboxDetailsPreviewImg').css({'background-image':'url('+this.src+')','background-size':(width+1) +'px ' + (height+1)+'px'});
						
					}
					
				}

				// Resize name?
				$('#vboxDetailsGeneralTable-'+vmid+ ' div.vboxDetailsPreviewVMName span.textFill').textFill({maxFontPixels:20,'height':(height),'width':(width)});

				$('#'+baseStr+' div.vboxDetailsPreviewWrap').css({'height':height+'px','width':width+'px'});
				$('#'+baseStr+' img.vboxPreviewMonitor').css('width',width+'px');
				$('#'+baseStr+' img.vboxPreviewMonitorSide').css('height',height+'px');
			};

			// Update disabled? State not Running or Saved
			if(!vboxVMDetailsSections.preview._updateInterval || (!vboxVMStates.isRunning({'state':vmstate}) && !vboxVMStates.isSaved({'state':vmstate}))) {
				__vboxDrawPreviewImg.height = 0;
				__vboxDrawPreviewImg.onload();
			} else {
				// Running VMs get random numbers. Saved are based on last state
				// change.
				// Try to let the browser cache Saved screen shots
				var randid = lastStateChange;
				if(vboxVMStates.isRunning({'state':vmstate})) {
					var currentTime = new Date();
					randid = Math.floor(currentTime.getTime() / 1000);
				}
				__vboxDrawPreviewImg.src = 'screen.php?width='+(width)+'&vm='+vmid+'&randid='+randid;
				
			}
			


		},
		rows: function(d) {

			var width = $('#vboxPane').data('vboxConfig')['previewWidth'];
			if(!width) width = $('#vboxPane').data('vboxConfig')['previewWidth'] = 180;
			width = parseInt(width);
			var height = parseInt(width / $('#vboxPane').data('vboxConfig')['previewAspectRatio']);

			// Check for cached resolution
			if(vboxVMDetailsSections.preview._resolutionCache[d.id]) {
				width = vboxVMDetailsSections.preview._resolutionCache[d.id].width;
				height = vboxVMDetailsSections.preview._resolutionCache[d.id].height;
			}

			var divOut1 = "<div class='vboxDetailsPreviewVMName' style='position:absolute;overflow:hidden;padding:0px;height:"+height+"px;width:"+width+"px;"+
				"display:"+(vboxVMStates.isRunning(d) || vboxVMStates.isSaved(d) ? 'none' : '')+"' >" +
				"<div style='position:relative;display:table-cell;padding:0px;vertical-align:middle;color:#fff;font-weight:bold;overflow:hidden;text-align:center;height:"+height+"px;width:"+width+"px;" +
				($.browser.msie ? "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=\"true\", src=\"images/monitor_glossy.png\", sizingMethod=\"scale\")" : "" +
					"background:url(images/monitor_glossy.png) top left no-repeat;-moz-background-size:100% 100%;background-size:"+(width+1) +"px " + (height+1)+"px;-webkit-background-size:100% 100%") +
				"'><span class='textFill' style='font-size: 12px;position:relative;display:inline-block;'>"+$('<div />').html(d.name).text()+"</span></div>"+
				"</div>";

			return [
			        {
			        	data : "<tr style='vertical-align: middle'>"+
							"<td style='text-align: center' colspan='2'>"+
								"<table class='vboxInvisible vboxPreviewTable' style='margin-left:auto;margin-right:auto;'>"+
									"<tr style='vertical-align:bottom; padding:0px; margin:0px;height:17px'>"+
										"<td class='vboxInvisible' style='text-align:right;width:15px;height:17px'><img src='images/monitor_tl.png' style='width:15px;height:17px;'/></td>"+
										"<td class='vboxInvisible'><img src='images/monitor_top.png' class='vboxPreviewMonitor' style='height:17px;width:"+width+"px'/></td>"+
										"<td class='vboxInvisible' style='text-align:left;width:15px;height:17px'><img src='images/monitor_tr.png' style='width:15px;height:17px;'/></td>"+
									"</tr>"+
									"<tr style='vertical-align:top;'>"+
										"<td class='vboxInvisible' style='text-align:right;'><img src='images/monitor_left.png' style='width:15px;height:"+height+"px' class='vboxPreviewMonitorSide' /></td>"+
										"<td class='vboxInvisible' style='position:relative;'><div class='vboxDetailsPreviewWrap "+ (vboxVMStates.isSaved(d) ? 'vboxPreviewSaved' : '') +"' style='width: "+width+"px; height:"+height+"px; position:relative;overflow:hidden;text-align:center;background-color:#000;border:0px;display:table;#position:relative;background-repeat:no-repeat;padding:0px;margin:0px;'>"+
											"<img class='vboxDetailsPreviewImg' src='images/monitor_glossy.png' vspace='0px' hspace='0px' "+
											"style='display:"+(vboxVMStates.isRunning(d) || vboxVMStates.isSaved(d) ? '' : 'none')+";top:0px;margin:0px;border:0px;padding;0px;"+
											"background-position:top left;background-repeat:no-repeat;"+
											"-moz-background-size:100% 100%;background-size:100% 100%;-webkit-background-size:100% 100%;background-spacing:0px 0px;"+
											"height:"+height+"px;width:"+width+"px;' />"+
											divOut1+
										"</div></td>"+
										"<td class='vboxInvisible' style='text-align:left;' ><img src='images/monitor_right.png' style='width:14px;height:"+height+"px' class='vboxPreviewMonitorSide' /></td>"+
									"</tr>"+
									"<tr style='vertical-align:top;height:17px'>"+
										"<td class='vboxInvisible' style='text-align:right;width:15px;height:17px'><img src='images/monitor_bl.png' style='width:15px;height:17px;float:right;'/></td>"+
										"<td class='vboxInvisible' style='vertical-align:top'><img src='images/monitor_bottom.png' class='vboxPreviewMonitor' style='height:17px;width:"+width+"px'/></td>"+
										"<td class='vboxInvisible' style='text-align:left;width:15px;height:17px'><img src='images/monitor_br.png' style='width:15px;height:17px;'/></td>"+
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
		title:trans('Display'),
		settingsLink: 'Display',
		redrawMachineEvents: ['vboxVRDEServerInfoChanged','vboxVRDEServerChanged'],
		redrawOnStateChange: true,
		rows: [
		   {
			   title: trans("Video Memory"),
			   callback: function(d) {
				   return trans('<nobr>%1 MB</nobr>').replace('%1',d['VRAMSize']);
			   }
		   },{
			   title: trans('Remote Desktop Server Port'),
			   callback: function(d) {
				   
				   var chost = vboxGetVRDEAddress(d);
				
				   // Get ports
				   var rowStr = d['VRDEServer']['ports'];
				   
				   // Just this for snapshots
				   if(d._isSnapshot) return rowStr;
				   
				   // Display links?
				   if((d['state'] == 'Running' || d['state'] == 'Paused') && d['VRDEServerInfo'] && d['VRDEServerInfo']['port'] > 0) {
					   rowStr = " <a href='rdp.php?host=" + chost + '&port=' + d['VRDEServerInfo']['port'] + "&id=" + d['id'] + "&vm=" + encodeURIComponent(d['name']) + "'>" + d['VRDEServerInfo']['port'] + "</a>";						   
					   rowStr += ' <img src="images/vbox/blank.gif" style="vspace:0px;hspace:0px;height2px;width:10px;" /> (' + chost + ':' + d['VRDEServerInfo']['port'] + ')';
				   } else {
					   rowStr += ' ('+chost+')';
				   }
				   return rowStr;
				   
  
			   },
			   html: true,
			   condition: function(d) {
				   
				   // Running and paused states have real-time console info
				   if(!d._isSnapshot && (d['state'] == 'Running' || d['state'] == 'Paused')) {
					   return d.VRDEServer && (d.VRDEServer.enabled);
				   }
				   return (d['VRDEServer'] && (d._isSnapshot || d['VRDEServer']['VRDEExtPack']) && d['VRDEServer']['enabled'] && d['VRDEServer']['ports']);
			   }
		   },{
			   title: trans("Remote Desktop Server"),
			   callback: function(d) {
				   return trans('Disabled','VBoxGlobal',null,'details report (VRDE Server)');
			   },
			   condition: function(d) {
				   return !(vboxVMDetailsSections.display.rows[1].condition(d));
			   }
		   }
		]
	},
	
	/*
	 * Storage controllers
	 */
	storage : {
		icon:'hd_16px.png',
		title: trans('Storage'),
		settingsLink: 'Storage',
		redrawMachineEvents: ['vboxMediumChanged'],
		redrawOnStateChange: true,
		rows: function(d) {
			
			var advancedView = $('#vboxPane').data('vboxConfig').enableAdvancedConfig;
			
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
						
						portDesc = trans('Refresh','UIVMLogViewer');

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
						title: portName,
						indented: true,
						data: (d['storageControllers'][a]['mediumAttachments'][b].type == 'DVD' ? trans('[CD/DVD]','UIGDetails') + ' ' : '') + portDesc,
						html: true
					};
					
				}
				
			}
			return rows;
		}
	},
	
	/*
	 * Audio
	 */
	audio : {
		icon:'sound_16px.png',
		title:trans('Audio'),
		settingsLink: 'Audio',
		rows: [
		    {
			    title: '<span class="vboxDetailsNone">'+trans("Disabled",'VBoxGlobal',null,'details report (audio)')+'</span>',
			    html: true,
			    condition: function(d) { return !d['audioAdapter']['enabled']; },
			    data: ''
		    },{
		    	title: trans("Host Driver",'UIDetailsBlock'),
		    	callback: function(d) {
		    		return trans(vboxAudioDriver(d['audioAdapter']['audioDriver']),'VBoxGlobal');
		    	},
		    	condition: function(d) { return d['audioAdapter']['enabled']; }
		    },{
		    	title: trans("Controller",'UIDetailsBlock'),
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
		title: trans('Network'),
		redrawMachineEvents: ['vboxNetworkAdapterChanged'],
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
		title: trans('Serial Ports'),
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
		title: trans('Parallel Ports','UIDetailsPagePrivate'),
		settingsLink: 'ParallelPorts',
		condition: function() { return $('#vboxPane').data('vboxConfig').enableLPTConfig; },
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
		title: trans('USB'),
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
		title: trans('Shared Folders', 'UIDetailsPagePrivate'),
		settingsLink: 'SharedFolders',
		rows: function(d) {

			if(!d['sharedFolders'] || d['sharedFolders'].length < 1) {
				return [{
					title: '<span class="vboxDetailsNone">'+trans('None',null,null,'details report (shared folders)')+'</span>',
					html: true
				}];
			}
			
			return [{
					title: trans('Shared Folders', 'UIDetailsPagePrivate'),
					data: d['sharedFolders'].length
				}];
		}
	},
	
	/*
	 * VM Description
	 */
	description: {
		icon: 'description_16px.png',
		title: trans('Description','UIDetailsPagePrivate'),
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
 * 
 * @namespace vboxVMGroupActions
 */
var vboxVMGroupActions = {

	'newmachine': {
		label: trans('New Machine...','UIActionPool'),
		icon: 'new',
		click: function(){
			vboxVMActions['new'].click(true);
		},
		enabled: function() {
			return $('#vboxPane').data('vboxSession').admin;
		}
	},
	
	addmachine: {
		label: trans('Add Machine...','UIActionPool'),
		icon: 'vm_add',
		click: function() {
			vboxVMActions['add'].click(true);
		},
		enabled: function() {
			return $('#vboxPane').data('vboxSession').admin;
		}
	},
	
	rename: {
		label: trans('Rename Group...','UIActionPool'),
		icon: 'name',
		enabled: function() {
			if(!$('#vboxPane').data('vboxSession').admin) return false;
			var gElm = vboxChooser.getSelectedGroupElements()[0];
			if(!gElm) return false;
			if($('#vboxPane').data('vboxConfig')['phpVboxGroups']) return true;
			if($(gElm).find('td.vboxVMSessionOpen')[0]) return false;
			return true;
		},
		click: function() {
			vboxChooser.renameSelectedGroup();
		}
	},
	
	ungroup: {
		label: trans('Ungroup...','UIActionPool'),
		icon: 'delete',
		enabled: function() {
			if(!$('#vboxPane').data('vboxSession').admin) return false;
			var gElm = vboxChooser.getSelectedGroupElements()[0];
			if(!gElm) return false;
			if($('#vboxPane').data('vboxConfig')['phpVboxGroups']) return true;
			if($(gElm).find('td.vboxVMSessionOpen')[0]) return false;
			return true;
		},
		click: function() {
			
			vboxChooser.unGroupSelectedGroup();
			
		}
	},
	
	'sort': {
		label: trans('Sort','UIActionPool'),
		click: function() {
			vboxChooser.sortSelectedGroup();
		},
		enabled: function() {
			return $('#vboxPane').data('vboxSession').admin;
		}
	}
	
};

/**
 * Common VM Actions - These assume that they will be run on the selected VM as
 * stored in vboxChooser.getSingleSelected()
 * 
 * @namespace vboxVMActions
 */
var vboxVMActions = {
		
	/** Invoke the new virtual machine wizard */
	'new':{
			label:trans('New...','UIActionPool'),
			icon:'vm_new',
			icon_16:'new',
			click: function(fromGroup){
				vboxWizardNewVMInit(function(){return;},(fromGroup ? $(vboxChooser.getSelectedGroupElements()[0]).data('vmGroupPath') : ''));
			}
	},
	
	/** Add a virtual machine via its settings file */
	add: {
		label:trans('Add...','UIActionPool'),
		icon:'vm_add',
		click:function(){
			vboxFileBrowser($('#vboxPane').data('vboxSystemProperties').defaultMachineFolder,function(f){
				if(!f) return;
				var l = new vboxLoader();
				l.add('machineAdd',function(){},{'file':f});
				l.onLoad = function(){
					var lm = new vboxLoader();
					lm.add('vboxGetMedia',function(d){$('#vboxPane').data('vboxMedia',d);});
					lm.run();
				};
				l.run();
				
			},false,trans('Add an existing virtual machine','UIActionPool'),'images/vbox/machine_16px.png',true);
		}
	},

	/** Start VM */
	start: {
		name : 'start',
		label : trans('Start','UIActionPool'),
		icon : 'vm_start',
		icon_16 : 'start',
		click : function (btn) {
		
			
			// Start a single vm
			var startVM = function (vm) {
				
				vboxAjaxRequest('machineSetState',{'vm':vm.id,'state':'powerUp'},function(d,evm,persist){
					// check for progress operation
					if(d && d.progress) {
						var icon = null;
						if(vboxVMStates.isSaved(evm)) icon = 'progress_state_restore_90px.png';
						else icon = 'progress_start_90px.png';
						vboxProgress({'progress':d.progress,'persist':persist},function(){return;},icon,
								trans('Start the selected virtual machines','UIActionPool'),evm.name);
						return;
					}
				},vm);
			};
			
			// Start each eligable selected vm
			var startVMs = function() {				
				var vms = vboxChooser.getSelectedVMsData();
				for(var i = 0; i < vms.length; i++) {
					if(vboxVMStates.isPaused(vms[i]) || vboxVMStates.isPoweredOff(vms[i]) || vboxVMStates.isSaved(vms[i])) {
						startVM(vms[i]);
					}
					
				}
			};
			
			// Check for memory limit
			// Paused VMs are already using all their memory
			if($('#vboxPane').data('vboxConfig').vmMemoryStartLimitWarn) {
				
				var freeMem = 0;
				var baseMem = 0;
				
				var l = new vboxLoader();
				l.add('hostGetMeminfo',function(d){freeMem = d.memoryAvailable;});
				l.onLoad = function() {
					
					// Subtract memory for each VM selected
					var vms = vboxChooser.getSelectedVMsData();
					for(var i = 0; i < vms.length; i++) {
						if(vboxVMStates.isPoweredOff(vms[i]) || vboxVMStates.isSaved(vms[i])) {
							// VM memory + a little bit of overhead
							baseMem += (vms[i].memorySize + 50);
						}
					}

					if($('#vboxPane').data('vboxConfig').vmMemoryOffset)
						freeMem -= $('#vboxPane').data('vboxConfig').vmMemoryOffset;

					// Memory breaches warning threshold
					if(baseMem >= freeMem) {
						var buttons = {};
						buttons[trans('Yes','QIMessageBox')] = function(){
							$(this).remove();
							startVMs();
						};
						freeMem = Math.max(0,freeMem);
						vboxConfirm('<p>The selected virtual machine(s) require(s) <b><i>approximately</b></i> ' + baseMem +
								'MB of memory, but your VirtualBox host only has ' + freeMem + 'MB '+
								($('#vboxPane').data('vboxConfig').vmMemoryOffset ? ' (-'+$('#vboxPane').data('vboxConfig').vmMemoryOffset+'MB)': '') +
								' free.</p><p>Are you sure you want to start the virtual machine(s)?</p>',buttons,trans('No','QIMessageBox'));
					
					// Memory is fine. Start vms.
					} else {
						startVMs();
					}
				};
				l.run();
				
			// No memory limit warning configured
			} else {
				startVMs();
			}

						
		},
		enabled : function () {
			return (vboxChooser.isSelectedInState('Paused') || vboxChooser.isSelectedInState('PoweredOff') || vboxChooser.isSelectedInState('Saved'));			
		}	
	},
	
	/** Invoke VM settings dialog */
	settings: {
		label:trans('Settings...','UIActionPool'),
		icon:'vm_settings',
		icon_16:'settings',
		click:function(){
			
			vboxVMsettingsInit(vboxChooser.getSingleSelectedId());
		},
		enabled : function () {
			return vboxChooser && vboxChooser.selectionMode == vboxSelectionModeSingleVM && 
				(vboxChooser.isSelectedInState('Running') || vboxChooser.isSelectedInState('Paused') || vboxChooser.isSelectedInState('Editable'));
		}
	},

	/** Clone a VM */
	clone: {
		label:trans('Clone...','UIActionPool'),
		icon:'vm_clone',
		icon_16:'vm_clone',
		icon_disabled:'vm_clone_disabled',
		click:function(){vboxWizardCloneVMInit(function(){return;},{vm:vboxChooser.getSingleSelected()});},
		enabled: function () {
			return (vboxChooser.selectionMode == vboxSelectionModeSingleVM && vboxChooser.isSelectedInState('PoweredOff'));
		}
	},

	
	/** Refresh a VM's details */
	refresh: {
		label:trans('Refresh','UIVMLogViewer'),
		icon:'refresh',
		icon_disabled:'refresh_disabled',
		click:function(){
			
			var vmid = vboxChooser.getSingleSelectedId();
			
			var l = new vboxLoader();
			l.showLoading();
			$.when(vboxVMDataMediator.refreshVMData(vmid)).then(function(){
				l.removeLoading();
			});
			
    	},
    	enabled: function () {return(vboxChooser.selectedVMs.length ==1);}
    },
    
    /** Delete / Remove a VM */
    remove: {
		label:trans('Remove...', 'UIActionPool'),
		icon:'delete',
		click:function(){

			
			var removeVMs = function(keepFiles) {

				var vms = vboxChooser.getSelectedVMsData();
				
				for(var i = 0; i < vms.length; i++) {
					
					if(vboxVMStates.isPoweredOff(vms[i])) {

						// Remove each selected vm
						vboxAjaxRequest('machineRemove',{'vm':vms[i].id,'delete':(keepFiles ? '0' : '1'),'keep':(keepFiles ? '1' : '0')},
							function(d,vmname,persist){
								// check for progress operation
								if(d && d.progress) {
									vboxProgress({'progress':d.progress,'persist':persist},function(){return;},'progress_delete_90px.png',
											trans('Remove the selected virtual machines', 'UIActionPool'), vmname);
								}
						}, vms[i].name);
						
						
					}
				}				
			};
			
			var buttons = {};
			buttons[trans('Delete all files','UIMessageCenter')] = function(){
				$(this).empty().remove();
				removeVMs(false);
			};
			buttons[trans('Remove only','UIMessageCenter')] = function(){
				$(this).empty().remove();
				removeVMs(true);
			};
			
			
			var vmNames = [];
			var vms = vboxChooser.getSelectedVMsData();
			for(var i = 0; i < vms.length; i++) {
				if(vboxVMStates.isPoweredOff(vms[i])) {
					vmNames[vmNames.length] = vms[i].name;
				}
			}
			
			if(vmNames.length) {

				vmNames = '<b>'+vmNames.join('</b>, <b>')+'</b>';
				var q = trans('<p>You are about to remove following virtual machines from the machine list:</p><p>%1</p><p>Would you like to delete the files containing the virtual machine from your hard disk as well? Doing this will also remove the files containing the machine\'s virtual hard disks if they are not in use by another machine.</p>','UIMessageCenter').replace('%1',vmNames);
				
				vboxConfirm(q,buttons);
				
			}
			
    	
    	},
    	enabled: function () {
    		return (vboxChooser.isSelectedInState('PoweredOff'));
    	}
    },
    
    /** Create a group from VM * */
    group: {
    	label: trans('Group','UIActionPool'),
    	icon: 'add_shared_folder',
    	icon_disabled: 'add_shared_folder_disabled',
    	click: function() {
    		vboxChooser.groupSelectedItems();
    	},
    	enabled: function() {
    		
    		if(!$('#vboxPane').data('vboxSession').admin)
    			return false;
    		
    		if (!vboxChooser || (vboxChooser.getSingleSelectedId() == 'host'))
    			return false;
    		
    		return vboxChooser.isSelectedInState('Editable');
    		
    	}
    },
    
    /** Discard VM State */
    discard: {
		label:trans('Discard saved state...','UIActionPool'),
		icon:'vm_discard',
		icon_16:'discard',
		click:function(){
			
			var buttons = {};
			buttons[trans('Discard','UIMessageCenter')] = function(){
				$(this).empty().remove();

				var vms = vboxChooser.getSelectedVMsData();
				for(var i = 0; i < vms.length; i++) {
					if(vboxVMStates.isSaved(vms[i])) {
						vboxAjaxRequest('machineSetState',{'vm':vms[i].id,'state':'discardSavedState'});
					}
				}
			};
			var vmNames = [];
			var vms = vboxChooser.getSelectedVMsData();
			for(var i = 0; i < vms.length; i++) {
				if(vboxVMStates.isSaved(vms[i])) {
					vmNames[vmNames.length] = vms[i].name;
				}
			}
			
			if(vmNames.length) {

				vmNames = '<b>'+vmNames.join('</b>, <b>')+'</b>';
				
				vboxConfirm(trans('<p>Are you sure you want to discard the saved state of the following virtual machines?</p><p><b>%1</b></p><p>This operation is equivalent to resetting or powering off the machine without doing a proper shutdown of the guest OS.</p>','UIMessageCenter').replace('%1',vmNames),buttons);
			}
		},
		enabled:function(){
			return vboxChooser.isSelectedInState('Saved');
		}
    },
    
    /** Show VM Logs */
    logs: {
		label:trans('Show Log...','UIActionPool'),
		icon:'show_logs',
		icon_disabled:'show_logs_disabled',
		click:function(){
    		vboxShowLogsDialogInit(vboxChooser.getSingleSelected());
		},
		enabled:function(){
			return (vboxChooser && vboxChooser.getSingleSelectedId() != 'host');
		}
    },

    /** Save the current VM State */
	savestate: {
		label: trans('Save the machine state', 'UIVMCloseDialog'),
		icon: 'fd',
		stop_action: true,
		enabled: function(){
			return (vboxChooser.isSelectedInState('Running') || vboxChooser.isSelectedInState('Paused'));
		},
		click: function() {

			var vms = vboxChooser.getSelectedVMsData();
			for(var i = 0; i < vms.length; i++) {
				if(vboxVMStates.isRunning(vms[i]) || vboxVMStates.isPaused(vms[i]))
					vboxVMActions.powerAction('savestate','Save the machine state of the selected virtual machines', vms[i]);
			}
		}
	},

	/** Send ACPI Power Button to VM */
	powerbutton: {
		label: trans('ACPI Shutdown','UIActionPool'),
		icon: 'acpi',
		stop_action: true,
		enabled: function(){
			return vboxChooser.isSelectedInState('Running');
		},
		click: function() {
			var buttons = {};
			buttons[trans('ACPI Shutdown','UIMessageCenter')] = function() {
				$(this).empty().remove();
				var vms = vboxChooser.getSelectedVMsData();
				for(var i = 0; i < vms.length; i++) {
					if(vboxVMStates.isRunning(vms[i]))
						vboxVMActions.powerAction('powerbutton','Send the ACPI Power Button press event to the virtual machine', vms[i]);		
				}
			};
			var vmNames = [];
			var vms = vboxChooser.getSelectedVMsData();
			for(var i = 0; i < vms.length; i++) {
				if(vboxVMStates.isRunning(vms[i])) {
					vmNames[vmNames.length] = vms[i].name;
				}
			}
			
			if(vmNames.length) {

				vmNames = '<b>'+vmNames.join('</b>, <b>')+'</b>';

				vboxConfirm(trans("<p>Do you really want to send an ACPI shutdown signal " +
					"to the following virtual machines?</p><p><b>%1</b></p>",'UIMessageCenter').replace('%1', vmNames),buttons);
			}
		}
	},
	
	/** Pause a running VM */
	pause: {
		label: trans('Pause','UIActionPool'),
		icon: 'pause',
		icon_disabled: 'pause_disabled',
		enabled: function(){
			return vboxChooser.isSelectedInState('Running')
		},
		click: function() {
			var vms = vboxChooser.getSelectedVMsData();
			for(var i = 0; i < vms.length; i++) {
				if(vboxVMStates.isRunning(vms[i]))
					vboxVMActions.powerAction('pause','Suspend the execution of the selected virtual machines', vms[i]);
			}
		}
	},
	
	/** Power off a VM */
	powerdown: {
		label: trans('Power Off','UIActionPool'),
		icon: 'poweroff',
		stop_action: true,
		enabled: function() {
			return (vboxChooser.isSelectedInState('Running') || vboxChooser.isSelectedInState('Paused'));
		},
		click: function() {
			
			var buttons = {};
			buttons[trans('Power Off','UIActionPool')] = function() {
				$(this).empty().remove();
				
				var vms = vboxChooser.getSelectedVMsData();
				for(var i = 0; i < vms.length; i++) {
					if(vboxVMStates.isRunning(vms[i]) || vboxVMStates.isPaused(vms[i]))
						vboxVMActions.powerAction('powerdown','Power off the selected virtual machines', vms[i]);
				}
			};
			
			var vmNames = [];
			var vms = vboxChooser.getSelectedVMsData();
			for(var i = 0; i < vms.length; i++) {
				if(vboxVMStates.isRunning(vms[i]) || vboxVMStates.isPaused(vms[i])) {
					vmNames[vmNames.length] = vms[i].name;
				}
			}
			
			if(vmNames.length) {

				vmNames = '<b>'+vmNames.join('</b>, <b>')+'</b>';
				
				vboxConfirm(trans("<p>Do you really want to power off the following virtual machines?</p>" +
						"<p><b>%1</b></p><p>This will cause any unsaved data in applications " +
						"running inside it to be lost.</p>", 'UIMessageCenter').replace('%1', vmNames), buttons);
			}

		}
	},
	
	/** Reset a VM */
	reset: {
		label: trans('Reset','UIActionPool'),
		icon: 'reset',
		icon_disabled: 'reset_disabled',
		enabled: function(){
			return vboxChooser.isSelectedInState('Running');
		},
		click: function() {
			var buttons = {};
			buttons[trans('Reset','UIActionPool')] = function() {
				$(this).remove();

				var vms = vboxChooser.getSelectedVMsData();
				for(var i = 0; i < vms.length; i++) {
					if(vboxVMStates.isRunning(vms[i]))
						vboxVMActions.powerAction('reset','Reset the selected virtual machines', vms[i]);
				}
			};
			
			var vmNames = [];
			var vms = vboxChooser.getSelectedVMsData();
			for(var i = 0; i < vms.length; i++) {
				if(vboxVMStates.isRunning(vms[i])) {
					vmNames[vmNames.length] = vms[i].name;
				}
			}
			
			if(vmNames.length) {

				vmNames = '<b>'+vmNames.join('</b>, <b>')+'</b>';

				vboxConfirm(trans("<p>Do you really want to reset the following virtual machines?</p><p><b>%1</b></p><p>This will cause any unsaved data in applications "+
						"running inside it to be lost.</p>",'UIMessageCenter').replace('%1',vmNames),buttons);
			}
		}
	},
	
	/** Stop actions list */
	stop_actions: ['savestate','powerbutton','powerdown'],

	/** Stop a VM */
	stop: {
		name: 'stop',
		label: trans('Close','UIActionPool'),
		icon: 'exit',
		menu: true,
		click: function () { return true; /* handled by stop context menu */ },
		enabled: function () {
			return (vboxChooser.isSelectedInState('Running') || vboxChooser.isSelectedInState('Paused'));
		}
	},
	
	/** Power Action Helper function */
	powerAction: function(pa,pt,vm){
		icon =null;
		switch(pa) {
			case 'powerdown': fn = 'powerDown'; icon='progress_poweroff_90px.png'; break;
			case 'powerbutton': fn = 'powerButton'; break;
			case 'savestate': fn = 'saveState'; icon='progress_state_save_90px.png'; break;
			case 'pause': fn = 'pause'; break;
			case 'reset': fn = 'reset'; break;
			default: return;
		}
		vboxAjaxRequest('machineSetState',{'vm':vm.id,'state':fn},function(d,xtra,persist){
			// check for progress operation
			if(d && d.progress) {
				vboxProgress({'progress':d.progress,'persist':persist},function(){
					return;
				},icon,trans(pt,'UIActionPool'), vm.name);
				return;
			}
		});		
		
	}
};


/**
 * Common Media functions object
 * 
 * @namespace vboxMedia
 */
var vboxMedia = {

	/**
	 * Return a printable string for medium m
	 * 
	 * @static
	 */
	mediumPrint : function(m,nosize,usehtml) {
		var name = vboxMedia.getName(m);
		if(nosize || !m || m.hostDrive) return name;
		return name + ' (' + (m.deviceType == 'HardDisk' ? (usehtml ? '<i>' : '') + trans(m.type,'VBoxGlobal') + (usehtml ? '</i>' : '') + ', ' : '') + vboxMbytesConvert(m.logicalSize) + ')';
	},

	/**
	 * Return printable medium name
	 * 
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
	 * 
	 * @static
	 */
	getType : function(m) {
		if(!m || !m.type) return trans('Normal','VBoxGlobal');
		if(m.type == 'Normal' && m.base && m.base != m.id) return trans('Differencing','VBoxGlobal');
		return trans(m.type,'VBoxGlobal');
	},
	
	/**
	 * Return printable medium format
	 * 
	 * @static
	 */
	getFormat : function (m) {
		if(!m) return '';
		switch(m.format.toLowerCase()) {
			case 'vdi':
				return trans('VDI (VirtualBox Disk Image)','UIWizardNewVD');
			case 'vmdk':
				return trans('VMDK (Virtual Machine Disk)','UIWizardNewVD');
			case 'vhd':
				return trans('VHD (Virtual Hard Disk)','UIWizardNewVD');
			case 'parallels':
			case 'hdd':
				return trans('HDD (Parallels Hard Disk)','UIWizardNewVD');
			case 'qed':
				return trans('QED (QEMU enhanced disk)','UIWizardNewVD');
			case 'qcow':
				return trans('QCOW (QEMU Copy-On-Write)','UIWizardNewVD');
		}	
		return m.format;
	},
	
	/**
	 * Return printable virtual hard disk variant
	 * 
	 * @static
	 */
	getHardDiskVariant : function(m) {
		
		var variants = $('#vboxPane').data('vboxMediumVariants');
		
		
/*
 * [Standard] => 0 [VmdkSplit2G] => 1 [VmdkRawDisk] => 2 [VmdkStreamOptimized] =>
 * 4 [VmdkESX] => 8 [Fixed] => 65536 [Diff] => 131072 [NoCreateDir] =>
 * 1073741824
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
	 * 
	 * @static
	 */
	mediaForAttachmentType : function(t,children) {
	
		var media = new Array();
		
		// DVD Drives
		if(t == 'DVD') { media = media.concat($('#vboxPane').data('vboxHostDetails').DVDDrives);
		// Floppy Drives
		} else if(t == 'Floppy') { 
			media = media.concat($('#vboxPane').data('vboxHostDetails').floppyDrives);
		}
		
		// media
		return media.concat(vboxTraverse($('#vboxPane').data('vboxMedia'),'deviceType',t,true,(children ? 'children' : '')));
	},

	/**
	 * Return a medium by its location
	 * 
	 * @static
	 */
	getMediumByLocation : function(p) {		
		return vboxTraverse($('#vboxPane').data('vboxMedia'),'location',p,false,'children');
	},

	/**
	 * Return a medium by its ID
	 * 
	 * @static
	 */
	getMediumById : function(id) {
		return vboxTraverse($('#vboxPane').data('vboxMedia').concat($('#vboxPane').data('vboxHostDetails').DVDDrives.concat($('#vboxPane').data('vboxHostDetails').floppyDrives)),'id',id,false,'children');
	},

	/**
	 * Return a printable list of machines and snapshots this a medium is
	 * attached to
	 * 
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
	 * 
	 * @static
	 */
	updateRecent : function(m, skipPathAdd) {
		
		// Only valid media that is not a host drive or iSCSI
		if(!m || !m.location || m.hostDrive || m.format == 'iSCSI') return false;
		
	    // Update recent path
		if(!skipPathAdd) {
			vboxAjaxRequest('vboxRecentMediaPathSave',{'type':m.deviceType,'folder':vboxDirname(m.location)},function(){});
			$('#vboxPane').data('vboxRecentMediaPaths')[m.deviceType] = vboxDirname(m.location);
		}
		
		// Update recent media
		// ///////////////////////
		
		// find position (if any) in current list
		var pos = jQuery.inArray(m.location,$('#vboxPane').data('vboxRecentMedia')[m.deviceType]);		
		
		// Medium is already at first position, return
		if(pos == 0) return false;
		
		// Exists and not in position 0, remove from list
		if(pos > 0) {
			$('#vboxPane').data('vboxRecentMedia')[m.deviceType].splice(pos,1);
		}
		
		// Add to list
		$('#vboxPane').data('vboxRecentMedia')[m.deviceType].splice(0,0,m.location);
		
		// Pop() until list only contains 5 items
		while($('#vboxPane').data('vboxRecentMedia')[m.deviceType].length > 5) {
			$('#vboxPane').data('vboxRecentMedia')[m.deviceType].pop();
		}

		// Update Recent Media in background
		vboxAjaxRequest('vboxRecentMediaSave',{'type':m.deviceType,'list':$('#vboxPane').data('vboxRecentMedia')[m.deviceType]},function(){});
		
		return true;

	},
	
	/**
	 * List of actions performed on Media in phpVirtualBox
	 * 
	 * @static
	 * @namespace
	 */
	actions : {
		
		/**
		 * Choose existing medium file
		 * 
		 * @static
		 */
		choose : function(path,type,callback) {
		
			if(!path) path = $('#vboxPane').data('vboxRecentMediaPaths')[type];

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
							l.add('vboxGetMedia',function(dret){$('#vboxPane').data('vboxMedia',dret);});
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
 * 
 * @class vboxWizard
 * @constructor
 * @param {String}
 *            name - name of wizard
 * @param {String}
 *            title - title of wizard dialog window
 * @param {String}
 *            bg - optional URL to background image to use
 * @param {String}
 *            icon - optional URL to icon to use on dialog
 */
function vboxWizard(name, title, bg, icon) {
	
	var self = this;

	this.steps = 0;
	this.name = name;
	this.title = title;
	this.finish = null;
	this.width = 700;
	this.height = 400;
	this.widthAdvanced = 600;
	this.heightAdvanced = 450;
	this.bg = bg;
	this.backText = trans('Back','QIArrowSplitter');
	this.nextText = trans('Next','QIArrowSplitter');
	this.cancelText = trans('Cancel','QIMessageBox');
	this.finishText = 'Finish';
	this.context = '';
	this.perPageContext = '';
	this.backArrow = $('<div />').html('&laquo;').text();
	this.nextArrow = $('<div />').html('&raquo;').text();
	this.mode = 'simple';
	this.validate = function(){
		return true;
	};
	
	/**
	 * Initialize / display wizard
	 * 
	 * @memberOf vboxWizard
	 * @name vboxWizard.run
	 */
	self.run = function() {

		// Set mode
		self.mode = (vboxGetLocalDataItem('vboxWizardMode'+self.name) == 'a' ? 'advanced' : '');
		
		var d = $('<div />').attr({'id':self.name+'Dialog','style':'display: none','class':'vboxWizard'});
		
		var f = $('<form />').attr({'name':('frm'+self.name),'onSubmit':'return false;','style':'height:100%;margin:0px;padding:0px;border:0px;'});

		// main table
		var tbl = $('<table />').attr({'class':'vboxWizard','style':'height: 100%; margin:0px; padding:0px;border:0px;'});
		var tr = $('<tr />');

		
		var td = $('<td />').attr({'id':self.name+'Content','class':'vboxWizardContent'});
		
		if(self.bg) {
			$(d).css({'background':'url('+self.bg+') ' + ((self.mode == 'advanced' ? self.widthAdvanced : self.width) - 360) +'px -60px no-repeat','background-color':'#fff'});				
		}
		
		// Title and content table
		$('<h3 />').attr('id',self.name+'Title').html(self.title).appendTo(td);

		$(tr).append(td).appendTo(tbl);		
		
		f.append(tbl);
		d.append(f);
		
		$('#vboxPane').append(d);
				
		// load panes
		var l = new vboxLoader();
		l.addFileToDOM('panes/'+self.name+(self.mode == 'advanced' ? 'Advanced' : '')+'.html',$('#'+self.name+'Content'));
		
		l.onLoad = function(){
		
			// Opera hidden select box bug
			// //////////////////////////////
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
			if(!self.stepButtons) self.stepButtons = [];
			self.stepButtons = jQuery.merge([{
					
					name: trans((self.mode == 'advanced' ? 'Show Description' : 'Hide Description'), 'UIWizard'),
					click: function() {
				
						// Unbind any old resize handlers
						$('#'+self.name+'Dialog').unbind('dialogresizestop');
						
						// Check mode
						if(self.mode != 'advanced') {
							
							// Now in advanced mode
							self.mode = 'advanced';
							
							// Hide title, remove current content and add
							// advanced content
							$('#'+self.name+'Title').hide().siblings().empty().remove();
							
							// Hold old number of steps
							self.simpleSteps = self.steps;
							
							// resize dialog
							$('#'+self.name+'Dialog').dialog('option', 'width', self.widthAdvanced)
								.dialog('option', 'height', self.heightAdvanced)
								.css({'background':'url('+self.bg+') ' + ((self.mode == 'advanced' ? self.widthAdvanced : self.width) - 360) +'px -60px no-repeat','background-color':'#fff'});
						

							
							var vl = new vboxLoader();
							vl.addFileToDOM('panes/'+self.name+'Advanced.html',$('#'+self.name+'Content'));
							vl.onLoad = function() {
								
								// Change this button text
								$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+trans('Hide Description', 'UIWizard')+'")')
									.html(trans('Show Description', 'UIWizard'));
								
								for(var i = 0; i < self.stepButtons.length; i++) {
									if(self.stepButtons[i].name == trans('Hide Description', 'UIWizard')) {
										self.stepButtons[i].name = trans('Show Description', 'UIWizard');
									}
										
								}
								
								// Hide back button
								$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+self.backArrow + ' '+self.backText+'")').parent().hide();
								
								// Translations and setup
								vboxInitDisplay(self.name+'Content',self.context);
								
								self.steps = 1;
								
								// Go to last step
								self.displayStep(1);
							};
							vl.run();
							
						} else {
							
							// Now in simple mode
							self.mode = 'simple';
							
							// Remove current content and show simple content
							$('#'+self.name+'Title').show().siblings().empty().remove();
							
							// resize dialog
							$('#'+self.name+'Dialog').dialog('option', 'width', self.width)
								.dialog('option', 'height', self.height)
								.css({'background':'url('+self.bg+') ' + ((self.mode == 'advanced' ? self.widthAdvanced : self.width) - 360) +'px -60px no-repeat','background-color':'#fff'});

							
							// Reset old number of steps
							self.steps = self.simpleSteps;
							
							var vl = new vboxLoader();
							vl.addFileToDOM('panes/'+self.name+'.html',$('#'+self.name+'Content'));
							vl.onLoad = function() {
								
								// Change this button text
								$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane')
									.find('span:contains("'+trans('Show Description', 'UIWizard')+'")')
									.html(trans('Hide Description', 'UIWizard'));

								for(var i = 0; i < self.stepButtons.length; i++) {
									if(self.stepButtons[i].name == trans('Show Description', 'UIWizard')) {
										self.stepButtons[i].name = trans('Hide Description', 'UIWizard');
									}
										
								}

								// Translations
								if(self.perPageContext) {
									for(var s = 1; s <= self.steps; s++) {
										vboxInitDisplay($('#'+self.name+'Step'+s),self.perPageContext.replace('%1',s));
									}									
								} else {
									vboxInitDisplay(self.name+'Content',self.context);
								}

								// Show back button
								$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+self.backArrow + ' '+self.backText+'")').parent().show();
								
								self.steps = self.simpleSteps;
								
								self.displayStep(1);
								
							};
							vl.run();
						}

						vboxSetLocalDataItem('vboxWizardMode'+self.name, (self.mode == 'advanced' ? 'a' : ''));
						
					
				},
				steps: [1]
			}], self.stepButtons);
			
			
			// buttons
			var buttons = { };
			
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
			
			
			$(d).dialog({
				'closeOnEscape':true,
				'width':(self.mode == 'advanced' ? self.widthAdvanced : self.width),
				'height':(self.mode == 'advanced' ? self.heightAdvanced : self.height),
				'buttons':buttons,
				'modal':true,
				'autoOpen':true,
				'stack':true,
				'dialogClass':'vboxDialogContent vboxWizard',
				'title':(icon ? '<img src="images/vbox/'+icon+'_16px.png" class="vboxDialogTitleIcon" /> ' : '') + self.title
			});

			// Setup if in advanced mode
			if(self.mode == 'advanced') {
			
				// Hold old number of steps
				self.simpleSteps = self.steps;
				self.steps = 1;
				
				// Hide title
				$('#'+self.name+'Title').hide();
				
				// Hide back button
				$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+self.backArrow + ' '+self.backText+'")').parent().hide();
			}
			
			self.displayStep(1);
		};
		l.run();
				
	};
	
	/**
	 * Close wizard
	 * 
	 * @memberOf vboxWizard
	 */
	self.close = function() {
		$('#'+self.name+'Dialog').trigger('close').empty().remove();
	};
	
	/**
	 * Display a step
	 * 
	 * @memberOf vboxWizard
	 * @param {Integer}
	 *            step - step to display
	 */
	self.displayStep = function(step) {
		self._curStep = step;
		for(var i = 0; i < self.steps; i++) {
			$('#'+self.name+'Step'+(i+1)).css({'display':'none'});
		}
		/* update buttons */
		if(self.stepButtons) {
			for(var i = 0; i < self.stepButtons.length; i++) {
				$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+self.stepButtons[i].name+'")').parent().css({'display':((step == self.steps && self.stepButtons[i].steps[0]==-1) || jQuery.inArray(step,self.stepButtons[i].steps) > -1 ? '' : 'none')});
			}
		}
		if(step == 1 && step != self.steps) {
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
		// //////////////////////////////
		if($.browser.opera) {
			$('#'+self.name+'Step'+step).find('select').trigger('show');
		}

		$('#'+self.name+'Step'+step).trigger('show',self);

	};
	
	/**
	 * Set current wizard step to be the last step in list
	 * 
	 * @memberOf vboxWizard
	 */
	self.setLast = function() {
		$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+self.nextText+'")').html($('<div />').text(self.finishText).html());
		self._origSteps = self.steps;
		self.steps = self._curStep;
	};

	/**
	 * Unset the current wizard step so that it is not forced to be the last one
	 * in the list
	 * 
	 * @memberOf vboxWizard
	 */
	self.unsetLast = function() {
		$('#'+self.name+'Dialog').parent().find('.ui-dialog-buttonpane').find('span:contains("'+self.finishText+'")').html($('<div />').text(self.nextText+' '+self.nextArrow).html());
		if(self._origSteps) self.steps = self._origSteps;
	};
	
	/**
	 * Display previous step
	 * 
	 * @memberOf vboxWizard
	 */
	self.displayPrev = function() {
		if(self._curStep <= 1) return;
		self.displayStep(self._curStep - 1);
	};
	
	/**
	 * Display next step
	 * 
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
 * 
 * @constructor
 * @class vboxToolbar
 * @param {Array}
 *            buttons - buttons to add to toolbar
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
	 * 
	 * @memberOf vboxToolbar
	 * @param {Object|Null}
	 *            item - item to check
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
	 * 
	 * @memberOf vboxToolbar
	 * @param {Object}
	 *            e - event
	 * @param {Object}
	 *            item - item to pass to update
	 */ 
	self.enable = function(e, item) {
		self.enabled = true;
		self.update((item||self.lastItem));
	};

	/**
	 * Disable entire toolbar
	 * 
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
	 * 
	 * @memberOf vboxToolbar
	 * @param {Object}
	 *            b - button to enable
	 */
	self.enableButton = function(b) {
		$('#vboxToolbarButton-'+self.id+'-'+b.name).addClass('vboxEnabled').removeClass('vboxDisabled').children('img.vboxToolbarImg').attr('src','images/vbox/'+b.icon+'_'+self.size+'px.png');
	};

	/**
	 * Disable a single button
	 * 
	 * @memberOf vboxToolbar
	 * @param {Object}
	 *            b - button to disable
	 */
	self.disableButton = function(b) {
		$('#vboxToolbarButton-'+self.id+'-'+b.name).addClass('vboxDisabled').removeClass('vboxEnabled').children('img.vboxToolbarImg').attr('src','images/vbox/'+b.icon+'_disabled_'+self.size+'px.png');
	};

	/**
	 * Set button label
	 * 
	 * @memberOf vboxToolbar
	 * @param {String}
	 *            bname - name of button to set label for
	 * @param {String}
	 *            l - new label for button
	 */
	self.setButtonLabel = function(bname,l) {
		$('#vboxToolbarButton-'+self.id+'-'+bname).find('span.vboxToolbarButtonLabel').html(l);
	};
	
	/**
	 * Return the button element by name
	 * 
	 * @param {String}
	 *            bname - button name
	 * @returns {HTMLNode}
	 */
	self.getButtonElement = function(bname) {
		return $('#vboxToolbarButton-'+self.id+'-'+bname);
	}
	/**
	 * Generate HTML element for button
	 * 
	 * @memberOf vboxToolbar
	 * @param {Object}
	 *            b - button object containing various button parameters
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
		}).html('<img src="images/vbox/'+b.icon+'_'+self.size+'px.png" class="vboxToolbarImg" style="height:'+self.size+'px;width:'+self.size+'px;"/><br /><span class="vboxToolbarButtonLabel">' + String(b.toolbar_label ? b.toolbar_label : b.label).replace(/\.+$/g,'')+'</span>').bind('click',function(){
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
	 * 
	 * @memberOf vboxToolbar
	 * @param {String}
	 *            id - HTMLNode id to add buttons to
	 */
	self.addButtons = function(id) {
		
		self.id = id;
		self.height = self.size + self.addHeight; 
		
		// Create table
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
	 * 
	 * @memberOf vboxToolbar
	 * @param {String}
	 *            n - button name
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
	 * 
	 * @memberOf vboxToolbar
	 * @param {String}
	 *            btn - name of button
	 * @return return value of .click() function performed on button
	 */
	self.click = function(btn) {
		var b = self.getButtonByName(btn);
		return b.click(btn);
	};
		
}

/**
 * Toolbar class for a small toolbar
 * 
 * @constructor
 * @class vboxToolbarSmall
 * @super vboxToolbar
 * @param {Array}
 *            buttons - list of buttons for toolbar
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
	 * 
	 * @memberOf vboxToolbarSmall
	 * @param {Object}
	 *            b - button to enable
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
	 * 
	 * @memberOf vboxToolbarSmall
	 * @param {Object}
	 *            b - button to disable
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
	 * 
	 * @param {String}
	 *            b button name
	 * @param {Object}
	 *            css css to be applied to button
	 */
	self.addButtonCSS = function(b, css) {
		self.buttonCSS[b] = css;
	};
	
	/**
	 * Generate HTML element for button
	 * 
	 * @memberOf vboxToolbarSmall
	 * @param {Object}
	 *            b - button object containing various button parameters
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
			'title':String(b.toolbar_label ? b.toolbar_label : b.label).replace(/\.+$/g,''),
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
	 * 
	 * @memberOf vboxToolbarSmall
	 * @param {String}
	 *            id - HTMLNode id to add buttons to
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
 * 
 * @constructor
 * @class vboxButtonMediaMenu
 * @param {String}
 *            type - type of media to display
 * @param {Function}
 *            callback - callback to run when media is selected
 * @param {String}
 *            mediumPath - path to use when selecting media
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
			label : trans('Set up the virtual hard disk','UIMachineSettingsStorage'),
			icon : 'hd',
			click : function () {
				return;				
			}
		},
		
		DVD : {
			name : 'mselectcdbtn',
			label : trans('Set up the virtual CD/DVD drive','UIMachineSettingsStorage'),
			icon : 'cd',
			click : function () {
				return;				
			}
		},
	
		Floppy : {
			name : 'mselectfdbtn',
			label : trans('Set up the virtual floppy drive','UIMachineSettingsStorage'),
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
	 * 
	 * @memberOf vboxButtonMediaMenu
	 * @param {Object|Null}
	 *            target - item to test in button's enabled() fuction
	 * @param {Object|Null}
	 *            item - item to test in button's enabled() fuction
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
	 * 
	 * @memberOf vboxButtonMediaMenu
	 * @return null
	 */
	self.enableButton = function() {
		var b = self.button;
		$('#vboxButtonMenuButton-' + self.id + '-' + b.name).css('background-image','url(images/vbox/' + b.icon + '_'+self.size+'px.png)').removeClass('vboxDisabled').html('<img src="images/downArrow.png" style="margin:0px;padding:0px;float:right;width:6px;height:6px;" />');
	};
	/**
	 * Disable this button
	 * 
	 * @memberOf vboxButtonMediaMenu
	 * @return null
	 */
	self.disableButton = function() {
		var b = self.button;
		$('#vboxButtonMenuButton-' + self.id + '-' + b.name).css('background-image','url(images/vbox/' + b.icon + '_'+self.disabledString+'_'+self.size+'px.png)').removeClass('vboxToolbarSmallButtonHover').addClass('vboxDisabled').html('');
	};

	/**
	 * Enable button and menu
	 * 
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
	 * 
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
	 * 
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
			'title':b.label,
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
	 * 
	 * @memberOf vboxButtonMediaMenu
	 * @return {Object} jQuery object containing button element
	 */
	self.getButtonElm = function () {
		return $('#vboxButtonMenuButton-' + self.id + '-' + self.button.name);
	};

	/**
	 * Add button to element with id
	 * 
	 * @memberOf vboxButtonMediaMenu
	 * @param {String}
	 *            id - HTMLNode id to add button to
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
	 * 
	 * @memberOf vboxButtonMediaMenu
	 * @param {Boolean}
	 *            enabled - whether the item should be enabled or not
	 */
	self.menuUpdateRemoveMedia = function(enabled) {
		self.mediaMenu.menuUpdateRemoveMedia(enabled);
	};
}

/**
 * Media menu class
 * 
 * @constructor
 * @class vboxMediaMenu
 * @param {String}
 *            type - type of media to display
 * @param {Function}
 *            callback - callback function to run when medium is selected
 * @param {String}
 *            mediumPath - path to use when selecting media
 */
function vboxMediaMenu(type,callback,mediumPath) {

	var self = this;
	self.type = type;
	self.callback = callback;
	self.mediumPath = mediumPath;
	self.removeEnabled = true;
	
	/**
	 * Generate menu element ID
	 * 
	 * @memberOf vboxMediaMenu
	 * @return {String} string to use for menu node id
	 */
	self.menu_id = function(){
		return 'vboxMediaListMenu'+self.type;
	};
		
	/**
	 * Generate menu element
	 * 
	 * @memberOf vboxMediaMenu
	 * @return {HTMLNode} menu element
	 */
	self.menuElement = function() {
		
		// Pointer already held
		if(self._menuElm) return self._menuElm;
		
		var id = self.menu_id();
		
		// Hold pointer
		self._menu = new vboxMenu(id,id);
		
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
	 * 
	 * @memberOf vboxMediaMenu
	 * @return {Array} array of objects that can be added to menu
	 */
	self.menuGetDrives = function() {
		
		var menu = [];
		
		// Add host drives
		var meds = vboxMedia.mediaForAttachmentType(self.type);
		for(var i =0; i < meds.length; i++) {
			if(!meds[i].hostDrive) continue;
			menu[menu.length] = {'name':meds[i].id,'label':vboxMedia.getName(meds[i])};
		}
		
		return menu;
		
	};
	
	
	/**
	 * List of default menu items to use for media of type self.type
	 * 
	 * @memberOf vboxMediaMenu
	 * @return {Array} List of default menu items to use for media of type
	 *         self.type
	 */
	self.menuGetDefaults = function () {
		
		menus = [];
		
		switch(self.type) {
			
			// HardDisk defaults
			case 'HardDisk':
		
				// create hard disk
				menus[menus.length] = {'name':'createD','icon':'hd_new','label':trans('Create a new hard disk...','UIMachineSettingsStorage')};

				// choose hard disk
				menus[menus.length] = {'name':'chooseD','icon':'select_file','label':trans('Choose a virtual hard disk file...','UIMachineSettingsStorage')};
				
				// Add VMM?
				if($('#vboxPane').data('vboxConfig').enableAdvancedConfig) {
					menus[menus.length] = {'name':'vmm','icon':'diskimage','label':trans('Virtual Media Manager...','UIActionPool')};
				}

				// recent list place holder
				menus[menus.length] = {'name':'vboxMediumRecentBefore','cssClass':'vboxMediumRecentBefore','enabled':function(){return false;},'hide_on_disabled':true};
								
				break;
				
			// CD/DVD Defaults
			case 'DVD':
				
				// Choose disk image
				menus[menus.length] = {'name':'chooseD','icon':'select_file','label':trans('Choose a virtual CD/DVD disk file...','UIMachineSettingsStorage')};

				// Add VMM?
				if($('#vboxPane').data('vboxConfig').enableAdvancedConfig) {
					menus[menus.length] = {'name':'vmm','icon':'diskimage','label':trans('Virtual Media Manager...','UIActionPool')};
				}
				
				// Add host drives
				menus = menus.concat(self.menuGetDrives());
								
				// Add remove drive
				menus[menus.length] = {'name':'removeD','icon':'cd_unmount','cssClass':'vboxMediumRecentBefore',
						'label':trans('Remove disk from virtual drive','UIMachineSettingsStorage'),'separator':true,
						'enabled':function(){return self.removeEnabled;}};

				break;
			
			// Floppy defaults
			default:

				// Choose disk image
				menus[menus.length] = {'name':'chooseD','icon':'select_file','label':trans('Choose a virtual floppy disk file...','UIMachineSettingsStorage')};

				// Add VMM?
				if($('#vboxPane').data('vboxConfig').enableAdvancedConfig) {
					menus[menus.length] = {'name':'vmm','icon':'diskimage','label':trans('Virtual Media Manager...','UIActionPool')};
				}
				
				// Add host drives
				menus = menus.concat(self.menuGetDrives());

				// Add remove drive
				menus[menus.length] = {'name':'removeD','icon':'fd_unmount','cssClass':'vboxMediumRecentBefore',
						'label':trans('Remove disk from virtual drive','UIMachineSettingsStorage'),'separator':true,
						'enabled':function(){return self.removeEnabled;}};

				break;
								
		}
		
		return menus;
		
	};

	/**
	 * Update "recent" media list menu items
	 * 
	 * @memberOf vboxMediaMenu
	 */
	self.menuUpdateRecent = function() {
		
		var elm = $('#'+self.menu_id());
		var list = $('#vboxPane').data('vboxRecentMedia')[self.type];
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
	 * 
	 * @memberOf vboxMediaMenu
	 * @param {Boolean}
	 *            enabled - whether the item should be enabled or not
	 * @return null
	 */
	self.menuUpdateRemoveMedia = function(enabled) {
		self.removeEnabled = (enabled ? true : false);
		if(!self._menu) self.menuElement();
		else self._menu.update();
	};
	
	/**
	 * Update recent media menu and global recent media list
	 * 
	 * @memberOf vboxMediaMenu
	 * @param {Object}
	 *            m - medium object
	 * @param {Boolean}
	 *            skipPathAdd - don't add medium's path to vbox's list of recent
	 *            media paths
	 */
	self.updateRecent = function(m, skipPathAdd) {
		
		if(vboxMedia.updateRecent(m, skipPathAdd)) { // returns true if
														// recent media list has
														// changed
			// Update menu
			self.menuUpdateRecent();
		}
	};
	
	/**
	 * Function called when menu item is selected
	 * 
	 * @memberOf vboxMediaMenu
	 * @param {String}
	 *            action - menu item's href value (text in a href="#...")
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
				},{'path':(self.mediumPath ? self.mediumPath : $('#vboxPane').data('vboxRecentMediaPaths')[self.type])+$('#vboxPane').data('vboxConfig').DSEP}); 				
				break;
			
			// VMM
			case 'vmm':
				// vboxVMMDialogInit(callback,type,hideDiff,mPath)
				vboxVMMDialogInit(function(m){
					if(m) {
						self.callback(vboxMedia.getMediumById(m));
						self.menuUpdateRecent();
					}
				},self.type,true,(self.mediumPath ? self.mediumPath : $('#vboxPane').data('vboxRecentMediaPaths')[self.type]));
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
 * Menu class for use with context or button menus
 * 
 * @constructor
 * @class vboxMenu
 * @param {String}
 *            name - name of menu
 * @param {String}
 *            id - optional HTMLNode id of menu to use
 * @param {Array}
 * 			  menuItems - list of menu items to add
 */
function vboxMenu(name, id, menuItems) {

	var self = this;
	
	self.name = name;
	self.menuItems = {};
	self.iconStringDisabled = '_dis';
	self.id = id;
		
	/**
	 * return menu id
	 * 
	 * @memberOf vboxMenu
	 * @return {String} the HTMLNode id of this menu
	 */
	self.menuId = function() {
		if(self.id) return self.id;
		return self.name + 'Menu';
	};
	
	/**
	 * Add menu to menu object
	 * 
	 * @memberOf vboxMenu
	 * @param {Object}
	 *            m - menu configuration object
	 */
	self.addMenu = function(m) {
		$('#vboxPane').append(self.menuElement(m,self.menuId()));
	};

	/**
	 * Traverse menu configuration object and generate a
	 * <UL>
	 * containing menu items
	 * 
	 * @memberOf vboxMenu
	 * @param {Object}
	 *            m - menu configuration object
	 * @param {String}
	 *            mid - the optional id to use for the generated HTMLNode
	 * @return {HTMLNode} menu
	 *         <UL>
	 *         node containing menu items and submenus
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
	 * 
	 * @memberOf vboxMenu
	 * @param {Integer}
	 *            i - menu item index number
	 * @param {Object}
	 *            item - optional selected item
	 * @return return value of menu item's click() function
	 */
	self.menuClickCallback = function(i, item) {
		return self.menuItems[i].click(item);
	};
	
	/**
	 * generate menu item HTML
	 * 
	 * @memberOf vboxMenu
	 * @param {Object}
	 *            i - menu item's configuration object
	 * @return {HTMLNode}
	 *         <li> containing menu item
	 */
	self.menuItem = function(i) {

		return $('<li />').addClass((i.separator ? 'separator' : '')).addClass((i.cssClass ? i.cssClass : '')).append($('<a />')
			.html(i.label)
			.attr({
				'style' : (i.icon ? 'background-image: url('+self.menuIcon(i,false)+')' : ''),
				'id': self.name+i.name,'href':'#'+i.name
			}));		
		
	};
	
	/**
	 * Return a URL to use for menu item's icon
	 * 
	 * @memberOf vboxMenu
	 * @param {Object}
	 *            i - menu item configuration object
	 * @param {Boolean}
	 *            disabled - whether or not the icon should be disabled
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
	 * 
	 * @memberOf vboxMenu
	 * @param {Object}
	 *            testObj - object used to test for enabled()
	 * @return null
	 */
	self.update = function(testObj) {
		
		for(var i in self.menuItems) {
			
			
			if(typeof i != 'string') continue;
			
			
			// If enabled function doesn't exist, there's nothing to do
			if(!self.menuItems[i].enabled) continue;
			
			var mi = $('#'+self.name+i);
			
			// Disabled
			if(!self.menuItems[i].enabled(testObj)) {
				
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
	 * 
	 * @memberOf vboxMenu
	 * @param {String}
	 *            i - menu item's name
	 * @param {Object}
	 *            mi - optional menu item HTMLNode or jQuery object
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
	 * 
	 * @memberOf vboxMenu
	 * @param {String}
	 *            i - menu item's name
	 * @param {Object}
	 *            mi - optional menu item HTMLNode or jQuery object
	 */	
	self.enableItem = function(i, mi) {
		if(!mi) mi = $('#'+self.name+i);
		if(self.menuItems[i].icon)
			mi.css({'background-image':'url('+self.menuIcon(self.menuItems[i],false)+')'}).parent().removeClass('disabled');
		else
			mi.parent().removeClass('disabled');		
	};
	
	
	// Just add menu items if there were passed
	if(menuItems) self.addMenu(menuItems);

}

/**
 * Menu bar class
 * 
 * @constructor
 * @class vboxMenuBar
 * @param {String}
 *            name - name of this menu bar
 */
function vboxMenuBar(name) {
	
	var self = this;
	this.name = name;
	this.menus = new Array();
	this.menuClick = {};
	this.iconStringDisabled = '_dis';
	
	/**
	 * Add a menu to this object
	 * 
	 * @memberOf vboxMenuBar
	 * @param {Object}
	 *            m - menu configuration object
	 * @return void
	 */
	self.addMenu = function(m) {
		
		// Create menu object
		m.menuObj = new vboxMenu(m.name);
		
		// Propagate config
		m.menuObj.iconStringDisabled = self.iconStringDisabled;
		
		// Add menu
		m.menuObj.addMenu(m.menu);
		self.menus[self.menus.length] = m;
				
	};

	/**
	 * Add menu bar to element identified by ID
	 * 
	 * @memberOf vboxMenuBar
	 * @param {String}
	 *            id - HTMLNode id of node to add menu bar to
	 */
	self.addMenuBar = function(id) {
		
		$('#'+id).prepend($('<div />').attr({'class':'vboxMenuBar','id':self.name+'MenuBar'}));
		
		for(var i = 0; i < self.menus.length; i++) {
			$('#'+self.name+'MenuBar').append(
					$('<span />').attr({'id':'vboxMenuBarMenu'+self.name+self.menus[i].name}).html(self.menus[i].label)
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
	};
	
	
	/**
	 * Update Menu items
	 * 
	 * @memberOf vboxMenuBar
	 * @param {Object}
	 *            item - item to use in menu configuration items' update() test
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
 * Loads data, scripts, and HTML files and optionally displays "Loading ..."
 * screen until all items have completed loading
 * 
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
	
	this._data = [];
	this._files = [];
	
	/**
	 * Add data item to list of items to load
	 * 
	 * @memberOf vboxLoader
	 * @param {String}
	 *            dataFunction - function to pass to vboxAjaxRequest()
	 * @param {Function}
	 *            callback - callback to run when data is returned
	 * @param {Object}
	 *            params - params to pass to vboxAjaxRequest()
	 * @see vboxAjaxRequest()
	 */
	self.add = function(dataFunction, callback, params) {
		if (params === undefined) params = {};
		this._data[this._data.length] = vboxAjaxRequest(dataFunction,params,callback);
	};

	/**
	 * Add file to list of items to load
	 * 
	 * @memberOf vboxLoader
	 * @param {String}
	 *            file - URL of file to load
	 * @param {Function}
	 *            callback - callback to run when file is loaded
	 * @see vboxAjaxRequest()
	 */
	self.addFile = function(file,callback) {
		this._files[this._files.length] = {
				'callback' : callback,
				'file' : file,
			};		
	};

	/**
	 * Add file to list of items to load. Append resulting file to element.
	 * 
	 * @memberOf vboxLoader
	 * @param {String}
	 *            file - URL of file to load
	 * @param {jQueryObject}
	 *            elm - element to append file to
	 */
	self.addFileToDOM = function(file,elm) {
		if(elm === undefined) elm = $('body').children('div').first();
		var callback = function(f){elm.append(f);};
		self.addFile(file,callback);
	};
	
	/**
	 * Show loading screen
	 * 
	 */
	self.showLoading = function() {
		
		var div = $('<div />').attr({'id':'vboxLoaderDialog','title':'','style':'display: none;','class':'vboxDialogContent'});
		
		var tbl = $('<table />');
		var tr = $('<tr />');

		$('<td />').attr('class', 'vboxLoaderSpinner').html('<img src="images/spinner.gif" />').appendTo(tr);
		
		$('<td />').attr('class','vboxLoaderText').html(trans('Loading ...','UIVMDesktop')).appendTo(tr);

		$(tbl).append(tr).appendTo(div);
		
		if(self.hideRoot)
			$('#vboxPane').css('display', 'none');

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

	};
	
	/**
	 * Hide loading screen
	 */
	self.removeLoading = function() {
		$('#vboxLoaderDialog').empty().remove();
	};
	
	/**
	 * Load data and optionally present "Loading..." screen
	 * 
	 * @memberOf vboxLoader
	 * @return null
	 */
	self.run = function() {

		if(!self.noLoadingScreen) {
			self.showLoading();
		}
		
		// Data first
		$.when.apply(null, self._data).then(function() {
			
			// files
			for(var i = 0; i < self._files.length; i++) {
				self._files[i] = jQuery.get(self._files[i]['file'],self._files[i]['callback']);
			}
			
			$.when.apply(null, self._files).then(function() {
				self._stop();
			});
				
		});
		
	};
	
	/**
	 * Remove loading screen and show body
	 * 
	 * @memberOf vboxLoader
	 */
	self._stop = function() {

		if(self.onLoad) self.onLoad(self);

		if(!self.noLoadingScreen) self.removeLoading();
		
		if(self.hideRoot) $('#vboxPane').css('display', '');
		
		if(self.onShow) self.onShow();
	};

}

/**
 * Serial port object
 * 
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
	 * 
	 * @param {Integer}
	 *            irq - irq number
	 * @param {String}
	 *            port - IO port
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
 * 
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
	 * @param {Integer}
	 *            irq - irq number
	 * @param {String}
	 *            port - IO port
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
 * 
 * @namespace vboxStorage
 */
var vboxStorage = {

	/**
	 * Return list of bus types
	 * 
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
		          	'0-0' : (trans('IDE Primary Master','VBoxGlobal')),
		          	'0-1' : (trans('IDE Primary Slave','VBoxGlobal')),
		          	'1-0' : (trans('IDE Secondary Master','VBoxGlobal')),
		          	'1-1' : (trans('IDE Secondary Slave','VBoxGlobal'))
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
 * 
 * @param {String}
 *            c - storage controller type
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
 * 
 * @param {String}
 *            m - serial port mode
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
 * 
 * @param {String}
 *            t - network adapter type
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
 * 
 * @param {String}
 *            c - audio controller type
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
 * 
 * @param {String}
 *            d - audio driver type
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
 * 
 * @param {String}
 *            d - storage device type
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
 * VM State functions namespace
 */
var vboxVMStates = {
	
	/* Return whether or not vm is running */
	isRunning: function(vm) {
		return (vm && jQuery.inArray(vm.state, ['Running','LiveSnapshotting','Teleporting']) > -1);
	},
	
	/* Whether or not a vm is paused */
	isPaused: function(vm) {
		return (vm && jQuery.inArray(vm.state, ['Paused','TeleportingPausedVM']) > -1);
	},
	
	/* True if vm is powered off */
	isPoweredOff: function(vm) {
		return (vm && jQuery.inArray(vm.state, ['PoweredOff','Saved','Teleported', 'Aborted']) > -1);
	},
	
	/* True if vm is saved */
	isSaved: function(vm) {
		return (vm && vm.state == 'Saved');
	},
	
	/* True if vm is editable */
	isEditable: function(vm) {
		return (vm && vm.sessionState == 'Unlocked');
	},
	
	/* True if one VM in list matches item */
	isOne: function(test, vmlist) {
	
		for(var i = 0; i < vmlist.length; i++) {
			if(vboxVMStates['is'+test](vmlist[i]))
				return true;
		}
		return false;
	},
	
	/* Convert Machine state to translatable state */
	convert: function(state) {
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
};

