<?php

/*
 * English / US language file
 *
 * $Id$
 *
 */

class language {

public static $trans = array(

// General actions
'File' => 'File',
'Edit' => 'Edit',
'Save' => 'Save',
'OK' => 'OK',
'Cancel' => 'Cancel',
'Create' => 'Create',
'Select' => 'Select',
'Up' => 'Up',
'Down' => 'Down',
'Yes' => 'Yes',
'No' => 'No',
'Close' => 'Close',
'Any' => 'Any',
'New' => 'New',
'Add' => 'Add',
'Delete' => 'Delete',
'Keep' => 'Keep',
'Settings' => 'Settings',
'Preferences' => 'Preferences',
'Refresh' => 'Refresh',
'Start' => 'Start',
'Power Off' => 'Power Off',
'Details' => 'Details',
'Console' => 'Console',
'Description' => 'Description',
'Configuration' => 'Configuration',
'Operating System' => 'Operating System',
'Machine' => 'Machine',
'Enabled' => 'Enabled',
'Disabled' => 'Disabled',
'Hosting' => 'Hosting',
'Basic' => 'Basic',
'Advanced' => 'Advanced',
'None' => 'None',
'Help' => 'Help',
'About' => 'About',
'Version' => 'Version',
'VirtualBox User Manual' => 'VirtualBox User Manual',
'Operation Canceled' => 'Operation Canceled',
'Next' => 'Next',
'Back' => 'Back',
'Finish' => 'Finish',
'Select File' => 'Select File',
'Select Folder' => 'Select Folder',
'Server List' => 'Server List',
'Interface Language' => 'Interface Language',
'Language' => 'Language',

// Users and Login
'Username' => 'Username',
'Password' => 'Password',
'Log in' => 'Log in',
'Log out' => 'Log out',
'Change Password' => 'Change Password',
'Old Password' => 'Old Password',
'New Password' => 'New Password',
'The passwords you have entered do not match.' => 'The passwords you have entered do not match.',
'Password changed.' => 'Password changed.',
'The password you have entered is invalid.' => 'The password you have entered is invalid.',
'Retype' => 'Retype', // Retype password
'Invalid username or password.' => 'Invalid username or password.',
'Users' => 'Users',
'Add User' => 'Add User',
'A user with that username already exists.' => 'A user with that username already exists.',
'Remove User' => 'Remove User',
'Are you sure you want to remove the user <b>%s</b>? This action cannot be undone.' => 'Are you sure you want to remove the user <b>%s</b>? This action cannot be undone.',
'Edit User' => 'Edit User',
'Admin User' => 'Admin User',
'Can administer users' => 'Can administer users',
'Not logged in.' => 'Not logged in.',

// Power button
'Stop' => 'Stop',
'Pause' => 'Pause',
'Reset' => 'Reset',
'Save State' => 'Save State',
'ACPI Power Button' => 'ACPI Power Button',
'ACPI Sleep Button' => 'ACPI Sleep Button',
'ACPI event not handled' => 'The ACPI event was not handled by the virtual machine.',

// Settings button while VM is running
'CD/DVD Devices' => 'CD/DVD Devices',
'Floppy Devices' => 'Floppy Devices',
'USB Devices' => 'USB Devices',
'Network Adapters...' => 'Network Adapters...',
'Shared Folders...' => 'Shared Folders...',

'Approx X remaining' => 'Approx %s remaining', /* %s will be replaced with a time. E.g. Approx 2 minutes, 4 seconds remaining */
'X ago' => '%s ago', /* %s will be replaced with a time. E.g. 20 hours ago */
'minutes' => 'minutes',
'seconds' => 'seconds',
'hours' => 'hours',
'days' => 'days',

/* Preview box */
'Preview' => 'Preview',
'Update Disabled' => 'Update Disabled',
'Every X seconds' => 'Every %s seconds', /* %s will be replaced with numeric values */
'Open in new window' => 'Open in new window', /* View VM screenshot in new window*/

/* Snapshots */
'Snapshots' => 'Snapshots',
'Snapshot X' => 'Snapshot %s', /* %s will be replaced with snapshot number to generate a snapshot name */
'Snapshot Folder' => 'Snapshot Folder',
'Current State' => 'Current State',
'Restore' => 'Restore',
'Restore Snapshot' => 'Restore Snapshot',
'Take Snapshot' => 'Take Snapshot',
'Delete Snapshot' => 'Delete Snapshot',
'Snapshot Details' => 'Snapshot Details',
'Snapshot Name' => 'Snapshot Name',
'Snapshot Description' => 'Snapshot Description',
'Restore Snapshot Message' => 'Are you sure you want to restore snapshot %s? This will cause you to lose your current machine state, which cannot be recovered.',
'Delete Snapshot Message1' => 'Deleting the snapshot will cause the state information saved in it to be lost, and disk data spread over several image files that VirtualBox has created together with the snapshot will be merged into one file. This can be a lengthy process, and the information in the snapshot cannot be recovered.',
'Delete Snapshot Message2' => 'Are you sure you want to delete the selected snapshot %s?',
'Taken' => 'Taken',
'changed' => 'changed',

/* Discard State */
'Discard' => 'Discard',
'Discard Message1' => 'Are you sure you want to discard the saved state of the virtual machine %s?', // %s willl be replaced with VM name
'Discard Message2' => 'This operation is equivalent to resetting or powering off the machine without doing a proper shutdown of the guest OS.',

/* Delete or Unregister Inaccessible Machine */
'VM Inaccessible' => 'The selected VM is inaccessible. Please respect the error message shown below and press the Refresh button if you wish to repeat the accessibility check.',
'Delete VM Message1' => 'You are about to remove the virtual machine %s from the machine list.',
'Delete VM Message2' => 'Would you like to delete the files containing the virtual machine from your hard disk as well? Doing this will also remove the files containing the machine\'s virtual hard disks if they are not in use by another machine.',
'Delete all files' => 'Delete all files',
'Remove only' => 'Remove only',
'Unregister VM Message1' => 'Are you sure you want to unregister the inaccessible virtual machine %s?',
'Unregister VM Message2' => 'You will not be able to register it again from this GUI',
'Unregister' => 'Unregister',

/* Error fetching machines */
'Error vmlist 1' => 'There was an error obtaining the list of registered virtual machines from VirtualBox. Make sure vboxwebsrv is running and that the settings in config.php are correct.',
'Error vmlist 2' => 'The list of virtual machines will not begin auto-refreshing again until this page is reloaded.',

/* Properties */
'host' => 'VirtualBox Host',
'Port' => 'Port',
'General' => 'General',
'Name' => 'Name',
'OS Type' => 'OS Type',

/* Options in Preferences / Global Settings */
'Default Hard Disk Folder' => 'Default Hard Disk Folder',
'Default Machine Folder' => 'Default Machine Folder',
'VRDE Authentication Library' => 'VRDE Authentication Library',
'Add host-only network' => 'Add host-only network',
'Remove host-only network' => 'Remove host-only network',
'Edit host-only network' => 'Edit host-only network',
'Host-only Network Details' => 'Host-only Network Details',
'Host-only Networks' => 'Host-only Networks',
'IPv4Mask' => 'Network Mask',
'IPv6Mask' => 'IPv6 Network Mask Length',
'Server Address' => 'Server Address',
'Server Mask' => 'Server Mask',
'Lower Address Bound' => 'Lower Address Bound',
'Upper Address Bound' => 'Upper Address Bound',
'DHCP Server' => 'DHCP Server',
'DHCP enabled' => 'DHCP enabled',
'Manually configured' => 'Manually configured',
'Delete Interface Message1' => 'Deleting this host-only network will remove the host-only interface this network is based on. Do you want to remove the (host-only network) interface %s?',
'Delete Interface Message2' => 'Note: this interface may be in use by one or more virtual network adapters belonging to one of your VMs. After it is removed, these adapters will no longer be usable until you correct their settings by either choosing a different interface name or a different adapter attachment type.',

'System' => 'System',
'Base Memory' => 'Base Memory',
'Memory' => 'Memory',
'free' => 'free', // as in free/available memory
'Enable IO APIC' => 'Enable IO APIC',
'Enable EFI' => 'Enable EFI (special OSes only)',
'Hardware clock in UTC time' => 'Hardware clock in UTC time',
'Processors' => 'Processor(s)',
'Boot Order' => 'Boot Order',
'Removable Media' => 'Removable Media',
'Remember Runtime Changes' => 'Remember Runtime Changes',
'Motherboard' => 'Motherboard',
'Chipset' => 'Chipset',
'Acceleration' => 'Acceleration',
'Extended Features' => 'Extended Features',
'CPUs' => 'CPUs',
'VCPU' => 'VT-x/AMD-V',
'Nested Paging' => 'Nested Paging',
'Hardware Virtualization' => 'Hardware Virtualization',
'Enable VCPU' => 'Enable VT-x/AMD-V',
'Enable Nested Paging' => 'Enable Nested Paging',
'Enable PAE/NX' => 'Enable PAE/NX',

'Display' => 'Display',
'Video' => 'Video',
'Video 2d' => '2D Acceleration',
'Video 3d' => '3D Acceleration',
'Video Memory' => 'Video Memory',

'Remote Display' => 'Remote Display',
'Remote Console' => 'Remote Console',
'Ports' => 'Ports',
'Net Address' => 'Net Address',
'Enable Server' => 'Enable Server',
'Server Port' => 'Server Port',
'Authentication Timeout' => 'Authentication Timeout',
'Authentication Method' => 'Authentication Method',
'External' => 'External',
'Guest' => 'Guest',
'Allow Multiple Connections' => 'Allow Multiple Connections',

'Storage' => 'Storage',
'Storage Tree' => 'Storage Tree',
'Attributes' => 'Attributes',
'Type' => 'Type',
'Slot' => 'Slot',
'Size' => 'Size',
'Virtual Size' => 'Virtual Size',
'Actual Size' => 'Actual Size',
'Location' => 'Location',
'Information' => 'Information',
'Use host I/O cache' => 'Use host I/O cache',
'IDE Controller' => 'IDE Controller',
'Primary Master' => 'Primary Master',
'Primary Slave' => 'Primary Slave',
'Secondary Master' => 'Secondary Master',
'Secondary Slave' => 'Secondary Slave',
'Floppy Controller' => 'Floppy Controller',
'Floppy Drive' => 'Floppy Drive',
'SCSI Controller' => 'SCSI Controller',
'SCSI Port %s' => 'SCSI Port %s',
'SATA Controller' => 'SATA Controller',
'SATA Port %s' => 'SATA Port %s',
'SAS Controller' => 'SAS Controller',
'SAS Port %s' => 'SAS Port %s',
'HardDisk' => 'Hard Disk',
'Floppy' => 'Floppy',
'Floppy Device %s' => 'Floppy Device %s',
'DVD' => 'CD/DVD',
'Type (Format)' => 'Type (Format)',
'Add Attachment' => 'Add Attachment',
'Remove Attachment' => 'Remove Attachment',
'Add Controller' => 'Add Controller',
'Remove Controller' => 'Remove Controller',
'Add CD/DVD Device' => 'Add CD/DVD Device',
'Add Hard Disk' => 'Add Hard Disk',
'Add Floppy Device' => 'Add Floppy Device',
'DVD Drive' => 'CD/DVD Drive',
'Empty' => 'Empty',
'Passthrough' => 'Passthrough',
'Unknown Device' => 'Unknown Device',
'Host Drive' => 'Host Drive',
'Add IDE Controller' => 'Add IDE Controller',
'Add Floppy Controller' => 'Add Floppy Controller',
'Add SCSI Controller' => 'Add SCSI Controller',
'Add SATA Controller' => 'Add SATA Controller',
'Add SAS Controller' => 'Add SAS Controller',
'LsiLogic' => 'LsiLogic',
'BusLogic' => 'BusLogic',
'IntelAhci' => 'AHCI',
'PIIX3' => 'PIIX3',
'PIIX4' => 'PIIX4',
'ICH6' => 'ICH6',
'I82078' => 'I82078',
'LsiLogicSas' => 'LsiLogic SAS',
'Differencing Disks' => 'Differencing Disks',
'No unused media message 1' => 'There is no unused media available for the newly created attachment.',
'No unused media message 2' => 'Press the Create button to start the New Virtual Disk wizard and create a new medium, or press Select if you wish to open the Virtual Media Manager.',
'storage attached indirectly' => 'Attaching this disk will be performed indirectly using a newly created differencing hard disk.',
'base disk indirectly attached' => 'This base hard disk is indirectly attached using the following differencing hard disk:',
'Attached to' => 'Attached to',
'Not Attached' => 'Not Attached',
'Set up the virtual hard disk' => 'Set up the virtual hard disk',
'Set up the virtual floppy drive' => 'Set up the virtual floppy drive',
'Set up the virtual CD/DVD drive' => 'Set up the virtual CD/DVD drive',
'Choose a virtual floppy disk file...' => 'Choose a virtual floppy disk file...',
'Choose a virtual CD/DVD disk file...' => 'Choose a virtual CD/DVD disk file...',
'Choose a virtual hard disk file...' => 'Choose a virtual hard disk file...',
'Create a new hard disk...' => 'Create a new hard disk...',
'Remove disk from virtual drive' => 'Remove disk from virtual drive',
'Image' => 'Image', // CD/DVD or Floppy image

'Serial Ports' => 'Serial Ports',
'Port X' => 'Port %s', // %s will be replaced with port number
'Enable Serial Port' => 'Enable Serial Port',
'Port Number' => 'Port Number',
'IRQ' => 'IRQ',
'I/O Port' => 'I/O Port',
'User-defined' => 'User-defined',
'Port Mode' => 'Port Mode',
'Disconnected' => 'Disconnected',
'HostPipe' => 'Host Pipe',
'HostDevice' => 'Host Device',
'RawFile' => 'Raw File',
'Create Pipe' => 'Create Pipe',
'Port/File Path' => 'Port/File Path',

'Parallel Ports' => 'Parallel Ports',
'Enable Parallel Port' => 'Enable Parallel Port',
'Port Path',

'USB' => 'USB',
'USB Controller' => 'USB Controller',
'Enable USB Controller' => 'Enable USB Controller',
'Enable USB 2.0 Controller' => 'Enable USB 2.0 Controller',
'USB Device Filters' => 'USB Device Filters',
'Add Empty Filter' => 'Add Empty Filter',
'Add Filter From Device' => 'Add Filter From Device',
'Edit Filter' => 'Edit Filter',
'Remove Filter' => 'Remove Filter',
'Move Filter Up' => 'Move Filter Up',
'Move Filter Down' => 'Move Filter Down',
'Device Filters' => 'Device Filters',
'active' => 'active',
'no devices available' => 'no devices available',

'USB Filter' => 'USB Filter',
'New Filter' => 'New Filter',
'Vendor ID' => 'Vendor ID',
'Product ID' => 'Product ID',
'Revision' => 'Revision',
'Manufacturer' => 'Manufacturer',
'Serial No' => 'Serial No.',
'Remote' => 'Remote',

'Shared Folders' => 'Shared Folders',
'Shared Folder' => 'Shared Folder',
'Folders List' => 'Folders List',
'Machine Folders' => 'Machine Folders',
'Transient Folders' => 'Transient Folders',
'Path' => 'Path',
'Access' => 'Access',
// read only & read/write
'ro' => 'Read-Only',
'rw' => 'Writable',
'Auto-Mount' => 'Auto-Mount', // 3.2.8
'Make Permanent' => 'Make Permanent',
'Full Access' => 'Full Access',
'Add Shared Folder' => 'Add Shared Folder',
'Edit Shared Folder' => 'Edit Shared Folder',
'Remove Shared Folder' => 'Remove Shared Folder',


'Audio' => 'Audio',
'Enable Audio' => 'Enable Audio',
'Host Audio Driver' => 'Host Audio Driver',
'Audio Controller' => 'Audio Controller',

'WinMM' => 'Windows multimedia',
'Null Audio Driver' => 'Null Audio Driver',
'OSS' => 'Open Sound System',
'ALSA' => 'Advanced Linux Sound Architecture',
'DirectSound' => 'Microsoft DirectSound',
'CoreAudio' => 'Core Audio',
'MMPM' => 'Reserved for historical reasons.', /* In API. May never see it in the real world */
'Pulse' => 'Pulse Audio',
'SolAudio' => 'Solaris Audio',

'HDA' => 'Intel HD Audio', // 3.2.8
'AC97' => 'ICH AC97',
'SB16' => 'SoundBlaster 16',

'Network' => 'Network',
'Adapter' => 'Adapter',
'Network Adapter' => 'Network Adapter',
'Enable Network Adapter' => 'Enable Network Adapter',
'Adapter Type' => 'Adapter Type',
'Bridged Adapter' => 'Bridged Adapter',
'Internal Network' => 'Internal Network',
'Host-only Adapter' => 'Host-only Adapter',
'VDE Adapter' => 'VDE Adapter',
'Not attached' => 'Not attached',
'Bridged adapter, %s' => 'Bridged adapter, %s', // %s will be replaced by adapter name
'Host-only adapter, \'%s\'' => 'Host-only adapter, \'%s\'', // %s will be replaced by adapter name
'Internal network, \'%s\'' => 'Internal network, \'%s\'', // %s will be replaced by network name
'VDE network, \'%s\'' => 'VDE network, \'%s\'', // %s will be replaced by network name
'NAT' => 'NAT',
'network' => 'network',
'Ethernet' => 'Ethernet',
'PPP' => 'PPP',
'SLIP' => 'SLIP',
'IPv4Addr' => 'IP Address',
'IPv6Addr' => 'IP(v6) Address',
'Mac Address' => 'MAC Address',
'Cable connected' => 'Cable connected',
'netMediumType' => 'Type',
'Guest Network Adapters' => 'Guest Network Adapters',
/* New */
'Port Forwarding' => 'Port Forwarding',
'Port Forwarding Rules' => 'Port Forwarding Rules',
'Protocol' => 'Protocol',
'Host IP' => 'Host IP',
'Host Port' => 'Host Port',
'Guest IP' => 'Guest IP',
'Guest Port' => 'Guest Port',
'TCP' => 'TCP',
'UDP' => 'UDP',
'Rule' => 'Rule',
'Insert new rule' => 'Insert new rule',
'Delete selected rule' => 'Delete selected rule',
'Invalid IP Address' => 'Invalid IP Address',
'The current port forwarding rules are not valid' => 'The current port forwarding rules are not valid. None of the host or guest port values may be set to zero.',


'Am79C970A' => 'AMD PCNet-PCI II network card',
'Am79C973' => 'AMD PCNet-FAST III network card',
'I82540EM' => 'Intel PRO/1000 MT Desktop network card',
'I82543GC' => 'Intel PRO/1000 T Server network card',
'I82545EM' => 'Intel PRO/1000 MT Server network card',
'Virtio' => 'Virtio network device ',


// Machine states
'PoweredOff' => 'Powered Off',
'Saved' => 'Saved',
'Teleported' => 'Teleported',
'Aborted' => 'Aborted',
'Running' => 'Running',
'Paused' => 'Paused',
'Stuck' => 'Stuck',
'Teleporting' => 'Teleporting',
'LiveSnapshotting' => 'Live Snapshotting',
'Starting' => 'Starting',
'Stopping' => 'Stopping',
'Saving' => 'Saving',
'Restoring' => 'Restoring',
'TeleportingPausedVM' => 'Teleporting Paused VM',
'TeleportingIn' => 'Teleporting In',
'RestoringSnapshot' => 'Restoring Snapshot',
'DeletingSnapshot' => 'Deleting Snapshot',
'SettingUp' => 'Setting Up',

// list separator
'LIST_SEP' => ', ',

// Sizes
'B' => 'B',
'KB' => 'KB',
'MB' => 'MB',
'GB' => 'GB',
'TB' => 'TB',

// Virtual Media Manager
'Open Virtual Media Manager' => 'Open Virtual Media Manager',
'Virtual Media Manager' => 'Virtual Media Manager',
'Are you sure remove medium' => 'Are you sure remove the medium %s from the list of known media?',
'Medium remove note' => 'Note that the storage unit of this medium will not be deleted and that it will be possible to add it to the list again later.',
'Are you sure release medium' => 'Are you sure you want to release the medium %s?',
'This will detach from' => 'This will detach it from the following virtual machine(s): %s.',
'Please select a medium.' => 'Please select a medium.',
'VMM Remove Media Message1' => 'Do you want to delete the storage unit of the hard disk %s?',
'VMM Remove Media Message2' => 'If you select Delete then the specified storage unit will be permanently deleted. <b>This operation cannot be undone.</b>',
'VMM Remove Media Message3' => 'If you select Keep then the hard disk will be only removed from the list of known hard disks, but the storage unit will be left untouched which makes it possible to add this hard disk to the list later again.',
'Normal' => 'Normal',
'Writethrough' => 'Writethrough',
'Immutable' => 'Immutable',
'Actions' => 'Actions',
'Clone' => 'Clone',
'Remove' => 'Remove',
'Release' => 'Release',
'Hard Disks' => 'Hard Disks',
'CD/DVD Images' => 'CD/DVD Images',
'Floppy Images' => 'Floppy Images',

/* New hard disk wizard */
'Create New Virtual Disk' => 'Create New Virtual Disk',
'newDisk Welcome' => 'Welcome to the Create New Virtual Disk Wizard!',
'newDisk Step1 Message1' => 'This wizard will help you to create a new virtual hard disk for your virtual Machine.',
'newDisk Step1 Message2' => 'Use the Next button to go to the next page of the wizard and the Back button to return to the previous page.',
'Hard Disk Storage Type' => 'Hard Disk Storage Type',
'newDisk Step2 Message1' => 'Select the type of virtual hard disk you want to create.',
'newDisk Step2 dynamic' => 'A <b>dynamically expanding storage</b> initially occupies a very small amount of space on your physical hard disk. It will grow dynamically (up to the size specified) as the Guest OS claims disk space.',
'newDisk Step2 fixed' => 'A <b>fixed-size storage</b> does not grow. It is stored in a file approximately the same size as the size of the virtual hard disk. The creation of a fixed-size storage may take a long time depending on the storage size and the write performance of your hard disk.',
'Storage Type' => 'Storage Type',
'Dynamically expanding storage' => 'Dynamically expanding storage',
'Fixed-size storage' => 'Fixed size storage',
'Virtual Disk Location and Size' => 'Virtual Disk Location and Size',
'newDisk Step3 Message1' => 'Select the location of a file to store the hard disk data or type a file name in the entry field.',
'newDisk Step3 Message2' => 'Select the size of the virtual hard disk in megabytes. The size will be reported to the Guest OS as the maximum size of this hard disk.',
'Summary' => 'Summary',
'newDisk Step4 Message1' => 'You are going to create a new hard disk with the following parameters:',
'newDisk Step4 Message2' => 'If the above settings are correct, press the Finish button. Once you press it, a new hard disk will be created.',

/* New virtual machine wizard */
'Create New Virtual Machine' => 'Create New Virtual Machine',
'New Virtual Machine Wizard' => 'New Virtual Machine Wizard',
'newVM Welcome' => 'Welcome to the New Virtual Machine Wizard!',
'newVM Step1 Message1' => 'This wizard will guide you through the steps necessary to create a new virtual machine for VirtualBox.',
'newVM Step1 Message2' => 'Use the Next button to go to the next page of the wizard and the Back button to return to the previous page.',
'VM Name and OS Type' => 'VM Name and OS Type',
'newVM Step2 Message1' => 'Enter a name for the new virtual machine and select the type of guest operating system you plan to install onto the virtual machine.',
'newVM Step2 Message2' => 'The name of the virtual machine usually indicates its software and hardware configuration. It will be used by all VirtualBox components to identify your virtual machine.',
'newVM Step3 Message1' => 'Select the amount of base memory (RAM) in megabytes to be allocated to the virtual machine.',
'newVM Step3 Message2' => 'The recommended base memory size is %s MB.', /* %s will be replaced with the recommended memory size at run time */
'Virtual Hard Disk' => 'Virtual Hard Disk',
'Boot Hard Disk' => 'Boot Hard Disk',
'Create new hard disk' => 'Create new hard disk',
'Use existing hard disk' => 'Use existing hard disk',
'newVM Step4 Message1' => 'Select the hard disk image to be used as the boot disk of the virtual machine. You can either create a new hard disk using the New button or select an existing hard disk image from the drop-down list or by pressing the Existing button (to invoke the Virtual Media Manager dialog).',
'newVM Step4 Message2' => 'If you need a more complicated hard disk setup, you can skip this step and attach hard disks later using the VM Settings dialog.',
'newVM Step4 Message3' => 'The recommended size of the boot hard disk is %s.', /* %s will be replaced with the recommended memory size at run time */
'newVM Step5 Message1' => 'You are going to create a new virtual machine with the following parameters:',
'newVM Step5 Message2' => 'If the above is correct press the Finish button. Once you press it, a new virtual machine will be created.',
'newVM Step5 Message3' => 'Note that you can alter these and all other setting of the created virtual machine at any time using the Settings dialog accessible through the menu of the main window.',

/* VM Log files */
'Show Log' => 'Show Log',
'Logs' => 'Logs',
'No logs found.' => 'No logs found for the selected virtual machine.',

/* Import / Export Appliances */
'Export Appliance' => 'Export Appliance',
'Appliance Export Wizard' => 'Appliance Export Wizard',
'Appliance Export Wizard Welcome' => 'Welcome to the Appliance Export Wizard!',
'appExport Step1 Message1' => 'This wizard will guide you through the process of exporting an appliance.',
'appExport Step1 Message2' => 'Use the Next button to go to the next page of the wizard and the Back button to return to the previous page. You can also press Cancel if you want to cancel the execution of this wizard.',
'appExport Step1 Message3' => 'Please select the virtual machines that should be added to the appliance. You can select more than one. Please note that these machines have to be turned off before they can be exported.',
'Appliance Export Settings' => 'Appliance Export Settings',
'appExport Step2 Message1' => 'Please choose a filename to export the OVF/OVA to. If you use an ova file name extension, then all the files will be combined into one Open Virtualization Format Archive. If you use an ovf extension, several files will be written separately. Other extensions are not allowed.',
'appExport Step3 Message1' => 'Here you can change additional configuration values of the selected virtual machines. You can modify most of the properties shown by double-clicking on the items.',
'Import Appliance' => 'Import Appliance',
'Appliance Import Wizard' => 'Appliance Import Wizard',
'Appliance Import Wizard Welcome' => 'Welcome to the Appliance Import Wizard!',
'appImport Step1 Message1' => 'This wizard will guide you through the process of importing an appliance.',
'appImport Step1 Message2' => 'Use the Next button to go to the next page of the wizard and the Back button to return to the previous page. You can also press Cancel if you want to cancel the execution of this wizard.',
'appImport Step1 Message3' => 'VirtualBox currently supports importing appliances saved in the Open Virtualization Format (OVF). To continue, select the file to import below:',
'Appliance Import Settings' => 'Appliance Import Settings',
'appImport Step2 Message1' => 'These are the virtual machines contained in the appliance and the suggested settings of the imported VirtualBox machines. You can change many of the properties shown by double-clicking on the items and disable others using the check boxes below.',
'appImport Step3 Message1' => 'Please choose a filename to import the OVF to.',
'Write legacy OVF' => 'Write legacy OVF 0.9',
'Write Manifest file' => 'Write Manifest file',
'Virtual System X' => 'Virtual System %s', // %s will be replaced with the virtual system number
'Product' => 'Product',
'Product-URL' => 'Product-URL',
'Vendor' => 'Vendor',
'Vendor-URL' => 'Vendor-URL',
'License' => 'License',
'Hard Disk Controller' => 'Hard Disk Controller',
'Virtual Disk Image' => 'Virtual Disk Image',
'Warnings' => 'Warnings',

/* Operation in progress onUnLoad warning message */
'Operation in progress' => 'Warning: A VirtualBox internal operation is in progress. Closing this window or navigating away from this web page may cause unexpected and undesirable results. Please wait for the operation to complete.',
'Loading ...' => 'Loading ...', // "loading ..." screen

/* Versions */
'Unsupported version' => 'You are using an untested version of VirtualBox (%s) with phpVirtualbox. This may cause unknown and undesireable results.',
'Do not show message again' => 'Do not show this message again.',

/* Fatal connection error */
'Fatal error' => 'An error occurred communicating with your vboxwebsrv. No more requests will be sent by phpVirtualBox until the error is corrected and this page is refreshed. The details of this connection error should be displayed in a subsequent dialog box.',

/* Guest properties error */
'Unable to retrieve guest properties' => 'Unable to retrieve guest properties. Make sure the virtual machine is running and has the VirtualBox Guest Additions installed.',

/*Remote Console */
'User name' => 'User name',
'Password' => 'Password',
'Connecting to' => 'Connecting to',
'Connected to' => 'Connected to',
'Requested desktop size' => 'Requested desktop size',
'Connect' => 'Connect',
'Detach' => 'Detach',
'Disconnect' => 'Disconnect',
'Ctrl-Alt-Del' => "Send Ctrl-Alt-Del",
'Disconnect reason' => 'Disconnect reason',
"Redirection by" => "Redirection by",
'Virtual machine is not running or RDP configured.' => 'Virtual machine is not running or is not configured to accept RDP connections.',

/* Guest Additions */
'Install Guest Additions' => 'Install Guest Additions',
'Guest Additions Mounted' => 'The VirtualBox Guest Additions CD image has been mounted on a CD/DVD drive in the virtual machine. To complete the installation process, you must log into the virtual machine and manually install the VirtualBox Guest Additions.',
'Guest Additions No CDROM' => 'Could not insert the VirtualBox Guest Additions installer CD image into the virtual machine, as the machine has no CD/DVD-ROM drives. Please add a drive using the storage page of the virtual machine settings dialog.',

/* USB devices */
'USB Device' => 'Device', // USB device name
'USB Attached' => 'Attached', // Is it attached to the VM
'USB Available' => 'Available', // 	Is it available

/* VM List Tooltip
 * %1 replaced with VM Name
 * %2 replaced with VM state
 * %3 replaced with time since state change
 * %4 replaced with session state (locked or unlocked)
 * */
'<nobr>%1</nobr><br /><nobr>%2 since %3</nobr><br /><nobr>Session %4</nobr>' => '<nobr>%1</nobr><br /><nobr>%2 since %3</nobr><br /><nobr>Session %4</nobr>',
// Session states
'Locked' => 'Locked',
'Unlocked' => 'Unlocked',
'Unlocking' => 'Unlocking',

/* Operating Systems */
'Other' => 'Other/Unknown',
'Windows31' => 'Windows 3.1',
'Windows95' => 'Windows 95',
'Windows98' => 'Windows 98',
'WindowsMe' => 'Windows Me',
'WindowsNT4' => 'Windows NT 4',
'Windows2000' => 'Windows 2000',
'WindowsXP' => 'Windows XP',
'WindowsXP_64' => 'Windows XP (64 bit)',
'Windows2003' => 'Windows 2003',
'Windows2003_64' => 'Windows 2003 (64 bit)',
'WindowsVista' => 'Windows Vista',
'WindowsVista_64' => 'Windows Vista (64 bit)',
'Windows2008' => 'Windows 2008',
'Windows2008_64' => 'Windows 2008 (64 bit)',
'Windows7' => 'Windows 7',
'Windows7_64' => 'Windows 7 (64 bit)',
'WindowsNT' => 'Other Windows',
'Linux22' => 'Linux 2.2',
'Linux24' => 'Linux 2.4',
'Linux24_64' => 'Linux 2.4 (64 bit)',
'Linux26' => 'Linux 2.6',
'Linux26_64' => 'Linux 2.6 (64 bit)',
'ArchLinux' => 'Arch Linux',
'ArchLinux_64' => 'Arch Linux (64 bit)',
'Debian' => 'Debian',
'Debian_64' => 'Debian (64 bit)',
'OpenSUSE' => 'openSUSE',
'OpenSUSE_64' => 'openSUSE (64 bit)',
'Fedora' => 'Fedora',
'Fedora_64' => 'Fedora (64 bit)',
'Gentoo' => 'Gentoo',
'Gentoo_64' => 'Gentoo (64 bit)',
'Mandriva' => 'Mandriva',
'Mandriva_64' => 'Mandriva (64 bit)',
'RedHat' => 'Red Hat',
'RedHat_64' => 'Red Hat (64 bit)',
'Turbolinux' => 'Turbolinux',
'Ubuntu' => 'Ubuntu',
'Ubuntu_64' => 'Ubuntu (64 bit)',
'Xandros' => 'Xandros',
'Xandros_64' => 'Xandros (64 bit)',
'Linux' => 'Other Linux',
'Solaris' => 'Solaris',
'Solaris_64' => 'Solaris (64 bit)',
'OpenSolaris' => 'OpenSolaris',
'OpenSolaris_64' => 'OpenSolaris (64 bit)',
'FreeBSD' => 'FreeBSD',
'FreeBSD_64' => 'FreeBSD (64 bit)',
'OpenBSD' => 'OpenBSD',
'OpenBSD_64' => 'OpenBSD (64 bit)',
'NetBSD' => 'NetBSD',
'NetBSD_64' => 'NetBSD (64 bit)',
'OS2Warp3' => 'OS/2 Warp 3',
'OS2Warp4' => 'OS/2 Warp 4',
'OS2Warp45' => 'OS/2 Warp 4.5',
'OS2eCS' => 'eComStation',
'OS2' => 'Other OS/2',
'DOS' => 'DOS',
'Netware' => 'Netware',
'MacOS' => 'Mac OS X Server',
'MacOS_64' => 'Mac OS X Server (64 bit)',

);



function trans($item = '') {
	return (@self::$trans[$item] ? @self::$trans[$item] : $item);
}


}