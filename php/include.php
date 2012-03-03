<?php
defined('APPLICATION_ENV') || define('APPLICATION_ENV',
	(getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));

require_once 'Zend/Config/Ini.php';
require_once 'Zend/Cache.php';
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
	const JS_BIN_FROM_ROOT = '../bin/';
	const CSS_BIN = 'css/bin/';
	
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

	public function getConfig()
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

	public function getCache()
	{
		if(!self::$_cache) {
			$config = self::getConfig();
			self::$_cache = self::cacheFactory(
				$config->cache->method, array(
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
				$gitResponse = @shell_exec(sprintf($commandTemplate, $fullname));
				$preg = '/commit ([a-f0-9]{32})/';
				preg_match($preg, $gitResponse, $matches);
				if(!isset($matches[1])) {
					error_log("Cannot find revision for file: ".$fullname);
					continue;
				}
				
				// Limit the hash to 8 chars.
				$return[$nameNoExtension] = $nameNoExtension.'.'.substr($matches[1], 0, 8);
			}
		}
		
		return $return;
	}
	
	/**
	 * Returns the list of versionned bundles applicable
	 * to the current environment (prod/dev)
	 */
	public static function getApplicableVersionnedBundles($minify, $versioning)
	{
		$bundles = self::getConfig()->jsBundles;
		$revisions = self::getBundleRevisions($bundles);
		
		$return = array();
		foreach(explode(',', $bundles) as $bundle) {
			if($minify) {
				$bundle .= '.min';
			}
			if($versioning) {
				$return[$bundle] = self::JS_BIN_FROM_ROOT . $revisions[$bundle];
			} else {	
				$return[$bundle] = self::JS_BIN_FROM_ROOT . $bundle;
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
		// TODO: add an entry in config file, or read all css from folder
		// build the git list of files
		$css = array(
			'plain' => array(
				'full' => array(),
				'minified' => array()
			), 'versionned' => array(
				'full' => array(),
				'minified' => array()
			)
		);
		$files = array();
		
		if(!$css = self::getCache()->load('css')) {
			$commandTemplate = 'git log -n 1 %s';
			foreach(glob(self::CSS_BIN.'*.css') as $name) {
				$gitResponse = @shell_exec(sprintf($commandTemplate, $name));
				$preg = '/commit ([a-f0-9]{32})/';
				preg_match($preg, $gitResponse, $matches);
				if(!isset($matches[1])) {
					error_log("Cannot find revision for file: ".$name);
					continue;
				}
					
				$barename = str_replace(self::CSS_BIN, '', str_replace('.min', '', $name));
				$versionnedFile = str_replace('.css', '', $name).'.'.substr($matches[1], 0, 8). '.css';
				
				if(strpos($name, '.min') !== false) {
					$css['versionned']['minified'][$barename] = $versionnedFile;
					$css['plain']['minified'][$barename] = str_replace(self::CSS_BIN, '', $name);
				} else {
					$css['versionned']['full'][$barename] = $versionnedFile;
					$css['plain']['full'][$barename] = $barename;
				}
			}
			self::getCache()->save($css, 'css');
		}
		return $css;
	}
	
	public static function getApplicableCSS($minify)
	{
		$css = self::getVersionnedCSS();			
	
		if($minify) {
			return $css['minified'];
		} else {
			return $css['full'];
		}
	}
	
	/**
	 * Returns the list of versionned resource files
	 * such as images, pdfs, etc.
	 * 
	 * @param boolean $versioning
	 */
	public static function getVersionnedResources($versioning)
	{
		$return = array();
		return $return;	
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
}