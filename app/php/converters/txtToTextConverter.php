<?php

	function txt2text($file)
	{
		@session_start(); 
		global $config;
		
		$current_session = session_id();
		
		$path = './'.$config['downloads_dir'].$current_session.'/'.$file.'/'.$file;
		$text = file_get_contents($path);
		
		$new_text = '';
		$text_explode = explode(chr(10), $text);
		//var_dump($text_explode);
		foreach($text_explode as $key=>$value)
		{
			$new_text .= '<div>'.$value.'</div>';
		}
		
		//$text = '<pre>'.$new_text.'</pre>';
		
		return '<pre style="margin-top:60px;">'.$new_text.'</pre>';
	}
?>
