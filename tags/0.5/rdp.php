<?php
/*
 * Simple RDP connection file generator
 *
 * $Id: rdp.php 696 2010-07-08 00:46:41Z ian $
 *
 */
header("Content-type: application/x-rdp",true);
header("Content-disposition: attachment; filename=\"". $_REQUEST['vm'] .".rdp\"",true);

echo('
auto connect:i:1
full address:s:'.$_REQUEST['host'].($_REQUEST['port'] ? ':'.$_REQUEST['port'] : '').'
compression:i:1
displayconnectionbar:i:1
');
