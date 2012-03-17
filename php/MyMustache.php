<?php
class MyMustache extends Mustache
{
	public function render($template = null, $view = null, $partials = null)
	{
		$v = new stdClass;
		$v->i18n = $view->i18n;
		$view->i18n = new MustacheI18n(null, $v);
		
		return parent::render($template, $view, $partials);
	}
}
	
class MustacheI18n extends Mustache
{	
	public function __isset($k)
	{
		error_log("looking for ".$k);
		if(isset($this->_context[0]->i18n->$k)){
			return true;
		}
		
		return false;
	}
	
	public function __get($k)
	{
		return $this->_context[0]->i18n->$k;
	}
	
	public function uc()
	{
		$m = $this;
		return function($tag) use ($m) {
			$ret = $m->render($tag);
			error_log('uc method called with ' . $tag . ' - ' . $ret);
			return strtoupper($ret);
		};
	}
}


