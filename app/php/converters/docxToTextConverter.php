<?php

	
/*
 * Docx to text convertion
 */
 
function docx2text($filename) {  
	 return readDocxXML($filename, "word/document.xml");  
}  
  
function readDocxXML($archiveFile, $dataFile) {  
	
	/* Initialize */
	@session_start(); 
	global $config;
	
	$current_session = session_id();
	
	$content = '';
	/* Extract zip and create html document */
	
	$zip = new ZipArchive;	// Create new ZIP archive 
	$path = './'.$config['downloads_dir'].$current_session.'/'.$archiveFile.'/'.$archiveFile;	//set the path of the archive filename to the downloads folder

    if(true === $zip->open($path)){	// Open received archive file

		if (($index = $zip->locateName($dataFile)) !== false)	// If done, search for the data file in the archive 
		{  
			$data = $zip->getFromIndex($index);	// If found, read it to the string    
			$zip->close();	// Close archive file
			 
			// Load XML from a string	// Skip errors and warnings 
			$xml = new  DOMDocument();
			$xml->loadXML($data, LIBXML_NOENT | LIBXML_XINCLUDE | LIBXML_NOERROR | LIBXML_NOWARNING);	 

			$xml->saveXML(); //create the xml document
			$savePath = './'.$config['downloads_dir'].$current_session.'/'.$archiveFile.'/'.getFileName($archiveFile).".xml";  //set the full path of the file xml file
			$xml->save($savePath);	//save the xml file

			$reader = new XMLReader();	//create new XMLReader object
			$reader->open($savePath);	//open an xml file

			/*
			 * Every time xmlreader read a node it checks the nodes name
			 * and if it is "w:p" (the w:p tags contain a paragraph)
			 * and the node is a starting element it reads the content
			 * of the node without any tags that may exist.
			 * 
			 * The content is written to a string 
			 */
			
			$cont_checker = "";
			$content = '<div id="1">';
			$divno = 1;
			
			while($reader->read())
			{
				if($reader->name == "w:p" && $reader->nodeType == XMLReader::ELEMENT)
				{
					$temp1 = $reader->readString();
					$temp = '<p>'.$temp1.'</p>';
					$content .= $temp;	
					$cont_checker .= $temp;
					if(strlen($content) >= ($divno*2000))
					{
						$content .= '</div>'.'<div id="'.++$divno.'">';
					}
				}
			}
			$content .= '</div>';
			
			if($cont_checker == "")
				$file_empty_or_corrupt = true;
			
			/* Add body attributes */
			
			$dom = new DOMDocument();
			$dom->loadHTML($content);
			 
			$body = $dom->getElementsByTagName('body')->item(0);
			$body->setAttribute("data", "null");
			$body->setAttribute("title", "null");
			$body->setAttribute("file_type", "docx");
			$body->setAttribute("current_page", "null");
			$body->setAttribute("total_pages", "null");
			
			$content = $dom->saveHTML();

		}
		else
		{
			$cont_checker = '';
		}
		$zip->close();	// Close archive file
	}
	else
	{
		$cont_checker = '';
	}
	
	if($cont_checker == '')
	{
		return '';
	}
	return $content;
}

?>
