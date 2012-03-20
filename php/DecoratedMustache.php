<?php
class DecoratedMustache extends Mustache
{
	protected $_i18n;
	
	public function __construct($translations)
	{
		$this->_i18n = new LowLevelDecoratedMustache(null, $translations);
		parent::__construct();	
	}
	
	public function render($template = null, $view = null, $partials = null)
	{
		$view->i18n = $this->_i18n;
		$view = new LowLevelDecoratedMustache(null, $view);
		
		return parent::render($template, $view, $partials);
	}
}

class LowLevelDecoratedMustache extends Mustache
{
	public function __isset($k)
	{
		if(isset($this->_context[0]->$k)){
			return true;
		}
		
		return false;
	}
	
	public function __get($k)
	{
		return $this->_context[0]->$k;
	}
	
	public function uc()
	{
		$m = $this;
		return function($tag) use ($m) {
			$ret = $m->render($tag);
			return strtoupper($ret);
		};
	}
	
	public function lc()
	{
		$m = $this;
		return function($tag) use ($m) {
			$ret = $m->render($tag);
			return strtolower($ret);
		};
	}
	
	public function ucfirst()
	{
		$m = $this;
		return function($tag) use ($m) {
			$ret = $m->render($tag);
			return ucfirst($ret);
		};
	}
}