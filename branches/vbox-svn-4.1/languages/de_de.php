<?php
/*
 * German language file
 *
 * $Id$
 *
 */

class language {

public static $trans = array(

// General actions
'File' => 'Datei',
'Edit' => 'Bearbeiten',
'Save' => 'Speichern',
'OK' => 'OK',
'Cancel' => 'Abbrechen',
'Create' => 'Neu',
'Select' => 'AuswÃ¤hlen',
'Up' => 'Nach Oben',
'Down' => 'Nach Unten',
'Yes' => 'Ja',
'No' => 'Nein',
'Close' => 'SchlieÃŸen',
'Any' => 'Alle',
'New' => 'Neu',
'Add' => 'HinzufÃ¼gen...',
'Delete' => 'LÃ¶schen',
'Keep' => 'Behalten',
'Settings' => 'Einstellungen',
'Preferences' => 'Eigenschaften',
'Refresh' => 'Neu Laden',
'Start' => 'Start',
'Power Off' => 'Power Off',
'Details' => 'Einzelheiten',
'Console' => 'Konsole',
'Description' => 'Beschreibung',
'Configuration' => 'Konfiguration',
'Operating System' => 'Betriebssystem',
'Machine' => 'Maschine',
'Enabled' => 'Aktiviert',
'Disabled' => 'Deaktiviert',
'Hosting' => 'Hosting',
'Basic' => 'Grundlagen',
'Advanced' => 'Erweitert',
'None' => 'Keine',
'Help' => 'Hilfe',
'About' => 'Ãœber',
'Version' => 'Version',
'VirtualBox User Manual' => 'VirtualBox Benutzerhandbuch',
'Operation Canceled' => 'Aktion abgebrochen',
'Next' => 'Vor',
'Back' => 'zurÃ¼ck',
'Finish' => 'Beenden',
'Select File' => 'Datei auswÃ¤hlen',
'Select Folder' => 'Ordner auswÃ¤hlen',
'Server List' => 'Server-Liste',
'Interface Language' => 'Sprache der BenutzeroberflÃ¤che',
'Language' => 'Sprache',

// Users and Login
'Username' => 'Benutzername',
'Password' => 'Passwort',
'Log in' => 'einloggen',
'Log out' => 'ausloggen',
'Change Password' => 'Passwort Ã¤ndern',
'Old Password' => 'Aktuelles Passwort',
'New Password' => 'Neues Passwort',
'The passwords you have entered do not match.' => 'Die PasswÃ¶rter die Sie eingegeben haben stimmen nicht Ã¼berein.',
'Password changed.' => 'Kennwort geÃ¤ndert.',
'The password you have entered is invalid.' => 'Das von Ihnen eingegebene Kennwort ist ungÃ¼ltig.',
'Retype' => 'Retype', // Retype password
'Invalid username or password.' => 'UngÃ¼ltiger Benutzername oder Kennwort.',
'Users' => 'Benutzer',
'Add User' => 'HinzufÃ¼gen eines Benutzers',
'A user with that username already exists.' => 'Ein Benutzer mit diesem Benutzernamen existiert bereits.',
'Remove User' => 'Entfernen Sie diesen Benutzer',
'Are you sure you want to remove the user <b>%s</b>? This action cannot be undone.' => 'Sind Sie sicher, dass Sie den Benutzer <b>%s</b> entfernen mÃ¶chten? Diese Aktion kann nicht rÃ¼ckgÃ¤ngig gemacht werden.',
'Edit User' => 'Bearbeiten dieses Benutzers',
'Admin User' => 'Administrativer Benutzer',
'Can administer users' => 'Kann Benutzer verwalten',
'Not logged in.' => 'Nicht eingeloggt.',

// Power button
'Stop' => 'Stoppen',
'Pause' => 'Anhalten',
'Reset' => 'Neustarten',
'Save State' => 'Zustand speichern',
'ACPI Power Button' => 'ACPI Ein/Ausschalten',
'ACPI Sleep Button' => 'ACPI Ruhezustand',
'ACPI event not handled' => 'Die virtuelle Maschine versteht dieses ACPI Ereignis nicht.',

// Settings button while VM is running
'CD/DVD Devices' => 'CD/DVD-Laufwerke',
'Floppy Devices' => 'Diskettenlaufwerke',
'USB Devices' => 'USB-GerÃ¤te',
'Network Adapters...' => 'Netzwerkadapter...',
'Shared Folders...' => 'Gemeinsame Ordner...',

'Approx X remaining' => 'Etwa %s verbleiben', /* %s will be replaced with a time. E.g. Approx 2 minutes, 4 seconds remaining */
'X ago' => 'vor %s', /* %s will be replaced with a time. E.g. 20 hours ago */
'minutes' => 'Minuten',
'seconds' => 'Sekunden',
'hours' => 'Stunden',
'days' => 'Tage',

/* Preview box */
'Preview' => 'Vorschau',
'Update Disabled' => 'Update deaktiviert',
'Every X seconds' => 'alle %s Sekunde(n)', /* %s will be replaced with numeric values */
'Open in new window' => 'In neuem Fenster Ã¶ffnen', /* View VM screenshot in new window*/

/* Snapshots */
'Snapshots' => 'Momentaufnahme',
'Snapshot X' => 'Sicherungspunkt %s', /* %s will be replaced with snapshot number to generate a snapshot name */
'Snapshot Folder' => 'Ordner fÃ¼r Momentaufnahmen',
'Current State' => 'Aktueller Zustand',
'Restore' => 'Wiederherstellen',
'Restore Snapshot' => 'Momentaufnahme wiederherstellen',
'Take Snapshot' => 'Momentaufnahme machen',
'Delete Snapshot' => 'Momentaufnahme lÃ¶schen',
'Snapshot Details' => 'Einzelheiten der Momentaufnahme',
'Snapshot Name' => 'Name der Momentaufnahme',
'Snapshot Description' => 'Beschreibung der Momentaufnahme',
'Restore Snapshot Message' => 'Sind Sie sicher, dass Sie die Momentaufnahme %s wiederherstellen mÃ¶chten? Dabei wird der aktuelle Zustand dieser Maschine gelÃ¶scht und kann nicht wiederhergestellt werden.',
'Delete Snapshot Message1' => 'Wenn Sie diese Momentaufnahme lÃ¶schen, wird der damalige Status ebenso gelÃ¶scht. Daten, die zum Zeitpunkt der Momentaufnahme Ã¼ber mehrere Dateien verteilt wurden, werden in einer Datei zusammen gefasst. Dies kann lÃ¤ngere Zeit dauern. Die Momentaufnahme kann nicht wiederhergestellt werden.',
'Delete Snapshot Message2' => 'Sind Sie sicher, dass Sie die Momentaufnahme %s lÃ¶schen mÃ¶chten?',
'Taken' => 'Aufgenommen',
'changed' => 'geÃ¤ndert',

/* Discard State */
'Discard' => 'Verwerfen',
'Discard Message1' => 'Sind Sie sicher, dass Sie den gespeicherten Zustand der virtuellen Maschine %s verwerfen mÃ¶chten?', // %s willl be replaced with VM name
'Discard Message2' => 'Diese Aktion entspricht dem Neustart oder Ausschalten der Maschine ohne das Gastsystem ordnungsgemÃ¤ÃŸ herunterzufahren.',

/* Delete or Unregister Inaccessible Machine */
'VM Inaccessible' => 'Auf die ausgewÃ¤hlte virtuelle Maschine kann nicht zugegriffen werden. Bitte beachten Sie die nachstehende Fehlermeldung. Um die MÃ¶glichkeit des Zugriffs nochmals zu ÃœberprÃ¼fen, drÃ¼cken Sie den Konpf Neu Laden.',
'Delete VM Message1' => 'Sie sind im Begriff, die virtuelle Maschine %s aus der Liste der virtuellen Maschine zu entfernen.',
'Delete VM Message2' => 'MÃ¶chten Sie die entsprechenden Dateien von der Festplatte ebenfalls lÃ¶schen? Falls ja, werden die virtuellen Festplatten ebenfalls unwiderruflich gelÃ¶scht, falls diese nicht noch an eine andere VM gebunden sind.',
'Delete all files' => 'Alle Dateien lÃ¶schen',
'Remove only' => 'Nur lÃ¶schen',
'Unregister VM Message1' => 'Sind Sie sicher, dass Sie die nicht verfÃ¼gbare virtuelle Maschine %s deregistrieren mÃ¶chten?',
'Unregister VM Message2' => 'Sie kÃ¶nnen sie Ã¼ber diese grafische OberflÃ¤che nicht mehr registrieren.',
'Unregister' => 'Unregister',

/* Error fetching machines */
'Error vmlist 1' => 'Beim Ermitteln der Liste virtueller Maschimen ist ein Fehler aufgetreten. Stellen Sie sicher, dass vboxwebsrv gestartet ist und die Einstellugen in der Datei config.php stimmen.',
'Error vmlist 2' => 'Die Liste der virtuellen Maschinen kÃ¶nnen Sie durch das erneute Laden dieser Seite aktualisieren.',

/* Properties */
'host' => 'VirtualBox Host',
'Port' => 'Port',
'General' => 'Allgemein',
'Name' => 'Name',
'OS Type' => 'OS Typ',

/* Options in Preferences / Global Settings */
'Default Hard Disk Folder' => 'Standardordner fÃ¼r Festplatten',
'Default Machine Folder' => 'Standardordner fÃ¼r Maschinen',
'VRDE Authentication Library' => 'VRDE-Authentisierungsbibliothek',
'Add host-only network' => 'Host-only Netzwerk hinzufÃ¼gen',
'Remove host-only network' => 'Host-only Netzwerk entfernen',
'Edit host-only network' => 'Host-only Netzwerk bearbeiten',
'Host-only Network Details' => 'Host-only Netzwerk - Einzelheiten',
'Host-only Networks' => 'Host-only Netzwerke',
'IPv4Mask' => 'Netzwerkmaske',
'IPv6Mask' => 'IPv6 Netzwerk MaskenlÃ¤nge',
'Server Address' => 'Server Addresse',
'Server Mask' => 'Server Maske',
'Lower Address Bound' => 'von Addresse',
'Upper Address Bound' => 'bis Addresse',
'DHCP Server' => 'DHCP Server',
'DHCP enabled' => 'DHCP aktiviert',
'Manually configured' => 'Manuell konfiguriert',
'Delete Interface Message1' => 'Wenn Sie dieses Host-only Netzwerk entfernen, wird die Host-only Schnittstelle entfernt, zu der dieses Netzwerk gehÃ¶rt. MÃ¶chten Sie diese (Host-only Netzwerk) Schnittstelle %s entfernen?',
'Delete Interface Message2' => 'Anmerkung: Diese Schnittstelle wird mÃ¶glicherweise von einem oder mehreren virtuellen Netzwerkadaptern genutzt, welche zu einer Ihrer virtuellen Maschinen gehÃ¶ren. Sobald diese Schnittstelle entfernt wird, werden diese Netzwerkadapter nicht mehr funktionieren bis Sie die Einstellungen der virtuellen Maschinen korrigiert haben. Entweder wÃ¤hlen Sie einen anderen Schnittstellen Namen oder einen anderen Typ von Netzwerkadapter.',

'System' => 'System',
'Base Memory' => 'Hauptspeicher',
'Memory' => 'Speicher',
'free' => 'verfÃ¼gbar', // as in free/available memory
'Enable IO APIC' => 'IO APIC aktivieren',
'Enable EFI' => 'EFI aktivieren (Ausnahme, nur fÃ¼r spezielle Betriebssysteme)',
'Hardware clock in UTC time' => 'Systemzeit im Format UTC',
'Processors' => 'Processoren',
'Execution Cap' => 'CPU-Auslastungsgrenze',
'%s%' => '%s%',
'Boot Order' => 'Startreihenfolge',
'Removable Media' => 'WechseldatentrÃ¤ger',
'Remember Runtime Changes' => 'Ã„nderungen zur Laufzeit merken',
'Motherboard' => 'Hauptplatine',
'Chipset' => 'Chipsatz',
'Acceleration' => 'Beschleunigung',
'Extended Features' => 'Erweiterte Eigenschaften',
'CPUs' => 'CPUs',
'VCPU' => 'VT-x/AMD-V',
'Nested Paging' => 'Nested Paging',
'Hardware Virtualization' => 'Hardware Virtualisierung',
'Enable VCPU' => 'VT-x/AMD-V aktivieren',
'Enable Nested Paging' => 'Nested Paging aktivieren',
'Enable PAE/NX' => 'PAE/NX aktivieren',

'Display' => 'Bildschirm',
'Video' => 'Grafik',
'Video 2d' => '2D Beschleunigung',
'Video 3d' => '3D Beschleunigung',
'Video Memory' => 'Grafikspeicher',

'Remote Display' => 'Fernsteuerung',
'Remote Console' => 'Fernzugriff (RDP)',
'Ports' => 'Ports',
'Net Address' => 'Netzwerk Addresse',
'Enable Server' => 'Fernzugriff aktivieren',
'Server Port' => 'Port fÃ¼r Fernzugriff',
'Authentication Timeout' => 'Timeout fÃ¼r Anmeldung',
'Authentication Method' => 'Anmeldungsmethode',
'External' => 'Extern',
'Guest' => 'Gast',
'Allow Multiple Connections' => 'Gleichzeitige Verbindungen erlauben',

'Storage' => 'Speicherpaltz',
'Storage Tree' => 'Storage Tree',
'Attributes' => 'Attribute',
'Type' => 'Typ',
'Slot' => 'Slot',
'Size' => 'GrÃ¶ÃŸe',
'Virtual Size' => 'Virtuelle GrÃ¶ÃŸe',
'Actual Size' => 'Aktuelle GrÃ¶ÃŸe',
'Location' => 'Ort',
'Information' => 'Information',
'Use host I/O cache' => 'Host I/O cache nutzen',
'IDE Controller' => 'IDE Controller',
'Primary Master' => 'PrimÃ¤rer Master',
'Primary Slave' => 'PrimÃ¤rer Slave',
'Secondary Master' => 'SekundÃ¤rer Master',
'Secondary Slave' => 'SekundÃ¤rer Slave',
'Floppy Controller' => 'Floppy-Controller',
'Floppy Drive' => 'Diskettenlaufwerk',
'SCSI Controller' => 'SCSI-Controller',
'SCSI Port %s' => 'SCSI-Port %s',
'SATA Controller' => 'SATA-Controller',
'SATA Port %s' => 'SATA-Port %s',
'SAS Controller' => 'SAS-Controller',
'SAS Port %s' => 'SAS-Port %s',
'HardDisk' => 'Festplatte',
'Floppy' => 'Diskette',
'Floppy Device %s' => 'Diskettenlaufwerk %s',
'DVD' => 'CD/DVD',
'Type (Format)' => 'Typ (Format)',
'Add Attachment' => 'Anlage hinzufÃ¼gen',
'Remove Attachment' => 'Anlage entfernen',
'Add Controller' => 'Controller hinzufÃ¼gen',
'Remove Controller' => 'Controller entfernen',
'Add CD/DVD Device' => 'CD/DVD GerÃ¤t hinzufÃ¼gen',
'Add Hard Disk' => 'Festplatte hinzufÃ¼gen',
'Add Floppy Device' => 'Diskettenlaufwerk hinzufÃ¼gen',
'DVD Drive' => 'CD/DVD-Laufwerk',
'Empty' => 'Leer',
'Passthrough' => 'Passthrough',
'Live CD/DVD' => 'Live-CD/DVD',
'Solid-state drive' => 'SSD-Laufwerk',/*new*/
'Dynamically allocated storage' => 'dynamisch belegt', /*new*/
'Fixed size storage' => 'feste Größe',/*new*/  
'Unknown Device' => 'Unbekanntes GerÃ¤t',
'Host Drive' => 'Host Laufwerk',
'Add IDE Controller' => 'IDE Controller hinzufÃ¼gen',
'Add Floppy Controller' => 'Disketten Controller hinzufÃ¼gen',
'Add SCSI Controller' => 'SCSI Controller hinzufÃ¼gen',
'Add SATA Controller' => 'SATA Controller hinzufgen',
'Add SAS Controller' => 'SAS Controller hinzufÃ¼gen',
'LsiLogic' => 'LsiLogic',
'BusLogic' => 'BusLogic',
'IntelAhci' => 'AHCI',
'PIIX3' => 'PIIX3',
'PIIX4' => 'PIIX4',
'ICH6' => 'ICH6',
'I82078' => 'I82078',
'LsiLogicSas' => 'LsiLogic SAS',
'Differencing Disks' => 'Differencing Disks',
'No unused media message 1' => 'FÃ¼r die neu hinzugefÃ¼gten Anlagen ist kein freies Medium verfÃ¼gbar.',
'No unused media message 2' => 'Um den Assistenten fÃ¼r virtuelle Medien zu starten, drÃ¼cken Sie die SchaltflÃ¤che Anlagen. Um den Manager fÃ¼r virtuelle Medien zu starten, wÃ¤hlen Sie AuswÃ¤hlen.',
'storage attached indirectly' => 'Die Festplatte wird indirekt Ã¼ber ein neue andere Festplatte angeschlossen.',
'base disk indirectly attached' => 'Diese Festplatte ist indirekt Ã¼ber folgende andere Festplatte angeschlossen:',
'Attached to' => 'Verbunden mit',
'Not Attached' => 'Nicht verbunden',
'Set up the virtual hard disk' => 'Virtuelle Festplatte aufsetzen',
'Set up the virtual floppy drive' => 'Virtuelle Diskette aufsetzen',
'Set up the virtual CD/DVD drive' => 'Virtuelles CD/DVD-ROM-Laufwerk aufsetzen',
'Choose a virtual floppy disk file...' => 'Datei fÃ¼r virtuelle Diskette auswÃ¤hlen...',
'Choose a virtual CD/DVD disk file...' => 'Datei fÃ¼r virtuelles CD/DVD-ROM-Medium auswÃ¤hlen...',
'Choose a virtual hard disk file...' => 'Datei fÃ¼r virtuelle Festplatte auswÃ¤hlen...',
'Create a new hard disk...' => 'Neue Festplatte erzeugen...',
'Remove disk from virtual drive' => 'Medium entfernen',
'Image' => 'Datei', // CD/DVD or Floppy image
/*new* Add attachment dialogs */
'You are about to add a virtual hard disk to controller %s.' => 'Sie sind dabei, eine virtuelle Festplatte an den Controller %s anzuschließen.',
'Would you like to create a new, empty file to hold the disk contents or select an existing one?' => 'Möchten Sie eine neue leere Festplatte erzeugen oder möchten Sie ein bereits vorhandenes Plattenabbild verwenden?',
'Create new disk' => 'Neue Platte erzeugen',
'Choose existing disk' => 'Vorhandene Platte auswählen', 
'You are about to add a new CD/DVD drive to controller %s.' => 'Sie sind dabei, ein neues CD/DVD-ROM-Gerät an den Controller %s anzuschließen.',
'Would you like to choose a virtual CD/DVD disk to put in the drive or leave it empty for now?' => 'Möchten Sie ein Medium an das Laufwerk binden oder soll das Laufwerk jetzt kein Medium enthalten?',
'Choose disk' => 'Medium auswählen',
'Leave empty' => 'Kein Medium',
'You are about to add a new floppy drive to controller %s.' => 'Sie sind dabei, ein neues virtuelles Diskettenlaufwerk an den Controller %s anzuschließen.',
'Would you like to choose a virtual floppy disk to put in the drive or leave it empty for now?' => 'Möchten Sie ein existierendes Medium an das Laufwerk binden oder soll das Laufwerk jetzt kein Medium enthalten?',


'Serial Ports' => 'Serielle Schnittstellen',
'Port X' => 'Port %s', // %s will be replaced with port number
'Enable Serial Port' => 'Serielle Schnittstelle aktivieren',
'Port Number' => 'Portnummer',
'IRQ' => 'IRQ',
'I/O Port' => 'I/O-Port',
'User-defined' => 'benutzerdefiniert',
'Port Mode' => 'Portmodus',
'Disconnected' => 'nicht verbunden',
'HostPipe' => 'Host-Pipe',
'HostDevice' => 'Host-Schnittstelle',
'RawFile' => 'Datei',
'Create Pipe' => 'Erzeuge Pipe',
'Port/File Path' => 'Port/Datei-Pfad',

'Parallel Ports' => 'Parallel-Ports',
'Enable Parallel Port' => 'Parallele Schnittstelle aktivieren',
'Port Path' => 'Portpfad',

'USB' => 'USB',
'USB Controller' => 'USB Controller',
'Enable USB Controller' => 'USB Controller aktivieren',
'Enable USB 2.0 Controller' => 'USB 2.0 Controller aktivieren',
'USB Device Filters' => 'USB GerÃ¤te Filter',
'Add Empty Filter' => 'Leeren Filter hinzufÃ¼gen',
'Add Filter From Device' => 'Filter eines angeschlossen GerÃ¤ts hinzufÃ¼gen',
'Edit Filter' => 'Filter bearbeiten',
'Remove Filter' => 'Filter entfernen',
'Move Filter Up' => 'Filter vorrangig',
'Move Filter Down' => 'Filter nachrangig',
'Device Filters' => 'GerÃ¤tefilter',
'active' => 'aktiv',
'no devices available' => 'keine GerÃ¤te verfÃ¼gbar',

'USB Filter' => 'USB Filter',
'New Filter' => 'Neuer Filter',
'Vendor ID' => 'Lieferanten ID',
'Product ID' => 'Produkt ID',
'Revision' => 'Revision',
'Manufacturer' => 'Hersteller',
'Serial No' => 'Seriennummer',
'Remote' => 'Fern',

'Shared Folders' => 'Gemeinsame Ordner',
'Shared Folder' => 'Gemeinsamer Ordner',
'Folders List' => 'Ordnerliste',
'Machine Folders' => 'Ordner der virtuellen Maschine',
'Transient Folders' => 'Transiente Ordner',
'Path' => 'Pfad',
'Access' => 'Zugriff',
// read only & read/write
'ro' => 'nur Lesen',
'rw' => 'Lesen und Schreiben',
'Auto-Mount' => 'automatisch einbinden', // 3.2.8
'Make Permanent' => 'Permanent erzeugen',
'Full Access' => 'Vollzugriff',
'Add Shared Folder' => 'Gemeinsamen Ordner hinzufÃ¼gen',
'Edit Shared Folder' => 'Gemeinsamen Ordner bearbeiten',
'Remove Shared Folder' => 'Gemeinsamen Ordner entfernen',


'Audio' => 'Audio',
'Enable Audio' => 'Audio aktivieren',
'Host Audio Driver' => 'Host Audio Treiber',
'Audio Controller' => 'Audio Controller',

'WinMM' => 'Windows multimedia',
'Null Audio Driver' => 'Null Audio Treiber',
'OSS' => 'Open Sound System',
'ALSA' => 'Advanced Linux Sound Architecture',
'DirectSound' => 'Microsoft DirectSound',
'CoreAudio' => 'RudimentÃ¤res Audio',
'MMPM' => 'Reserved for historical reasons.', /* In API. May never see it in the real world */
'Pulse' => 'Pulse Audio',
'SolAudio' => 'Solaris Audio',

'HDA' => 'Intel HD Audio', // 3.2.8
'AC97' => 'ICH AC97',
'SB16' => 'SoundBlaster 16',

'Network' => 'Netzwerk',
'Adapter' => 'Adapter',
'Network Adapter' => 'Netzwerkadapter',
'Enable Network Adapter' => 'Netzwerkadapter aktivieren',
'Adapter Type' => 'Adaptertyp',
'Bridged Adapter' => 'NetzwerkbrÃ¼cke',
'Internal Network' => 'Internes Netzwerk',
'Host-only Adapter' => 'Host-only Adapter',
'Generic Driver' => 'Generischer Treiber', /*new*/
'VDE Adapter' => 'VDE Adapter',
'Promiscuous Mode' => 'Promiscuous-Modus',/*new*/
'Deny' => 'Deny', /*new*/
'Allow VMs' => 'VMs erlauben', /*new*/
'Allow All' => 'Allen erlauben', /*new*/
'Not attached' => 'nicht angeschlossen',
'Bridged adapter, %s' => 'NetzwerkbrÃ¼cke, %s', // %s will be replaced by adapter name
'Host-only adapter, \'%s\'' => 'Host-only Adapter, \'%s\'', // %s will be replaced by adapter name
'Internal network, \'%s\'' => 'Internes Netzwerk, \'%s\'', // %s will be replaced by network name
'VDE network, \'%s\'' => 'VDE-Netzwerk, \'%s\'', // %s will be replaced by network name
'Generic Driver, \'%s\'' => 'Generischer Treiber, \'%s\'', // %s will be replaced with driver name /*new*/
'NAT' => 'NAT',
'network' => 'netzwerk',
'Ethernet' => 'Ethernet',
'PPP' => 'PPP',
'SLIP' => 'SLIP',
'IPv4Addr' => 'IP Addresse',
'IPv6Addr' => 'IP(v6) Addresse',
'Mac Address' => 'MAC Addresse',
'Cable connected' => 'durch Kabel verbunden',
'netMediumType' => 'Typ',
'Guest Network Adapters' => 'Netzwerkadapter des Gastes',
'Port Forwarding' => 'Port-Weiterleitung',
'Port Forwarding Rules' => 'Regel fÃ¼r Port-Weiterleitung',
'Protocol' => 'Protokoll',
'Host IP' => 'Host-IP',
'Host Port' => 'Host-Port',
'Guest IP' => 'Gast-IP',
'Guest Port' => 'Gast-Port',
'TCP' => 'TCP',
'UDP' => 'UDP',
'Rule' => 'Regel',
'Insert new rule' => 'Neue Regel hinzufÃ¼gen',
'Delete selected rule' => 'AusgewÃ¤hlte Regel entfernen',
'Invalid IP Address' => 'UngÃ¼ltige IP-Adresse',
'The current port forwarding rules are not valid' => 'Die Regeln fÃ¼r die Port-Weiterleitung enthalten momentan Fehler. Keiner der Host- oder Gast-Ports darf Null sein.',


'Am79C970A' => 'AMD PCNet-PCI II Netzwerkadapter',
'Am79C973' => 'AMD PCNet-FAST III Netzwerkadapter',
'I82540EM' => 'Intel PRO/1000 MT Desktop Netzwerkadapter',
'I82543GC' => 'Intel PRO/1000 T Server Netzwerkadapter',
'I82545EM' => 'Intel PRO/1000 MT Server Netzwerkadapter',
'Virtio' => 'Virtio NetzwerkgerÃ¤t',


// Machine states
'PoweredOff' => 'Ausgeschaltet',
'Saved' => 'Gespeichert',
'Teleported' => 'Ãœbertragen',
'Aborted' => 'Abgebrochen',
'Running' => 'LÃ¤uft',
'Paused' => 'Angehalten',
'Stuck' => 'Klemmt',
'Teleporting' => 'Ãœbertragen',
'LiveSnapshotting' => 'Live Snapshotting',
'Starting' => 'Starten',
'Stopping' => 'Stoppen',
'Saving' => 'Speichern',
'Restoring' => 'Wiederherstellen',
'TeleportingPausedVM' => 'Ãœbertrage angehaltene VM',
'TeleportingIn' => 'Ãœbertrage',
'RestoringSnapshot' => 'Momentaufnahme wiederherstellen',
'DeletingSnapshot' => 'Momentaufnahme lÃ¶schen',
'SettingUp' => 'Vorbereitung',

// list separator
'LIST_SEP' => ', ',

// Sizes
'B' => 'B',
'KB' => 'KB',
'MB' => 'MB',
'GB' => 'GB',
'TB' => 'TB',

// Virtual Media Manager
'Open Virtual Media Manager' => 'Manager fÃ¼r virtuelle Medien Ã¶ffnen',
'Virtual Media Manager' => 'Manager fÃ¼r virtuelle Medien',
'Are you sure remove medium' => 'Sind Sie sicher, dass Sie das Medium %s aus der Liste der bekannten Medien lÃ¶schen mÃ¶chten?',
'Medium remove note' => 'Beachten Sie, dass das Medium nicht vom DatentrÃ¤ger gelÃ¶scht wird. Sie kÃ¶nnen es zu einem spÃ¤teren Zeitpunkt wieder zur Liste hinzufÃ¼gen.',
'Are you sure release medium' => 'Sind Sie sicher, dass Sie das Medium %s freigeben mÃ¶chten?',
'This will detach from' => 'Dies wird es von diesen virtuellen Machinen: %s trennen.',
'Please select a medium.' => 'Bitte wÃ¤hlen Sie ein Medium.',
'VMM Remove Media Message1' => 'Sind Sie sicher, dass Sie dieses Medium %s vom DatentrÃ¤ger lÃ¶schen mÃ¶chten?',
'VMM Remove Media Message2' => 'Wenn Sie LÃ¶schen wÃ¤hlen, wird das Medium endgÃ¼ltig gelÃ¶scht <b>Diese Aktion kann nicht rÃ¼ckgÃ¤ngig gemacht werden.</b>',
'VMM Remove Media Message3' => 'Wenn Sie Behalten wÃ¤hlen, wird das Medium nur von der Liste der bekannten Festplatten entfernt und bleibt auf dem DatentrÃ¤ger erhalten. Sie kÃ¶nnen es zu einem spÃ¤teren Zeitpunkt wieder zur Liste hinzufÃ¼gen.',
'Normal' => 'Normal',
'Writethrough' => 'durchschreibend',
'Immutable' => 'nicht veränderlich',
'Actions' => 'Aktionen',
'Remove' => 'Entfernen',
'Release' => 'Freigeben',
'Hard Disks' => 'Festplatten',
'CD/DVD Images' => 'CD/DVD-Abbilder',
'Floppy Images' => 'Diskettenabbilder',
'Storage Details' => 'Art der Abspeicherung',/*new*/
'Shareable' => 'gemeinsam benutzbar',/*new*/
'Multi-attach' => 'mehrfach anschließbar',/*new*/
'Copy' => 'Kopieren',/*new*/
'Format' => 'Format',/*new*/
'Differencing' => 'differentiell',/*new*/

/* Generic Wizard Message */
'wizard buttons message' => 'Wählen Sie <b>%1</b>, um auf die nächste Seite zu gelangen oder <b>%2</b>, um auf die vorherige Seite zurückzukehren. Wählen Sie <b>%3</b>, um den Assistenten zu beenden.',/*new*/

/* Copy HD Wizard */
'Copy Virtual Disk' => 'Virtuelle Festplatte kopieren',/*new*/
'Welcome to the virtual disk copying wizard' => 'Virtuelle Platte kopieren',/*new*/
'copyHD Step1 Message1' => 'Dieser Assistent unterstützt Sie bei der Erzeugung einer Kopie einer virtuellen Platte.',/*new*/
'copyHD Step1 Message3' => 'Bitte wählen Sie eine virtuelle Festplatte zum Kopieren aus. Diese können Sie entweder aus der Liste oder mit Hilfe des Icons neben der Liste mittels Dateidialog auswählen.',/*new*/
'Virtual disk to copy' => 'Zu kopierende Festplatte',/*new*/
'Virtual disk file type' => 'Dateityp der virtuellen Platte',/*new*/
'copyHD Step2 Message1' => 'Bitte wählen Sie den Dateityp für die neue virtuelle Festplatte. Falls Sie diese nicht mit andere Virtualisierungssoftware verwenden, können Sie diese Einstellung unverändert lassen.',/*new*/
'Virtual disk file location' => 'Ort der virtuellen Datei',/*new*/
'copyHD Step4 Message1' => 'Wählen Sie <b>Auswählen</b> um den Ort der Datei festzulegen oder bestimmen Sie direkt einen Dateinamen.',/*new*/
'copyHD Step5 Message1' => 'Es wird eine Kopie der virtuellen Festplatte mit den folgenden Parametern erstellt:',/*new*/
'%s_copy' => '%s_Kopie',/*new*/

/* Clone VM wizard */
'Clone' => 'Klonen', /* new */
'%s Clone' => '%s-Klon', // %s will be replaced with VM name /*new*/
'Clone a virtual machine' => 'Virtuelle Maschine klonen', /*new*/
'cloneVM Welcome' => 'Klone-Assistent', /*new*/
'cloneVM Step1 Message1' => 'Dieser Assistent hilft Ihnen bei der Erstellung eines Klones (einer exakten Kopie) einer virtuellen Maschine.', /*new*/
'cloneVM Step1 Message3' => 'Bitte wählen Sie einen Namen für die neue virtuelle Maschine:',/*new*/
'Cloning Configuration' => 'Auswahl der Zustände',/*new*/
'cloneVM Step2 Message1' => 'Bitte wählen Sie, welche Zustände der virtuellen Maschine geklont werden sollen.',/*new*/
'cloneVM Step2 Message2' => 'Falls Sie <b>Aktueller Zustand&lt;/b&gt; wählen, wird nur der aktuelle Zustand der virtuellen Maschine geklont.',/*new*/
'cloneVM Step2 Message3' => 'If you select <b>Current machine state</b>, only the current state of the virtual machine is cloned. If you select <b>Current machine and all child states</b> the current state of the virtual machine and any states of child snapshots are cloned. If you select <b>All states</b>, the current machine state and all snapshots are cloned.',/*new*/
'Current machine state' => 'Current machine state',/*new*/
'Current machine and all child states' => 'Current machine and all child states',/*new*/
'All states' => 'All states',/*new*/

/* New hard disk wizard */
'Create New Virtual Disk' => 'Neue virtuelle Festplatte anlegen',
'newDisk Welcome' => 'Erstellen einer virtuellen Festplatte', /*new*/
'newDisk Step1 Message1' => 'Dieser Assistent unterstützt Sie bei der Erzeugung einer neuen virtuellen Festplatte.',/*new*/
'newDisk Step1 Message3' => 'Bitte wählen Sie den Dateityp für die neue virtuelle Festplatte. Falls Sie diese nicht mit andere Virtualisierungssoftware verwenden, können Sie diese Einstellung unverändert lassen.',/*new*/
'File Type' => 'Dateityp',/*new*/
'VDI (VirtualBox Disk Image)' => 'VDI (VirtualBox Disk Image)',/*new*/
'VMDK (Virtual Machine Disk)' => 'VMDK (Virtual Machine Disk)',/*new*/
'VHD (Virtual Hard Disk)' => 'VHD (Virtual Hard Disk)',/*new*/ 
'Virtual disk storage details' => 'Art der virtuellen Platte',/*new*/
'newDisk Step2 Message1' => 'Bitte wählen Sie, ob die neue virtuelle Festplatte erst nach und nach zur Laufzeit alloziert werden soll oder ob die Platte jetzt sofort vollständig alloziert werden soll.', /*new*/
'newDisk Step2 dynamic' => 'Eine <b>dynamisch allozierte</b> Datei einer virtuellen Platte belegt nur dann Platz auf der physischen Platte des Hosts, wenn der Gast Daten schreibt. Einmal belegter Platz wird nicht automatisch freigegeben.', /*new*/
'newDisk Step2 fixed' => 'Das Erzeugen einer Datei <b>fester Größe</b> dauert auf manchen Systemen länger aber bietet eine etwas bessere Performance.',/*new*/
'Storage details' => 'Art der Abspeicherung',/*new*/
'Dynamically allocated' => 'dynamisch alloziert',/*new*/
'Fixed size' => 'feste Größe',/*new*/
'Virtual disk file location and size' => 'Virtual disk file location and size',/*new*/
'newDisk Step3 Message1' => 'Wählen Sie <b>Auswählen</b> um den Ort der Datei festzulegen oder bestimmen Sie direkt einen Dateinamen.',/*new*/
'newDisk Step3 Message2' => 'Legt die Größe der virtuellen Platte in Megabyte fest. Diese Größenangabe wird an den Gast als die Größe der virtuellen Platte übermittelt.',/*new*/
'Summary' => 'Zusammenfassung',
'newDisk Step4 Message1' => 'Sie legen eine Festplatte mit folgenden Eigenschaften an:',
'newDisk Step4 Message2' => 'DrÃ¼cken Sie die SchaltflÃ¤che Beenden, wenn diese Angaben korrekt sind. Damit wird die neue Festplatte angelegt.',

/* New virtual machine wizard */
'Create New Virtual Machine' => 'Neue virtuelle Maschine anlegen',
'New Virtual Machine Wizard' => 'Assistent fÃ¼r virtuelle Maschinen',
'newVM Welcome' => 'Willkommen beim Assistenten fÃ¼r neue virtuelle Maschinen!',
'newVM Step1 Message1' => 'Dieser Assistent begleitet Sie auf den notwendigen Schritten, um eine neue virtuelle Maschine mit Virtualbox anzulegen.',
'VM Name and OS Type' => 'VM Name und Betriebssystem',
'newVM Step2 Message1' => 'Geben Sie der neuen virtuellen Maschine einen Namen und wÃ¤hlen Sie das Betriebssystem, das Sie in diese Maschine isntallieren mÃ¶chten.',
'newVM Step2 Message2' => 'Nutzen Sie den Namen, um einen Hinweis auf die Verwendung und/oder Konfiguration der virtuellen Maschine zu haben. VirtualBox und Komponenten verwenden diesen Namen zur Identifizierung .',
'newVM Step3 Message1' => 'Geben Sie die GrÃ¶ÃŸe des Hauptspeichers (RAM) in Megabytes an, den diese Maschine erhalten soll.',
'newVM Step3 Message2' => 'Vorgeschlagene GrÃ¶ÃŸe %s MB.', /* %s will be replaced with the recommended memory size at run time */
'Base Memory Size' => 'Größe Hauptspeicher',/*new*/
'Virtual Hard Disk' => 'Virtuelle Festplatte',
'Boot Hard Disk' => 'Startplatte',
'Create new hard disk' => 'Neue Festplatte anlegen',
'Use existing hard disk' => 'Vorhandene Festplatte nutzen',
'newVM Step4 Message1' => 'Wählen Sie ein Abbild einer Festplatte, die als Bootplatte der virtuellen Maschine dienen soll. Sie können entweder eine neue Festplatte erzeugen oder existierendes Abbild durch Klicken auf den entsprechenden Schaltknopf auswählen (öffnet einen entsprechenden Dialog).&lt;/p&gt;&lt;p&gt;Falls die virtuelle Platte zusätzliche Parameter benötigt, kann dieser Schritt auch übersprungen werden und ein Abbild später über den VM-Einstellungs-Dialog angeschlossen werden.',/*new*/
'newVM Step4 Message2' => 'Sie kÃ¶nnen diesen Schritt auch Ã¼berspringen und komplexere Einstellungen spÃ¤ter Ã¼ber den Manager fÃ¼r virtuelle Maschinen vornehmen.',
'newVM Step4 Message3' => 'Vorgeschlagene GrÃ¶ÃŸe %s.', /* %s will be replaced with the recommended memory size at run time */
'newVM Step5 Message1' => 'Sie legen eine neue virtuelle Maschine mit folgenden Eigenschaften an:',
'newVM Step5 Message2' => 'DrÃ¼cken Sie die SchaltflÃ¤che Beenden, Wenn diese Angaben korrekt sind. Damit wird die virtuelle Maschine angelegt.',
'newVM Step5 Message3' => 'Sie kÃ¶nnen die Eigenschaften der virtuellen Maschine jederzeit Ã¼ber das HauptmenÃ¼, Bearbeiten - Einstellungen Ã¤ndern.',

/* VM Log files */
'Show Log' => 'Protokoll anzeigen',
'Logs' => 'Protokolle',
'No logs found.' => 'FÃ¼r die ausgewÃ¤hlte virtuelle Maschine wurden keine Protokolle gefunden.',

/* Import / Export Appliances */
'Export Appliance' => 'Appliance exportieren',
'Appliance Export Wizard' => 'Assistent fÃ¼r den Export einer Appliance',
'Appliance Export Wizard Welcome' => 'Willkommen beim Assistenten fÃ¼r den Export von Appliances!',
'appExport Step1 Message1' => 'Dieser Assistent begleitet Sie auf den notwendigen Schritten, die zum Export einer Appliance notwendig sind.',
'appExport Step1 Message3' => 'Bitte wÃ¤hlen Sie die virtuelle(n) Maschine(n), die zu einer Appliance hinzugefÃ¼gt werden sollen. Achten Sie darauf, dass diese Maschinen vor dem Export ausgeschaltet sind.',
'Appliance Export Settings' => 'Appliance Export Einstellungen',
'appExport Step2 Message1' => 'Bitte wÃ¤hlen Sie einen Dateinamen fÃ¼r den Export als OVF/OVA. Bei Angabe der ova-Dateiendung werden alle Dateien in ein OVA-(Open Virtualization Format)-Archiv geschrieben. Bei Angabe der Endung ovf werden einzelne Dateien geschrieben. Andere Dateiendungen sind nicht erlaubt.',
'appExport Step3 Message1' => 'Hier kÃ¶nnen Sie weitere Einstellungen der ausgewÃ¤hlten virtuellen Maschinen Ã¤ndern. Sie kÃ¶nnen die meisten der gezeigten Eigenschaften durch Doppelklick auf den Eintrag Ã¤ndern.',
'Import Appliance' => 'Appliance importieren',
'Appliance Import Wizard' => 'Assistent fÃ¼r den Import einer Appliance',
'Appliance Import Wizard Welcome' => 'Willkommen beim Assistenten fÃ¼r den Import virtueller Maschinen!',
'appImport Step1 Message1' => 'Dieser Assistent begleitet Sie auf den notwendigen Schritten, die zum Import einer Appliance notwendig sind.',
'appImport Step1 Message3' => 'VirtualBox kann derzeit Appliances importieren, die im Open Virtualization Format (OVF) gespeichert sind. Um Fortzufahren, wÃ¤hlen Sie eine Datei zum Import aus:',
'Appliance Import Settings' => 'Appliance Import Einstellungen',
'appImport Step2 Message1' => 'Die Appliance enthÃ¤lt diese Maschinen und ihre vorgeschlagenen Einstellungen. Sie kÃ¶nnen die meisten Einstellungen durch Doppelklick oder an/abwÃ¤hlen nachstehender Auswahlboxen Ã¤ndern.',
'appImport Step3 Message1' => 'Bitte geben Sie einen Dateinamen fÃ¼r den Import der OVF an.',
'Write legacy OVF' => 'in altem  OVF 0.9 speichern',
'Write Manifest file' => 'Schreibe Manifest-Datei',
'Virtual System X' => 'Virtuelles System %s', // %s will be replaced with the virtual system number
'Product' => 'Produkt',
'Product-URL' => 'Produkt-URL',
'Vendor' => 'Lieferant',
'Vendor-URL' => 'Lieferanten-URL',
'License' => 'Lizenz',
'Hard Disk Controller' => 'Festplatten Controller',
'Virtual Disk Image' => 'Virtuelle Festplatte',
'Warnings' => 'Warnungen',

/* Operation in progress onUnLoad warning message */
'Operation in progress' => 'Warnung: Interne Aktion lÃ¤uft. Wenn Sie dieses Fenster schlieÃŸen oder diese Seite verlassen, kann das zu unerwÃ¼nschten oder unbeabsichtigten Effekten fÃ¼hren. Bitte warten Sie bis die Aktion abgeschlossen ist.',
'Loading ...' => 'LÃ¤dt ...', // "loading ..." screen

/* Versions */
'Unsupported version' => 'Sie verwenden eine noch nicht getestete Version von VirtualBox (%s) mit phpVirtualbox. Unbekannte und unvorhersehbare Ergebnisse kÃ¶nnen auftreten.',
'Do not show message again' => 'Diese Meldung nicht mehr anzeigen.',

/* Fatal connection error */
'Fatal error' => 'Bei der Kommunikation mit dem vboxwebsrv ist ein Fehler aufgetreten. Bevor dieser Fehler nicht behoben wird und diese Seite neu geladen wurde, werden von phpVirtualBox keine Anfragen mehr gesendet. Einzelheiten entnehmen Sie der folgenden Dialogbox.',

/* Guest properties error */
'Unable to retrieve guest properties' => 'Die Eigenschaften des Gastes kÃ¶nnen nicht ermittelt werden. Stellen Sie sicher, das die Maschine lÃ¤uft und die Gasterweiterungen von VirtualBox installiert sind.',

/*Remote Console */
'User name' => 'Benutzername',
'Password' => 'Passwort',
'Connecting to' => 'Verbinden mit',
'Connected to' => 'Verbunden mit',
'Requested desktop size' => 'Angeforderte BildschirmgÃ¶ÃŸe',
'Connect' => 'Verbinden',
'Detach' => 'Trennen',
'Disconnect' => 'Trennen',
"Ctrl-Alt-Del" => "Send Ctrl-Alt-Del",
'Disconnect reason' => 'Grund fÃ¼r die Trennung',
"Redirection by" => "Redirection by",
'Virtual machine is not running or RDP configured.' => 'Die virtuelle Maschine lÃ¤uft nicht oder sie ist nicht fÃ¼r Zugriffe Ã¼ber RDP konfiguriert.',

/* Guest Additions */
'Install Guest Additions' => 'Gasterweiterungen installieren',
'Guest Additions Mounted' => 'Das CD-Abbild mit den Gasterweiterungen wurde erfolgreich an ein CD/DVD-Laufwerk der virtuellen Maschine gebunden. Um den Installationsvorgang abzuschlieÃŸen mÃ¼ssen Sie sich in die virtuelle Maschine einloggen und die Installation der Virtualbox Gasterweiterungen vornehmen.',
'Guest Additions No CDROM' => 'Das CD-Abbild mit den Gast-Erweiterungen konnte nicht an die Maschine gebunden werden, da diese Maschine kein CD/DVD-Laufwerk besitzt. Bitte fÃ¼gen Sie ein solches auf der Seite Massenspeicher der Einstellungen fÃ¼r die virtuelle Maschine hinzu.',

/* USB devices */
'USB Device' => 'USB-GerÃ¤t', // USB device name
'USB Attached' => 'angeschlossen', // Is it attached to the VM
'USB Available' => 'verfÃ¼gbar', // 	Is it available

/* VM List Tooltip
 * %1 replaced with VM Name
 * %2 replaced with VM state
 * %3 replaced with time since state change
 * %4 replaced with session state (locked or unlocked)
 * */
'<nobr>%1</nobr><br /><nobr>%2 since %3</nobr><br /><nobr>Session %4</nobr>' => '<nobr>%1</nobr><br /><nobr>%2 seit %3</nobr><br /><nobr>Session %4</nobr>',
// Session states
'Locked' => 'gesperrt',
'Unlocked' => 'entsperrt',
'Unlocking' => 'wird entsperrt',

/* Operating Systems */
'Other' => 'Anderes/Unbekannt',
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
'WindowsNT' => 'Anderes Windows',
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
'Linux' => 'Anderes Linux',
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
