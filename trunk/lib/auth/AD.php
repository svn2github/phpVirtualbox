<?php
/*
 * $Id$
* Experimental!
*/
class phpvbAuthAD implements phpvbAuth {

	var $capabilities = array(
		'canChangePassword' => false,
		'canLogout' => true
	);

	var $config = array(
		'host' => '127.0.0.1',
		'bind_dn' => 'ou=users,dc=internal,dc=local',
		'admin_ou' => 'ou=admins',
		'domain' =>   'internal.local'
	);

	function phpvbAuthLDAP($userConfig = null) {
		if($userConfig) $this->config = array_merge($this->config,$userConfig);
	}

	function login($username, $password)
	{
		global $_SESSION;


		// Check for LDAP functions
		if(!function_exists('ldap_connect')) {

			$ex = 'LDAP support is not enabled in your PHP configuration.';

			if(strtolower(substr(PHP_OS, 0, 3)) == 'win') {

				ob_start();
				phpinfo(INFO_GENERAL);
				$phpinfo = ob_get_contents();
				ob_end_clean();
				preg_match('/Loaded Configuration File <\/td><td.*?>(.*?)\s*</', $phpinfo, $phpinfo);

				$ex .= ' You probably just need to uncomment the line ;extension=php_ldap.dll in php.ini'.
						(count($phpinfo) > 1 ? ' (' .trim($phpinfo[1]).')' : '') . ' by removing the ";" and restart your web server.';

			} else if(strtolower(substr(PHP_OS, 0, 5)) == 'Linux') {

				$ex .= ' You probably need to install the php5-ldap (or similar depending on your distribution) package.';
					
			}
			throw new Exception($ex);
		}

		if(!($auth = ldap_connect($this->config['host'])))
			return false;


		ldap_set_option($auth,LDAP_OPT_PROTOCOL_VERSION, 3);

		if(!($bind = @ldap_bind($auth, $username . "@" .$this->config['domain'], $password)))
			return false;

		// valid
		
		// check presence in groups
		$filter = "(sAMAccountName=" .
			str_replace(array(',','=','+','<','>',';','\\','"','#','(',')','*',chr(0)), '', $username) . ")";
		$attr = array("memberof");
		$result = ldap_search($auth, $this->config['bind_dn'], $filter, $attr);
		if(!result) throw new Exception ("Unable to search Active Directory server");
		$entries = ldap_get_entries($auth, $result);
		ldap_unbind($auth);

		// check groups
		foreach($entries[0]['memberof'] as $groups) {
			
			if (preg_match("/".$this->config['admin_ou'].",".$this->config['bind_dn']."/i",$groups)) {

				// user has permission
				// establish session variables
				$_SESSION['valid'] = true;
				$_SESSION['user'] = $username;
				$_SESSION['authCheckHeartbeat'] = time();
				return true;
			}
		}
		
		// User is not in the correct group
		return false;
		
	}

	function heartbeat($vbox)
	{
		global $_SESSION;

		$_SESSION['valid'] = true;
		$_SESSION['authCheckHeartbeat'] = time();
	}

	function changePassword($old, $new, &$response)
	{
	}

	function logout(&$response)
	{
		global $_SESSION;
		if(function_exists('session_destroy')) session_destroy();
		else unset($_SESSION['valid']);
		$response['data']['result'] = 1;
	}

	function listUsers()
	{

	}

	function updateUser($vboxRequest, $skipExistCheck)
	{

	}

	function deleteUser($user)
	{

	}
}
