<?php
class MyMustache extends Mustache
{
	public function __construct($template = null, $view = null, $partials = null, array $options = null)
	{
		$view['i18n'] = new MyMustacheI18n();
		
		parent::__construct($template, $view, $partials, $options);
	}
}
	
class MyMustacheI18n
{	
	public function uc($text)
	{
		error_log('uc method called with ' . $text);
		return(strtoupper($text));
	}
}


