<?php


/*
 * Doc to text conversion
 */

function doc2text($file)
{
	/* Initialize */
	@session_start(); 
	global $config;
	
	$current_session = session_id();
	
	$content = '';
	
	$path = './'.$config['downloads_dir'].$current_session.'/'.$file.'/'.$file;
	

	/*
	 * we use shell execution of the antiword program
	 * the encoding is utf-8
	 * 
	 * it returns the contents as a preformatted text
	 */
	
	$content = shell_exec('antiword -f -m UTF-8 '.$path.'');
	
	if($content == "")
		return '';
		
	$content = '<pre>'.$content.'</pre>';
	
	$dom = new DOMDocument();
	$dom->loadHTML($content);
	 
	$body = $dom->getElementsByTagName('body')->item(0);
	$body->setAttribute("data", "null");
	$body->setAttribute("title", "null");
	$body->setAttribute("file_type", "doc");
	$body->setAttribute("current_page", "null");
	$body->setAttribute("total_pages", "null");
	
	$content = $dom->saveHTML();
	
	return $content;

}

?>
