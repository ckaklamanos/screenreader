<?php


function write_log($config, $url)
{
	if(!$config['enable_log'])
		return;
	
	date_default_timezone_set('Europe/Athens');
	$fname = date('Y_m_d');
	
	$filepath = $config['logs_dir'].$fname.'.csv';
	
	$remote_addr = "";
	if(isset($_SERVER['REMOTE_ADDR']))
	{
		$remote_addr = $_SERVER['REMOTE_ADDR'];
	}
	
	$http_x_forwarded_for = "";
	if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
	{
		$http_x_forwarded_for = $_SERVER['HTTP_X_FORWARDED_FOR'];
	}
	
	$browserAgent = "";
	if(isset($_SERVER['HTTP_USER_AGENT']))
	{
		$browserAgent = $_SERVER['HTTP_USER_AGENT'];
	}
	
	$http_referer = "";
	if(isset($_SERVER['HTTP_REFERER']))
	{
		$http_referer = $_SERVER['HTTP_REFERER'];
	}
	
	$date = date('Y-m-d H:i:s');
	
	$log = $remote_addr." \t ".$http_x_forwarded_for." \t ".$browserAgent." \t ".$date." \t ".$http_referer."\n";
	file_put_contents($filepath, $log, FILE_APPEND);
		
}
?>
