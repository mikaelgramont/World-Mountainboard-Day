<?php
class MyMustache extends Mustache
{
	public function uc($text)
	{
		error_log('uc method called with ' . $text);
		return(strtoupper($text));
	}
}