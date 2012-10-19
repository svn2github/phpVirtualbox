<?php

/*
 * French / France language file
 *
 * The decision to use PHP for language files instead of JS
 * was made in case the PHP back-end needs to inject translated
 * messages into the interface.
 *
 * $Id: en_us.php 697 2010-07-08 02:31:17Z ian $
 *
 */

class language {

public static $trans = array(

// General actions
'File' => 'Fichier',
'Edit' => 'Modifier',
'Save' => 'Enregistrer',
'OK' => 'OK',
'Cancel' => 'Annuler',
'Create' => 'Créer',
'Select' => 'Séléctionner',
'Up' => 'Haut',
'Down' => 'Bas',
'Yes' => 'Oui',
'No' => 'Non',
'Close' => 'Fermer',
'Any' => 'Quelconque',
'New' => 'Créer',
'Delete' => 'Supprimer',
'Keep' => 'Conserver',
'Settings' => 'Configuration',
'Preferences' => 'Préférences',
'Refresh' => 'Actualiser',
'Start' => 'Démarrer',
'Power Off' => 'Extinction',
'Details' => 'Détails',
'Console' => 'Console',
'Description' => 'Description',
'Configuration' => 'Configuration',
'Operating System' => 'Système d\'exploitation',
'Machine' => 'Machine',
'Enabled' => 'Activer',
'Disabled' => 'Désactiver',
'Hosting' => 'Hébergeur',
'Basic' => 'Simple',
'Advanced' => 'Avancé',
'None' => 'Aucun',
'Help' => 'Aide',
'About' => 'A propos',
'Version' => 'Version',
'VirtualBox User Manual' => 'Manuel utilisateur de VirtualBox',
'Operation Canceled' => 'Opération annulée',
'Next' => 'Suivant',
'Back' => 'Précédent',
'Finish' => 'Terminer',
'Select File' => 'Sélectionner un fichier',
'Select Folder' => 'Sélectionner un dossier',

// Power button
'Pause' => 'Pause',
'Reset' => 'Redémarrer',
'Save State' => 'Enregistrer l\'état',
'ACPI Power Button' => 'ACPI Power Boutton',
'ACPI Sleep Button' => 'ACPI Sleep Boutton',
'ACPI event not handled' => 'L\'événement ACPI n\'a pas été traité par la machine virtuelle.',


'Approx X remaining' => '%s restant(es)', /* %s will be replaced with a time. E.g. Approx 2 minutes, 4 seconds remaining */
'X ago' => 'il y as %s', /* %s will be replaced with a time. E.g. 20 hours ago */
'minutes' => 'minutes',
'seconds' => 'secondes',
'hours' => 'heures',
'days' => 'jours',

/* Snapshots */
'Snapshots' => 'Instantanés',
'Snapshot Folder' => 'Dossier des instantanés',
'Current State' => 'État actuel',
'Restore' => 'Restaurer',
'Restore Snapshot' => 'Restaurer un instantané',
'Take Snapshot' => 'Prendre un instantané',
'Delete Snapshot' => 'Supprimer un instantané',
'Snapshot Details' => 'Afficher les détails',
'Snapshot Name' => 'Nom de l\'instantané',
'Snapshot Description' => 'Description de l\'instantané',
'Restore Snapshot Message' => 'Êtes-vous sûr de vouloir restaurer l\'instantané %s? Vous perdrez définitivement l\'état actuel de votre machine.',
'Delete Snapshot Message1' => 'Supprimer cet instantané entrainera la perte de toutes les informations d\'état qui y sont sauvegardées, et la fusion des données de disques virtuels répartis sur plusieurs fichiers en un seul. Ce processus peut durer longtemps et est irréversible.',
'Delete Snapshot Message2' => 'Voulez-vous vraiment effacer l\'instantané %s?',
'Taken' => 'Prise',
'changed' => 'modifier',

/* Discard State */
'Discard' => 'Oublier',
'Discard Message1' => 'Êtes-vous sûr de vouloir oublier l\'état sauvegardé pour la machine virtuelle %s?', // %s willl be replaced with VM name
'Discard Message2' => 'Ceci revient à redémarrer l\'ordinateur virtuel sans que son système d\'exploitation ne s\'éteigne proprement.',

/* Delete or Unregister Inaccessible Machine */
'VM Inaccessible' => 'La VM sélectionnée est inaccessible. Prenez en compte le message d\'erreur ci-dessous et appuyez sur le bouton Actualiser si vous voulez répéter la vérification de l\'accessibilité.',
'Delete VM Message1' => 'Voulez-vous vraiment supprimer la machine virtuelle %s?',
'Delete VM Message2' => 'Cette opération est irréversible.',
'Unregister VM Message1' => 'Êtes-vous sûr de vouloir supprimer la machine virtuelle inaccessible %s?',
'Unregister VM Message2' => 'Vous ne pourrez pas l\'enregistrer à nouveau dans l\'interface graphique.',
'Unregister' => 'Libérer',

/* Error fetching machines */
'Error vmlist 1' => 'Une erreur est survenue lors de la récupération de la liste des machines virtuelles enregistrées à partir de VirtualBox. Assurez-vous que vboxwebsrv est lancé et que les paramètres du fichier config.php sont corrects.',
'Error vmlist 2' => 'La liste des machines virtuelles ne sera plus rafraichi automatiquement jusqu\'à ce que cette page soit rechargée.',

/* Properties */
'host' => 'Hôte VirtualBox',
'Port' => 'Port',
'General' => 'Général',
'Name' => 'Nom',
'OS Type' => 'Type OS',

/* Options in Preferences / Global Settings */
'Default Hard Disk Folder' => 'Dossier par défaut des disques durs',
'Default Machine Folder' => 'Dossiers par défaut des machines',
'VRDP Authentication Library' => 'Authentication VRDP par défaut',
'Add host-only network' => 'Ajouter réseau privé hôte',
'Remove host-only network' => 'Supprimer réseau privé hôte',
'Edit host-only network' => 'Modifier réseau privé hôte',
'Host-only Network Details' => 'Détails réseau privé hôte',
'Host-only Networks' => 'Réseau privé hôte',
'IPv4Mask' => 'Masque réseau IPv4',
'IPv6Mask' => 'Longueur du masque réseau IPv6',
'Server Address' => 'Adresse du serveur',
'Server Mask' => 'Masque du serveur',
'Lower Address Bound' => 'Limite inférieure des addresses',
'Upper Address Bound' => 'Limite supérieure des addresses',
'DHCP Server' => 'Serveur DHCP',
'DHCP enabled' => 'DHCP activée',
'Manually configured' => 'Configuration manuelle',
'Delete Interface Message1' => 'Si vous enlevez ce réseau privé hôte, l\'interface correspondante de la machine hôte sera également enlevée. Voulez-vous vraiment enlever cette interface %s?',
'Delete Interface Message2' => 'Note : cette interface est peut-être utilisée par d\'autres machines virtuelles. Si vous l\'enlevez, ces interfaces ne seront plus utilisables jusqu\'à ce que vous modifiez leur configuration en choisissant un autre réseau privé hôte ou un autre mode d\'accès.',

'System' => 'Système',
'Base Memory' => 'Mémoire vive',
'Memory' => 'Mémoire',
'free' => 'libre', // as in free/available memory
'Enable IO APIC' => 'Activer les IO APIC',
'Enable EFI' => 'Activer EFI (OS spéciaux seulement)',
'Hardware clock in UTC time' => 'Horloge interne en UTC',
'Processors' => 'Processeur(s)',
'Boot Order' => 'Ordre d\'amorçage',
'Removable Media' => 'Média amovible',
'Remember Runtime Changes' => 'Enregistrer les changements pendant l\'éxécution',
'Motherboard' => 'Carte mère',
'Acceleration' => 'Accélération',
'Extended Features' => 'Fonctions avancées',
'CPUs' => 'CPUs',
'VCPU' => 'VT-x/AMD-V',
'Nested Paging' => 'Pagination imbriquée',
'Hardware Virtualization' => 'Virtualisation matérielle',
'Enable VCPU' => 'Activer VT-x/AMD-V',
'Enable Nested Paging' => 'Activer pagination imbriquée',
'Enable PAE/NX' => 'Activer PAE/NX',

'Display' => 'Affichage',
'Video' => 'Vidéo',
'Video 2d' => '2D Accélération',
'Video 3d' => '3D Accélération',
'Video Memory' => 'Mémoire Vidéo',

'Remote Display' => 'Bureau à distance',
'Remote Console' => 'Console à distance (RDP)',
'Ports' => 'Ports',
'Net Address' => 'Adresse réseau',
'Enable Server' => 'Activer serveur',
'Server Port' => 'Port serveur',
'Authentication Timeout' => 'Délai d\'attente d\'authentification',
'Authentication Method' => 'Méthode d\'authentification',
'External' => 'Externe',
'Guest' => 'Invité',

'Storage' => 'Stockage',
'Storage Tree' => 'Arboresence Stockage',
'Attributes' => 'Attribut',
'Type' => 'Type',
'Slot' => 'Emplacement',
'Size' => 'Taille',
'Virtual Size' => 'Taille virtuelle',
'Actual Size' => 'Taille réelle',
'Location' => 'Emplacement',
'Information' => 'Information',
'Use host I/O cache' => 'Utiliser le cache E/S de l\'hôte',
'IDE Controller' => 'Contrôleur IDE',
'Primary Master' => 'Maître primaire',
'Primary Slave' => 'Esclave primaire',
'Secondary Master' => 'Maître secondaire',
'Secondary Slave' => 'Esclave secondaire',
'Floppy Controller' => 'Contrôleur disquettes',
'Floppy Device' => 'Lecteur disquette',
'SCSI Controller' => 'Contrôleur SCSI',
'SCSI Port' => 'Port SCSI',
'SATA Controller' => 'Contrôleur SATA',
'SATA Port' => 'Port SATA',
'SAS Controller' => 'Contrôleur SAS',
'SAS Port' => 'Port SAS',
'HardDisk' => 'Disque dur',
'Floppy' => 'Disquette',
'DVD' => 'CD/DVD',
'Type (Format)' => 'Type (Format)',
'Add Attachment' => 'Ajouter périphérique',
'Remove Attachment' => 'Supprimer périphérique',
'Add Controller' => 'Ajouter contrôleur',
'Remove Controller' => 'Supprimer contrôleur',
'Add CD/DVD Device' => 'Ajouter périphérique CD/DVD',
'Add Hard Disk' => 'Ajouter un disque dur',
'Add Floppy Device' => 'Ajouter périphérique disquette',
'DVD Device' => 'Périphérique CD/DVD',
'Empty' => 'Vide',
'Passthrough' => 'Mode direct',
'Unknown Device' => 'Périphérique inconnu',
'Host Drive' => 'Lecteur hôte',
'Add IDE Controller' => 'Ajouter contrôleur IDE',
'Add Floppy Controller' => 'Ajouter contrôleur disquette',
'Add SCSI Controller' => 'Ajouter contrôleur SCSI',
'Add SATA Controller' => 'Ajouter contrôleur SATA',
'Add SAS Controller' => 'Ajouter contrôleur SAS',
'LsiLogic' => 'LsiLogic',
'BusLogic' => 'BusLogic',
'IntelAhci' => 'AHCI',
'PIIX3' => 'PIIX3',
'PIIX4' => 'PIIX4',
'ICH6' => 'ICH6',
'I82078' => 'I82078',
'LsiLogicSas' => 'LsiLogic SAS',
'Differencing Disks' => 'Disques durs différentiels',
'No unused media message 1' => 'Aucun média non utilisé disponible pour le nouvel attachement.',
'No unused media message 2' => 'Appuyez sur le bouton Créer pour démarrer l\'assistant nouveau disque virtuel et créer un nouveau support, ou appuyez sur Sélectionner si vous souhaitez ouvrir le gestionnaire de médias virtuels.',
'storage attached indirectly' => 'Attachement indirecte en utilisant un disque dur de différenciation.',
'base disk indirectly attached' => 'Ce disque dur de base est connecté indirectement à travers le disque dur différentiel suivant :',
'Attached to' => 'Attaché à',
'Not Attached' => 'Aucune connexion',

'USB' => 'USB',
'USB Controller' => 'USB Contrôler',
'Enable USB Controller' => 'Activer le contrôler USB',
'Enable USB 2.0 Controller' => 'Activer le contrôler USB 2.0 (EHCI)',
'USB Device Filters' => 'Filtre périphérique USB',
'Add Empty Filter' => 'Ajouter un filtre vide',
'Add Filter From Device' => 'Ajouter un filtre depuis un périphérique',
'Edit Filter' => 'Modifier filtre',
'Remove Filter' => 'Supprimer filtre',
'Move Filter Up' => 'Déplacer le filtre vers le haut',
'Move Filter Down' => 'Déplacer le filtre vers le bas',
'Device Filters' => 'Filtres',
'active' => 'active',

'USB Filter' => 'Filtre USB',
'New Filter' => 'Nouveau filtre',
'Vendor ID' => 'ID du vendeur',
'Product ID' => 'ID du produit',
'Revision' => 'Révision',
'Manufacturer' => 'Fabricant',
'Serial No' => 'N° de série',
'Remote' => 'A distance',

'Shared Folders' => 'Dossiers partagés',
'Shared Folder' => 'Dossier partagé',
'Folders List' => 'Liste des dossiers',
'Path' => 'Chemin',
'Access' => 'Accès',
// read only & read/write
'ro' => 'Lecture seule',
'rw' => 'Inscriptible',
'Full Access' => 'Plein',
'Add Shared Folder' => 'Ajouter un dossier partagé',
'Edit Shared Folder' => 'Modifier un dossier partagé',
'Remove Shared Folder' => 'Supprimer un dossier partagé',


'Audio' => 'Son',
'Enable Audio' => 'Activer le son',
'Host Audio Driver' => 'Pilote audio hôte',
'Audio Controller' => 'Controleur audio',

'WinMM' => 'Windows multimedia',
'Null Audio Driver' => 'Null Audio Driver',
'OSS' => 'Open Sound System',
'ALSA' => 'Advanced Linux Sound Architecture',
'DirectSound' => 'Microsoft DirectSound',
'CoreAudio' => 'Core Audio',
'MMPM' => 'Reserved for historical reasons.', /* In API. May never see it in the real world */
'Pulse' => 'Pulse Audio',
'SolAudio' => 'Solaris Audio',

'AC97' => 'ICH AC97',
'SB16' => 'SoundBlaster 16',

'Network' => 'Réseau',
'Adapter' => 'Interface',
'Network Adapter' => 'Carte réseau',
'Enable Network Adapter' => 'Activer la carte réseau',
'Adapter Type' => 'Type de carte',
'adapter' => 'carte',
'Bridged' => 'Pont',
'Bridged Adapter' => 'Accès par pont',
'HostOnly' => 'privé hôte',
'Internal' => 'interne',
'Internal Network' => 'Réseau interne',
'Host-only Adapter' => 'Réseau privé hôte',
'NAT' => 'NAT',
'network' => 'réseau',
'Ethernet' => 'Ethernet',
'PPP' => 'PPP',
'SLIP' => 'SLIP',
'IPv4Addr' => 'Adresse IPv4',
'IPv6Addr' => 'Adresse IPv6',
'Mac Address' => 'Adresse MAC',
'Cable connected' => 'Câble branché',
'netMediumType' => 'Type',
'Guest Network Adapters' => 'Carte réseau invité',


'Am79C970A' => 'AMD PCNet-PCI II network card',
'Am79C973' => 'AMD PCNet-FAST III network card',
'I82540EM' => 'Intel PRO/1000 MT Desktop network card',
'I82543GC' => 'Intel PRO/1000 T Server network card',
'I82545EM' => 'Intel PRO/1000 MT Server network card',
'Virtio' => 'Réseau para-virtuel (virtio-net)',


// Machine states
'PoweredOff' => 'Éteinte',
'Saved' => 'Sauvegardée',
'Teleported' => 'Téléporté',
'Aborted' => 'Avortée',
'Running' => 'En fonction',
'Paused' => 'En pause',
'Stuck' => 'Collé',
'Teleporting' => 'En téléportation',
'LiveSnapshotting' => 'Instantané en direct',
'Starting' => 'Démarrage',
'Stopping' => 'Extinction',
'Saving' => 'Enregistrement',
'Restoring' => 'Restauration',
'TeleportingPausedVM' => 'En pause pour la téléportation',
'TeleportingIn' => 'Téléportation vers',
'RestoringSnapshot' => 'Restauration de l\'instantané',
'DeletingSnapshot' => 'Suppression de l\'instantané',
'SettingUp' => 'Initialisation',
'FirstOnline' => 'First Online',
'LastOnline' => 'Last Online',
'FirstTransient' => 'First Transient',
'LastTransient' => 'Last Transient',

// Mount dialog
'Mount' => 'Insérer',

// list separator
'LIST_SEP' => ', ',

// Sizes
'B' => 'o',
'KB' => 'Kio',
'MB' => 'Mio',
'GB' => 'Gio',
'TB' => 'Tio',

// Virtual Media Manager
'Open Virtual Media Manager' => 'Ouvrir le Gestionnaire de médias virtuels',
'Virtual Media Manager' => 'Gestionnaire de médias',
'Are you sure remove medium' => 'Êtes-vous sûr de vouloir supprimer le média %s de la liste des médias inconnus?',
'Medium remove note' => 'Le conteneur de ce média ne sera pas supprimé et il sera possible de le rajouter à la liste ultérieurement.',
'Are you sure release medium' => 'Êtes-vous sûr de vouloir libérer le média %s?',
'This will detach from' => 'Il sera détaché de (ou des) machines virtuelles suivantes : %s.',
'Please select a medium.' => 'Sélectionnez un média.',
'VMM Remove Media Message1' => 'Voulez-vous supprimer le conteneur du disque dur %s?',
'VMM Remove Media Message2' => 'Si vous choisissez Supprimer le conteneur sera supprimé. <b>Cette opération est irréversible.</b>',
'VMM Remove Media Message3' => 'Si vous choisissez Conserver il sera seulement enlevé de la liste des disques connus, et le conteneur sera laissé tel quel. Il sera donc possible de rajouter le disque dur à la liste ultérieurement.',
'Normal' => 'Normal',
'Writethrough' => 'Hors instantanés',
'Immutable' => 'Immuable',
'Actions' => 'Actions',
'Add' => 'Ajouter',
'Clone' => 'Cloner',
'Remove' => 'Enlever',
'Release' => 'Libérer',
'Hard Disks' => 'Disques durs',
'CD/DVD Images' => 'Images CD/DVD',
'Floppy Images' => 'Images de disquette',


/* New hard disk wizard */
'Create New Virtual Disk' => 'Créer un nouveau disque virtuel',
'newDisk Welcome' => 'Bienvenue dans l\'assistant de création de disque virtuel!',
'newDisk Step1 Message1' => 'Cet assistant vous aidera à créer un nouveau disque dur virtuel pour votre machine.',
'newDisk Step1 Message2' => 'Utilisez le bouton Suivant pour atteindre la page suivante de l\'assistant et le bouton Précédent pour revenir à la page précédente. Vous pouvez également interrompre l\'exécution de l\'assistant avec le bouton Annuler.',
'Hard Disk Storage Type' => 'Type de conteneur pour le disque dur',
'newDisk Step2 Message1' => 'Choisissez le type d\'image qui contiendra le disque dur virtuel que vous voulez créer.',
'newDisk Step2 dynamic' => 'Au début une <b>image de taille variable</b> prend peu de place sur votre vrai disque dur. L\'espace occupé augmentera en fonction des besoins du système d\'exploitation invité, jusqu\'à la taille limite spécifiée.',
'newDisk Step2 fixed' => 'Une <b>image de taille fixe</b> occupe un espace constant. La taille du fichier image correspond approximativement à l\'espace du disque virtuel. La création d\'une image de taille fixe peut prendre un certain temps, qui dépend de la taille choisie et des performances en écriture de votre vrai disque dur.',
'Storage Type' => 'Type de l\'image',
'Dynamically expanding storage' => 'Image de taille variable',
'Fixed-size storage' => 'Image de taille fixe',
'Virtual Disk Location and Size' => 'Emplacement et taille du disque virtuel',
'newDisk Step3 Message1' => 'Entrez le chemin du fichier qui contiendra les données du disque dur ou cliquez sur le bouton pour choisir son emplacement.',
'newDisk Step3 Message2' => 'Choisissez la taille maximale du disque dur virtuel. Le système d\'exploitation invité verra cette taille comme taille maximale de ce disque dur.',
'Summary' => 'Récapitulatif',
'newDisk Step4 Message1' => 'Vous êtes sur le point de créer un disque dur virtuel avec les paramètres suivants :',
'newDisk Step4 Message2' => 'Si ces paramètres vous conviennent cliquez sur Terminer pour créer le nouveau disque dur.',

/* New virtual machine wizard */
'Create New Virtual Machine' => 'Créer une nouvelle machine virtuelle',
'New Virtual Machine Wizard' => 'Assistant de création d\'une nouvelle machine virtuelle',
'newVM Welcome' => 'Bienvenue dans l\'assistant de création de machine virtuelle!',
'newVM Step1 Message1' => 'Cet assistant aidera à créer une nouvelle machine virtuelle pour VirtualBox.',
'newVM Step1 Message2' => 'Utilisez le bouton Suivant pour atteindre la page suivante de l\'assistant et le bouton Précédent pour revenir à la page précédente. Vous pouvez également interrompre l\'exécution de l\'assistant avec le bouton Annuler.',
'VM Name and OS Type' => 'Nom et système d\'exploitation',
'newVM Step2 Message1' => 'Choisissez un nom pour la nouvelle machine virtuelle et le type du système d\'exploitation invité que vous désirez installer sur cette machine.',
'newVM Step2 Message2' => 'Le nom de la machine virtuelle peut servir à indiquer la configuration matérielle et logicielle. Il sera utilisé par tous les composants de VirtualBox pour l\'identifier.',
'newVM Step3 Message1' => 'Choisissez la quantité de la mémoire vive (RAM) à allouer à la machine virtuelle, en mégaoctets.',
'newVM Step3 Message2' => 'La quantité recommandée est de %s Mio.', /* %s will be replaced with the recommended memory size at run time */
'Virtual Hard Disk' => 'Disque dur virtuel',
'Boot Hard Disk' => 'Disque dur d\'amorçage',
'Create new hard disk' => 'Créer un nouveau disque dur',
'Use existing hard disk' => 'Utiliser un disque dur existant',
'newVM Step4 Message1' => 'Choisissez une image de disque dur à utiliser pour l\'amorçage de la machine virtuelle. Vous pouvez soit créer une nouvelle image en cliquant sur Nouveau soit choisir une image existante dans le Gestionnaire de médias virtuels avec le bouton Existant.',
'newVM Step4 Message2' => 'Si vous avez besoin d\'une configuration de disques plus complexe, vous pouvez sauter cette étape et allouer des disques plus tard dans la Configuration de la machine.',
'newVM Step4 Message3' => 'La taille recommandée pour le disque dur d\'amorçage est de %s Mio.', /* %s will be replaced with the recommended memory size at run time */
'newVM Step5 Message1' => 'Vous êtes sur le point de créer une nouvelle machine virtuelle avec les paramètres suivants :',
'newVM Step5 Message2' => 'Si cette configuration vous convient cliquez sur Terminer pour créer la nouvelle machine virtuelle.',
'newVM Step5 Message3' => 'Vous pourrez modifier ces paramètres ainsi que d\'autres à tout moment avec la fenêtre Configuration du menu de la fenêtre principale.',

/* VM Log files */
'Show Log' => 'Afficher le journal',
'Logs' => 'Journaux',
'No logs found.' => 'Aucun journal trouvé.',

/* Import / Export Appliances */
'Export Appliance' => 'Exporter application virtuelle',
'Appliance Export Wizard' => 'Assistant d\'exportation d\'application virtuelle',
'Appliance Export Wizard Welcome' => 'Bienvenue dans l\'assistant d\'exportation d\'application virtuelle!',
'appExport Step1 Message1' => 'Cet assistant va vous aider à exporter une application virtuelle.',
'appExport Step1 Message2' => 'Utilisez le bouton Suivant pour atteindre la page suivante de l\'assistant et le bouton Précédent pour revenir à la page précédente. Vous pouvez également interrompre l\'exécution de l\'assistant avec le bouton Annuler.',
'appExport Step1 Message3' => 'Choisissez les machines virtuelles à ajouter à l\'application virtuelle. Vous pouvez en choisir plusieurs, mais elles doivent être éteintes avant d\'être exportées.',
'Appliance Export Settings' => 'Paramètre d\'exportation d\'application virtuelle',
'appExport Step2 Message1' => 'Vous pouvez effectuer des modifications sur les configurations des machines virtuelles sélectionnées. La plupart des propriétés affichées peuvent être changées en cliquant dessus.',
'appExport Step3 Message1' => 'Choisisez un nom de fichier pour l\'OVF.',
'Import Appliance' => 'Importer application virtuelle',
'Appliance Import Wizard' => 'Assistant d\'importation d\'application virtuelle',
'Appliance Import Wizard Welcome' => 'Bienvenue dans l\'assistant d\'importation d\'application virtuelle!',
'appImport Step1 Message1' => 'Cet assistant va vous aider à importer une application virtuelle.',
'appImport Step1 Message2' => 'Utilisez le bouton Suivant pour atteindre la page suivante de l\'assistant et le bouton Précédent pour revenir à la page précédente. Vous pouvez également interrompre l\'exécution de l\'assistant avec le bouton Annuler.',
'appImport Step1 Message3' => 'VirtualBox supporte actuellement l\'importation d\'applications enregistrées dans le format Open Virtualization Format (OVF). Avant de continuer, choisissez ci-dessous le fichier à importer :',
'Appliance Import Settings' => 'Paramètre d\'importation d\'application virtuelle',
'appImport Step2 Message1' => 'Voici les machines virtuelles décrites dans l\'application virtuelle et les paramètres suggérés pour les machines importées. Vous pouvez en changer certains en double-cliquant dessus et désactiver les autres avec les cases à cocher.',
'appImport Step3 Message1' => 'Choisisez un nom de fichier pour l\'OVF.',
'Write legacy OVF' => 'Utiliser l\'ancien format OVF 0.9',
'Virtual System X' => 'Système virtuel %s', // %s will be replaced with the virtual system number
'Product' => 'Produit',
'Product-URL' => 'URL du produit',
'Vendor' => 'Vendeur',
'Vendor-URL' => 'URL du vendeur',
'License' => 'Licence',
'Hard Disk Controller' => 'Hard Disk Controller',
'Virtual Disk Image' => 'Virtual Disk Image',
'Warnings' => 'Avertissements',

/* Operation in progress onUnLoad warning message */
'Operation in progress' => 'Attention: une opération interne VirtualBox est en cours. La fermeture de cette fenêtre ou le lancement de nouvelles opérations peut entraîner des résultats indésirables. Veuillez attendre la fin de l\'opération.',
'Loading ...' => 'Chargement ...', // "loading ..." screen

/* Versions */
'Unsupported version' => 'Vous utilisez une version non testée de VirtualBox (%s) avec phpVirtualbox. Cela peut engendrer des résultats indésirables.',
'Do not show message again' => 'Ne plus afficher ce message.',

/* Fatal connection error */
'Fatal error' => 'Une erreur est survenue lors de la communication avec vboxwebsrv. Plus aucune requête ne sera envoyée par phpVirtualBox jusqu\'à ce que l\'erreur soit corrigée et que cette page soit actualisée. Les détails de cette erreur de connexion doivent être affiché dans une boîte de dialogue annexe.',

/* Guest properties error */
'Unable to retrieve guest properties' => 'Impossible de récupérer les propriétés de l\'invité. Assurez-vous que la machine virtuelle est en marche et que les additions invités soit installées.',

/*RDP */
'User name' => 'Utilisateur',
'Password' => 'Mot de passe',
'Connecting to' => 'Connexion à',
'Connected to' => 'Connecter à',
'Requested desktop size' => 'Taille du bureau',
'Connect' => 'Connecter',
'Detach' => 'Détacher',
'Disconnect' => 'Déconnecter',
"Ctrl-Alt-Del" => "Insérer Ctrl-Alt-Del",
'Disconnect reason' => 'Raison de la déconnexion',
"Redirection by" => "Rediriger par",
'Virtual machine is not running or RDP configured.' => 'La machine virtuelle n\'est pas démarrée ou n\'est pas configurée pour accepter les connexions RDP.',

/* Operating Systems */
'Other' => 'Autres/Inconnus',
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
'WindowsNT' => 'Autres Windows',
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
'Linux' => 'Autres Linux',
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