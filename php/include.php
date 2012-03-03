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
	
	const IMG = 'img/';
	
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
					$css['plain']['minified'][$barename] = str_replace(self::CSS_BIN, '', $name);
				} else {
					$css['versionned']['full'][$barename] = $versionnedFile;
					$css['plain']['full'][$barename] = $name;
				}
			}
			self::getCache()->save($css, 'css');
		}
		return $css;
	}
	
	public static function getApplicableCSS($file, $minify, $versioning)
	{
		$css = self::getVersionnedCSS();			
		$minKey = $minify ? 'minified' : 'full';
		$versKey = $versioning ? 'versionned' : 'plain';
		
		if (!isset($css[$versKey][$minKey][$file])) {
			throw new Exception("CSS file not found: '$file', '$minKey', '$versKey'");
		}
		
		return $css[$versKey][$minKey][$file];
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
		
		if(!$resources = self::getCache()->load('images')) {
			foreach(glob(self::IMG.'*.*') as $name) {
				if(!$hash = self::getGitCommitHash($name)) {
					error_log("Cannot find revision for file: ".$name);
					continue;
				}

				$pathInfo = pathinfo($name);
				$versionnedFile = $pathInfo['filename'].'.'.$hash. (isset($pathInfo['extension']) ? '.'.$pathInfo['extension'] : '');
				$barename = str_replace(self::IMG, '', $name);
				
				$images['versionned'][$barename] = $versionnedFile;
				$images['plain'][$barename] = $name;
			}
			self::getCache()->save($images, 'images');
		}
		return $images;
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
}