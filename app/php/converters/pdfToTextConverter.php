<?php 

/*
 * Pdf to text conversion
 */

 
function pdf2text($url)
{
	/* Initialize */
	@session_start(); 
	global $config;
	
	$file = getFileNameFromUrl($url);
	
	$current_session = session_id();
	
	$pdftohtml_path='';
	if(PHP_OS=='WINNT')
		$pdftohtml_path='c:/pdftohtml/';
	
		
	$pdftohtml_params='';
	if(PHP_OS=='Linux')
		$pdftohtml_params='-c';
	
	$page = 1;
	if(isset($_GET['page']))
		$page = $_GET['page'];
	
	$content = "";
	
	$dest_path = './'.$config['downloads_dir'].$current_session.'/'.$file.'/';	
	if(PHP_OS=='WINNT')
		$dest_path = 'c:/wamp/www/screenreader/'.$config['saves_dir'].$current_session.'/'.$file.'/';
	
	$source_path = $dest_path.$file;
	if(PHP_OS=='WINNT'){
		$source_path = 'c:/pdftohtml/test.pdf';
	}
	
	$file_suffix='-'.$page;
	if(PHP_OS=='WINNT')
		$file_suffix='s';
	/* we use shell execution of the pdfinfo program
	 * 
	 * the results are turned into a json string and attached to body
	 */
	
	$info = shell_exec('pdfinfo '.$source_path);
	$matches =  array();
	
	/* time is turnet for hh:mm:ss to hh-mm-ss format*/
	$pattern = "/([0-9]+):([0-5]?[0-9]):([0-5]?[0-9])/";
	function callback ($matches) 
	{
		return $matches[1].'-'.$matches[2].'-'.$matches[3];
	}
	
	$info = preg_replace_callback($pattern, 'callback', $info);
	
	/* the pdfinfo result string is tokenized and split into two 
	 * arrays which are then combined to create the the pdfinfo array
	 */
	$info_arr = array();
	$tok = strtok($info, ":\n");

	while ($tok !== false) {
		array_push($info_arr, $tok);
		$tok = strtok(":\n");
	}
	
	$keys = array();
	$values = array();
	$i=0;
	foreach($info_arr as $value)
	{
		if($i % 2 == 0) 
		{
			array_push($keys, $value);
		}
		else
		{
			array_push($values, $value);
		}
		$i++;
	}
	
	$list = array_combine($keys, array_values($values));
	$list_json = json_encode($list);


	/* get from the pdfinfo array the title and the maximum pages*/
	$title = '';
	$max_pages = 1;
	
	foreach($list as $key=>$value)
	{
		if($key == 'Pages')
		{
			$max_pages = intval($value);
			if($page<0 || $page>$max_pages)
			{
				return;
				//header('Location: ?sr-message='._LANG_URL_MSG_ERROR_404.'&sr-sound=error');
			}
		}
		else if($key == 'Title')
		{
			$title = $value;
		}
	}

	/*
	 * we use shell execution of the pdftohtml program
	 * the encoding is utf-8
	 */
	
	

	if(!file_exists($source_path.$file_suffix.'.html'))
	{
		$output=shell_exec($pdftohtml_path.'pdftohtml '.$pdftohtml_params.' '.$source_path.' '.$source_path);
	}
	
	$content = file_get_contents($source_path.$file_suffix.'.html');
	if($content == "")
		return '';
	
	
	
	$dom = new DOMDocument();
	$dom->loadHTML($content);
	
	$imgs = $dom->getElementsByTagName("img");
	for($i=0; $i<$imgs->length; $i++)
	{
		$elm =$imgs->item($i);
		$actual_url = $elm->getAttribute("src");
		$elm->setAttribute("src", $dest_path.$actual_url);
		if($elm->hasAttribute('alt'))
		{
			if($elm->getAttribute("alt") == 'background image')
			{
				$elm->parentNode->removeChild($elm);
			}
		}
	}
	
	
	if(PHP_OS!='WINNT')
	{
		$a_tags = $dom->getElementsByTagName("a");
		for($i=0; $i<$a_tags->length; $i++)
		{
			$elm =$a_tags->item($i);
			$actual_url = $elm->getAttribute("href");
			if (strpos($actual_url,':') === false) 
			{
				$first_explode = explode($file.'-', $actual_url);
				$second_explode = explode('.', $first_explode[1]);
				$new_page = $second_explode[0];
				
				$elm->setAttribute("href", $url.'&page='.$new_page);
				$elm->setAttribute('onclick', 'parent.redirect(event, this)');
			}
		}
	}
	
	
	/* Add body attributes */
	
	$body = $dom->getElementsByTagName('body')->item(0);
	$body->setAttribute("data", $list_json);
	$body->setAttribute("title", $title);
	$body->setAttribute("file_type", "pdf");
	$body->setAttribute("current_page", $page);
	$body->setAttribute("total_pages", $max_pages);
	
	$content = $dom->saveHTML();

	return $content;
	
}
?>
