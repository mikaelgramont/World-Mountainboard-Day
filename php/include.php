<?php
defined('APPLICATION_ENV') || define('APPLICATION_ENV',
	(getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));

require_once 'Zend/Loader.php';
require_once 'Zend/Config/Ini.php';
require_once 'Zend/Cache.php';
require_once 'Zend/Http/Client.php';
require_once 'MustacheLoader.php';
require_once 'Mustache.php';

if(APPLICATION_ENV != 'production') {
	error_reporting(E_ALL|E_STRICT);
}
	
// Dummy class to contain global elements
class Globals
{
	const MEMCACHED = 'Memcached';
	const APC = 'APC';
	const FILE = 'File';
	
	const JS_BIN = 'js/bin/';
	const CSS_BIN = 'css/bin/';
	
	const IMG = 'img/';
	
	const COOKIE_USER_REMEMBER = 'userR';
	const COOKIE_USER_USERNAME = 'userN';
	const COOKIE_USER_PASSWORD = 'userP';
	
	/**
	 * Configuration object
	 * @var Zend_Config_Ini
	 */
	protected static $_config;

	/**
	 * Cache object
	 * @var Zend_Cache_Core
	 */
	protected static $_cache;

	/**
	 * List of the js file bundle revisions
	 * @var array
	 */
	protected static $_bundleRevisions;

	public static function log($message)
	{
		if(!self::getConfig()->debug) {
			return;
		}
		
		error_log($message);
	}
	
	public static function getConfig()
	{
		if(!self::$_config) {
			self::$_config = self::configFactory();
		}
		return self::$_config;
	}
	
	public static function configFactory()
	{
		return new Zend_Config_Ini('../config.ini', APPLICATION_ENV);
	}

	public static function getCache()
	{
		if(!self::$_cache) {
			$config = self::getConfig();
			$method = $config->cache->method . ($config->cache->active ? '' : 'PassThru');
			self::$_cache = self::cacheFactory(
				$method, array(
					'dir' => $config->cache->dir,
					'ttl' => $config->cache->ttl
				)
			);
		}
		return self::$_cache;
	}
	
	/**
	 * Factory method for a cache object
	 *
	 * @param string $method
	 * @return Zend_Cache_Core
	 */
	public static function cacheFactory($method = null, $options = array())
	{
		$frontOptions = array(
			'lifetime' => $options['ttl'],
			'automatic_serialization' => true
		);

		if(empty($method)){
			$method = self::MEMCACHED;
		}

		if($method == self::MEMCACHED && !extension_loaded('memcache')){
			$method = self::APC;
        }

		if($method == self::APC && !ini_get("apc.enabled")){
			$method = self::FILE;
		}
		
		switch ($method){
			case self::APC:
            	$backOptions  = array();
				break;
			case self::FILE:
			default:
				$backOptions  = array();
				$backOptions['cache_dir'] = realpath($options['dir']);
				break;
			case 'Memcached':
				$backOptions = array(
					'servers' => array(
						array(
							'host' => '127.0.0.1',
							'port' => 11211,
							'persistent' =>  true,
							//'compression' => true,
						)
					)
				);
				break;
            }
        $cache = Zend_Cache::factory('Core', $method, $frontOptions, $backOptions);
		return $cache;
	}

	public static function getBundleRevisions($bundleList)
	{
		if(!self::$_bundleRevisions) {
			self::$_bundleRevisions = self::buildBundleRevisions($bundleList);
		}
		
		return self::$_bundleRevisions;
	}
	
	/**
	 * Builds the list of file revisions, with and without '.min'. 
	 * @param string $fileList A comma-separated list of files, without
	 * extensions. By convention, files are located in the js/bin folder.
	 */
	public static function buildBundleRevisions($fileList)
	{
		$return = array();
		$commandTemplate = 'git log -n 1 ' .self::JS_BIN. '%s';
		foreach(explode(',', $fileList) as $file) {
			foreach(array('', '.min') as $suffix) {
				$nameNoExtension = $file.$suffix;
				$fullname = $nameNoExtension.'.js';
				if(!$hash = self::getGitCommitHash(self::JS_BIN . $fullname)) {
					error_log("Cannot find revision for file: ".self::JS_BIN . $fullname);
					continue;
				}
				
				$return[$nameNoExtension] = $nameNoExtension.'.'.$hash;
			}
		}
		
		return $return;
	}
	
	/**
	 * Returns the list of versionned bundles applicable
	 * to the current environment (prod/dev)
	 */
	public static function getApplicableVersionnedBundles($minify, $versioning, $cdnUrl)
	{
		$bundles = self::getConfig()->jsBundles;
		$revisions = self::getBundleRevisions($bundles);
		
		$return = array();
		foreach(explode(',', $bundles) as $bundle) {
			if($minify) {
				$bundle .= '.min';
			}
			if($versioning) {
				$return[$bundle] = $cdnUrl.self::JS_BIN . $revisions[$bundle];
			} else {	
				$return[$bundle] = $cdnUrl.self::JS_BIN . $bundle;
			}
		}
		return $return;
	}

	/**
	 * Returns the list of versionned CSS files
	 * 
	 * @param boolean $minify
	 * @param boolean $versioning
	 */
	public static function getVersionnedCSS()
	{
		$css = array(
			'plain' => array(
				'full' => array(),
				'minified' => array()
			), 'versionned' => array(
				'full' => array(),
				'minified' => array()
			)
		);
		if(!$css = self::getCache()->load('css')) {
			foreach(glob(self::CSS_BIN.'*.css') as $name) {
				if(!$hash = self::getGitCommitHash($name)) {
					error_log("Cannot find revision for file: ".$name);
					continue;
				}
					
				$barename = str_replace(self::CSS_BIN, '', str_replace('.min', '', $name));
				$versionnedFile = str_replace('.css', '', $name).'.'.$hash. '.css';
				
				if(strpos($name, '.min') !== false) {
					$css['versionned']['minified'][$barename] = $versionnedFile;
					$css['plain']['minified'][$barename] = $name;
				} else {
					$css['versionned']['full'][$barename] = $versionnedFile;
					$css['plain']['full'][$barename] = $name;
				}
			}
			self::getCache()->save($css, 'css');
		}
		return $css;
	}
	
	public static function getApplicableCSS($file, $minify, $versioning, $cdnUrl)
	{
		$css = self::getVersionnedCSS();			
		$minKey = $minify ? 'minified' : 'full';
		$versKey = $versioning ? 'versionned' : 'plain';
		
		if (!isset($css[$versKey][$minKey][$file])) {
			throw new Exception("CSS file not found: '$file', '$minKey', '$versKey'");
		}
		
		return $cdnUrl.$css[$versKey][$minKey][$file];
	}
	
	/**
	 * Returns the list of versionned image files
	 * 
	 */
	public static function getVersionnedImages()
	{
		$images = array(
			'plain' => array(),
			'versionned' => array()
		);
		
		if(!$images = self::getCache()->load('images')) {
			foreach(glob(self::IMG.'*.*') as $name) {
				if(!$hash = self::getGitCommitHash($name)) {
					error_log("Cannot find revision for file: ".$name);
					continue;
				}

				$pathInfo = pathinfo($name);
				$versionnedFile = $pathInfo['filename'].'.'.$hash. (isset($pathInfo['extension']) ? '.'.$pathInfo['extension'] : '');
				$barename = str_replace(self::IMG, '', $name);
				
				$images['versionned'][$barename] = self::IMG.$versionnedFile;
				$images['plain'][$barename] = self::IMG.$name;
			}
			self::getCache()->save($images, 'images');
		}
		return $images;
	}	
	
	public static function getApplicableImagePaths($versioning)
	{
		$images = self::getVersionnedImages();
		$versKey = $versioning ? 'versionned' : 'plain';
		return $images[$versKey];
	}
		
	/**
	 * Returns a path to an image.
	 * 
	 * @param string $file
	 * @param boolean $versioning
	 */
	public static function getImage($file, $versioning)
	{
		$images = self::getVersionnedImages();
		
		$versKey = $versioning ? 'versionned' : 'plain';
		
		if (!isset($images[$versKey][$file])) {
			throw new Exception("Image file not found: '$file', '$versKey'");
		}
		
		return $images[$versKey][$file];
	}
	
	/**
	 * Returns a hash table of template paths
	 * to template contents
	 * 
	 * @param string $dir
	 */
	public static function getTemplates($dir)
	{
		if($templates = self::getCache()->load('templates')) {
			return $templates;
		};
		
		$templates = array();
		foreach(self::rglob('*.tpl', 0, $dir) as $name) {
			$nameShort = str_replace($dir, '', $name);
			$templates[$nameShort] = file_get_contents($name);
		}
		
		self::getCache()->save($templates, 'templates');
		
		return $templates;
	}
	
	/**
	 * Returns a multi-level array of file/folder names
	 * 
	 * @param string $pattern
	 * @param string $flags
	 * @param string $path
	 */
    public static function rglob($pattern, $flags = 0, $path = '')
    {
	    if (!$path && ($dir = dirname($pattern)) != '.') {
	    	if ($dir == '\\' || $dir == '/') {
	    		$dir = '';
	    	}
	    	return self::rglob(basename($pattern), $flags, $dir . '/');
	    }
	    $paths = glob($path . '*', GLOB_ONLYDIR | GLOB_NOSORT);
	    $files = glob($path . $pattern, $flags);
	    foreach ($paths as $p) {
		    $files = array_merge($files, self::rglob($pattern, $flags, $p . '/'));
	    }
	    return $files;
    }
    
    public static function getGitCommitHash($path)
    {
		$commandTemplate = 'git log -n 1 %s';
    	$gitResponse = @shell_exec(sprintf($commandTemplate, $path));
		$preg = '/commit ([a-f0-9]{32})/';
		preg_match($preg, $gitResponse, $matches);
		if(!isset($matches[1])) {
			error_log("Cannot find revision for file: ".$path);
			return '';
		}
					
    	return substr($matches[1], 0, 8);
    }

	/**
	 * Builds an object representing the session state, alongside
	 * a few config parameters
	 * @param array $cookies
	 */
    public static function getApiSessionData($cookies)
	{
		$config = self::getConfig();

		$sessionData = new stdClass();
		
		if(isset($cookies[self::COOKIE_USER_REMEMBER]) &&
		   isset($cookies[self::COOKIE_USER_USERNAME]) &&
		   isset($cookies[self::COOKIE_USER_PASSWORD])) {
			$sessionData = self::_login($cookies[self::COOKIE_USER_USERNAME], $cookies[self::COOKIE_USER_PASSWORD]);
		}
		
		if(isset($sessionData->rider->userId) && $sessionData->rider->userId) {
			// Logged-in user
			$rider = self::_getRidersOwnData($sessionData->rider->userId, $sessionData->sessionId);
			$sessionId = $sessionData->sessionId;
		} else {
			// Guest user
			$rider = self::getGuest();
			$sessionId = self::_getInitialSessionId();
		}
		
		$sessionData->debug = $config->debug;
		$sessionData->rider = $rider;
		$sessionData->sessionId = $sessionId;
		$sessionData->apiSessionKey = 'PHPSESSID';
			
		return $sessionData;
	}
	
	/**
	 * Returns a representation of the guest user 
	 */
	public static function getGuest()
	{
		// TODO: return the closest language to the one from the user request
		return array(
			'username' => 'guest',
			'userId' => 0,
			'lang' => 'en'
		);
	}
	
	/**
	 * Connects to the API and perfoms a login operation
	 * @param string $username
	 * @param string $password
	 */
	protected static function _login($username, $password)
	{
		$config = self::getConfig();
		$client = new Zend_Http_Client();
		$client->setUri($config->apiScheme . '://' . $config->apiUrl . '/sessions/');
		$client->setParameterPost(array(
			'userN' => $username,
			'userP' => $password,
		));
		
		try {
			$response = $client->request(Zend_Http_Client::POST);
			$sessionData = $response->getBody();
		} catch (Exception $e) {
			error_log("Error while initializing API session: '". $e->getMessage() . "'");
			$sessionData = null;
		}
		
		return json_decode($sessionData);
	}
	
	/**
	 * Fetches the representation of a user given their id
	 * @param integer $userId
	 */
	protected static function _getRidersOwnData($userId, $sessionId)
	{
		$config = self::getConfig();
		$client = new Zend_Http_Client();
		$client->setUri($config->apiScheme . '://' . $config->apiUrl . '/riders/' . $userId);
		$client->setCookie('PHPSESSID', $sessionId);
		
		try {
			$response = $client->request(Zend_Http_Client::GET);
			$userData = $response->getBody();
		} catch (Exception $e) {
			error_log("Error while fetching user data for user '$userId': '". $e->getMessage() . "'");
			$userData = null;
		}
		
		return json_decode($userData);
	}
	
	/**
	 * Because we need to retrieve a session id.
	 */
	protected static function _getInitialSessionId()
	{
		$sessionId = null;
		$config = self::getConfig();
		$client = new Zend_Http_Client();
		$client->setUri($config->apiScheme . '://' . $config->apiUrl . '/');
		try {
			$response = $client->request(Zend_Http_Client::GET);
			$headers = $response->getHeaders();
			if(isset($headers['Set-cookie'])) {
				$regex = '/PHPSESSID=([a-z0-9]{1,32})/';
				preg_match($regex, $headers['Set-cookie'], $matches);
				if(isset($matches[1])) {
					$sessionId = $matches[1]; 
				}
				
			}			
		} catch (Exception $e) {
			error_log("Error while fetching initial session id: '". $e->getMessage() . "'");
			$sessionId = null;
		}
		
		return $sessionId;
	} 
}