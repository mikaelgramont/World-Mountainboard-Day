<?php
class MyMustache extends Mustache
{
	public function render($template = null, $view = null, $partials = null)
	{
		$view->i18n = new MustacheI18n(null, clone($view));
		
		return parent::render($template, $view, $partials);
	}
}
	
class MustacheI18n extends Mustache
{	
	public function uc()
	{
		$m = $this;
		return function($tag) use ($m) {
			$ret = $m->render($tag);
			error_log('uc method called with ' . $tag . ' - ' . $ret);
			return $ret;
		};
	}
}


