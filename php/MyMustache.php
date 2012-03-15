<?php
class MyMustache extends Mustache
{
	public function render($template = null, $view = null, $partials = null)
	{
		$view->i18n = new MyMustacheI18n($view->i18n);
		
		return parent::render($template, $view, $partials);
	}
}
	
class MyMustacheI18n
{	
	protected $_data;
	
	public function __construct($data)
	{
		$this->_data = $data;
	}
	
	public function __get($k)
	{
		return (isset($this->_data->$k) ? $this->_data->$k : null);
	}
	
	public function __set($k, $v)
	{
		$this->_data->$k = $v;
	}
	
	public function uc($text)
	{
		error_log('uc method called with ' . $text);
		return(strtoupper($text));
	}
}


