<?php
/*
 * $Id$
* Experimental!
*/
class phpvbAuthActiveDirectory implements phpvbAuth {

	var $capabilities = array(
		'canChangePassword' => false,
		'canLogout' => true
	);

	var $config = array(
		'host' => '127.0.0.1',
		'admin_group' => null,
		'admin_user' => null,
		'user_group' => null,
		'bind_dn' => 'CN=Users',
		'domain' =>   'internal.local',
		'filter' => '(&(objectclass=User)(objectCategory=Person))'
	);

	/**
	 * Constructor
	 * @param array $userConfig - user configuration for this module
	 */
	function phpvbAuthActiveDirectory($userConfig = null) {
		// Merge user config
		if($userConfig) {
			$this->config = array_merge($this->config,$userConfig);
		}		
	}

	/**
	 * Test log in and set $_SESSION vars
	 * @param string $username
	 * @param string $password
	 * @see phpvbAuth::login()
	 */
	function login($username, $password)
	{
		global $_SESSION;


		/*
		 * Check for LDAP functionality and provide some direction
		 */
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

		// Connect to server
		if(!($auth = ldap_connect($this->config['host'])))
			return false;

		// Set relevant LDAP options
		ldap_set_option($auth,LDAP_OPT_PROTOCOL_VERSION, 3);
		
		$_SESSION = array();

		// Main login /bind
		if(!($bind = @ldap_bind($auth, $username . "@" .$this->config['domain'], $password)))
			return false;
		
		
		// Get user information from AD
		////////////////////////////////////
		
		
		// Set filter and sanitize username before sending it to AD
		$filter = "(sAMAccountName=" .
			str_replace(array(',','=','+','<','>',';','\\','"','#','(',')','*',chr(0)), '', $username) . ")";
		if($this->config['filter'] && false) {
			$filter = '(&'. $this->config['filter'] .' ('. $filter .'))';
		}
		
		$result = @ldap_search($auth,
				$this->config['bind_dn'] . ',DC=' . join(',DC=', explode('.', $this->config['domain'])),
				$filter, array("memberof","useraccountcontrol"));

		if(!result) throw new Exception ("Unable to search Active Directory server: " . ldap_error($auth));
		list($entries) = @ldap_get_entries($auth, $result);
		@ldap_unbind($auth);
		
		
		// Check for disabled user
		if((intval($entries['useraccountcontrol'][0]) & 2))
			return false;

		// check for valid user group
		if($this->config['user_group']) {
			foreach($entries['memberof'] as $group) {
				list($group) = explode(',', $group);
				list($null,$group) = explode('=', $group);
				if(strtolower($group) == strtolower($this->config['user_group'])) {
					$_SESSION['valid'] = true;
					break;
				}
			}
			if(!$_SESSION['valid']) return false;
		} else {
			$_SESSION['valid'] = true;
		}
		
		// user has permission. establish session variables
		$_SESSION['user'] = $username;
		$_SESSION['authCheckHeartbeat'] = time();

		// check for valid user group
		if($this->config['admin_group']) {
			foreach($entries['memberof'] as $group) {
				list($group) = explode(',', $group);
				list($null,$group) = explode('=', $group);
				if(strtolower($group) == strtolower($this->config['admin_group'])) {
					$_SESSION['admin'] = true;
					break;
				}
			}
		}
		
		// Admin user explicitly set?
		if(!$_SESSION['admin'] && $this->config['admin_user'])
			$_SESSION['admin'] = (strtolower($this->config['admin_user']) == strtolower($_SESSION['user']));
		
		return true;
		
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
