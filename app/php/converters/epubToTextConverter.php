<?php


function epub2text($filename)
{
	return readEpubHTML($filename);
}

function readEpubHTML($archiveFile)
{
	/* Initialize */
	@session_start(); 
	global $config;
	
	$page = 1;
	if(isset($_GET['page']))
		$page = $_GET['page'];
		
	$content = "";
	$max_pages = 1;
	
	$tempAr = array();
	$current_session = session_id();
	$path = './'.$config['downloads_dir'].$current_session.'/'.$archiveFile.'/'.$archiveFile;
	 
    $tempFile = "";
    $tempFileName = "";
	$internal_opf_path = '';
	
    $items = array();
    
    // Create new ZIP archive  
	$zip = new ZipArchive;  
    if (true === $zip->open($path)) {  
		$zip->extractTo('./'.$config['downloads_dir'].$current_session.'/'.$archiveFile.'/'.getFileName($archiveFile));
		for($i=0; $i<1000; $i++)
		{		
			$tempFile =  $zip->getNameIndex($i);		
			$tempFileName = getFileNameFromUrl($tempFile);
			$ext = getFileExtension($tempFileName);
			
			if($ext == "opf")
			{
				$internal_opf_path = getFilePath($tempFile);
				break;
			}
		}

		$path = getFilePath($tempFile);
		$index = $zip->locateName($tempFile);
		$data = $zip->getFromIndex($index);  
				
		$xml = new  DOMDocument();
		$xml->loadXML($data, LIBXML_NOENT | LIBXML_XINCLUDE | LIBXML_NOERROR | LIBXML_NOWARNING);
				
		$xml->saveXML();
		$savePath = './'.$config['downloads_dir'].$current_session.'/'.$archiveFile.'/'.getFileName($tempFileName).".xml";
		$xml->save($savePath);

		$reader = new XMLReader();
		$reader->open($savePath);

		$title = '';

		while($reader->read())
        {
			if($reader->name === "item")
			{
				$item = $reader->getAttribute("href");
				$itemName = getFileNameFromUrl($item);
				$item_url = './'.$config['downloads_dir'].$current_session.'/'.$archiveFile.'/'.getFileName($archiveFile).'/'.$internal_opf_path.$item;
				$ext = getFileExtension($itemName);
				if(($ext == "htm") || ($ext == "html") || ($ext == "xhtml"))
				{
					array_push($items, $item_url);
				}
				else if(strpos($ext,'htm') !== false)
				{
					array_push($items, $item_url);
				}
			}
			else if($reader->name === "dc:title")
			{
				$title = $reader->readInnerXML();
			}
		}
		
		$current_file_path = '';
		foreach($items as $key=>$value)
		{
			$temp_key = $key + 1;
			$max_pages = $temp_key;
			if($temp_key == $page)
			{
				$content = file_get_contents($value);
				$current_file_path = $value;
			}
		}
		$zip->close(); 
	}

	

	$dom = new DOMDocument();
	$dom->loadHTML($content);
	
	/* set images' and links' urls*/
	
			$tags_with_url = array(
			'a' => array(
				'urls' => array('href', 'src')
			),
			'applet' =>  array(
				'urls' => array('codebase')
			),
			'area' => array(
				'urls' => array('href')
			),
			'base' => array(
				'urls' => array('href')
			),
			'blockquote' => array(
				'urls' => array('cite')
			),
			'body' => array(
				'urls' => array('cite')
			),
			'form' => array(
				'urls' => array('action')
			),
			'frame' => array(
				'urls' => array('longdesc', 'src')
			),
			'iframe' => array(
				'urls' => array('longdesc', 'src')
			),
			'head' => array(
				'urls' => array('profile')
			),
			'img' => array(
				'urls' => array('longdesc', 'src', 'usemap')
			),
			'input' => array(
				'urls' => array('src', 'usemap', 'formaction')
			),
			'ins' => array(
				'urls' => array('cite')
			),
			'link' => array(
				'urls' => array('href', 'src')
			),
			'object' => array(
				'urls' => array('classid', 'codebase', 'data', 'usemap')
			),
			'q' => array(
				'urls' => array('cite')
			),
			'audio' => array(
				'urls' => array('src')
			),
			'button' => array(
				'urls' => array('formaction')
			),
			'command' => array(
				'urls' => array('icon')
			),
			'embed' => array(
				'urls' => array('src')
			),
			'html' => array(
				'urls' => array('manifest')
			),
			'source' => array(
				'urls' => array('src')
			),
			'video' => array(
				'urls' => array('poster', 'src')
			),
			'script' => array(
				'urls' => array('src')
			),
			'td' => array(
				'urls' => array('background')
			)
		);
		
	$tags = $dom->getElementsByTagName("*");
	for($i=0; $i<$tags->length; $i++)
	{
		$elm =$tags->item($i);
		$tagName = $elm->nodeName;
		if(isset($tags_with_url[$tagName]) && isset($tags_with_url[$tagName]['urls']))
		{
			foreach($tags_with_url[$tagName]['urls'] as $value)
			{
				
				if($elm->hasAttribute($value))
				{
			
					$actual_url = $elm->getAttribute($value);


					
					if($tagName == 'a')
					{
						$elm->setAttribute('onclick', 'parent.redirect(event, this)');
					}
					
								
					if(strpos($actual_url, 'http') === 0)
					{
						
					}
					if(strpos($actual_url, '../') === 0)
					{
						$expl_arr = explode('../', $actual_url);
						$actual_url = $expl_arr[1];
						
						$new_url = dirname(dirname($current_file_path)).'/'.$actual_url;
						
						$elm->setAttribute($value, $new_url);
					}
					else if(strpos($actual_url, './') === 0)
					{
						$expl_arr = explode('./', $actual_url);
						$actual_url = $expl_arr[0];

						$new_url = dirname($current_file_path).'/'.$actual_url;
						
						$elm->setAttribute($value, $new_url);
					}
					else if(strpos($actual_url, '/') === 0)
					{
					
					}
					else if(strpos($actual_url, '#') === 0)
					{
						
						$new_url = $current_file_path.$actual_url;
						$elm->setAttribute($value, $new_url);
					}
					else
					{
						$new_url = dirname($current_file_path).'/'.$actual_url;
						
						$elm->setAttribute($value, $new_url);

					}/**/
					
					
				}

			}
		}
	}
	

	/* Add body attributes */
	
	$body = $dom->getElementsByTagName('body')->item(0);
	$body->setAttribute("data", "null");
	$body->setAttribute("title", $title);
	$body->setAttribute("file_type", "epub");
	$body->setAttribute("current_page", $page);
	$body->setAttribute("total_pages", $max_pages);
	
	$content = $dom->saveHTML();

	return $content;
}
?>


