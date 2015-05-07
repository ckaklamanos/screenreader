<?php


/*
 * Odt to text conversion
 */

function odt2text($filename) {  
	return readOdtXML($filename, "content.xml");  
}

function readOdtXML($archiveFile, $dataFile) {  
	
	/* Initialize */
	@session_start(); 
	global $config;
	
	
	$page = 1;
	if(isset($_GET['page']))
		$page = $_GET['page'];
		
	$current_session = session_id();
	
	$content = '';

	/* Extract zip and create html document */
	$zip = new ZipArchive;	// Create new ZIP archive
	$path = './'.$config['downloads_dir'].$current_session.'/'.$archiveFile.'/'.$archiveFile;	//set the path of the archive filename to the downloads folder

	if(true === $zip->open($path)){	// Open received archive file
		 
		if (($index = $zip->locateName($dataFile)) !== false) {	// If done, search for the data file in the archive 
			
			$data = $zip->getFromIndex($index);	// If found, read it to the string 
			$zip->close();	// Close archive file

			// Load XML from a string	// Skip errors and warnings
			$xml = new  DOMDocument();
			$xml->loadXML($data, LIBXML_NOENT | LIBXML_XINCLUDE | LIBXML_NOERROR | LIBXML_NOWARNING);  

			$xml->saveXML();	//save the xml file
			$savePath = './'.$config['downloads_dir'].$current_session.'/'.$archiveFile.'/'.getFileName($archiveFile).".xml";	//set the full path of the file xml file
			$xml->save($savePath);	//save the xml file

			$reader = new XMLReader();	//create new XMLReader object
			$reader->open($savePath);	//open an xml file
			
			/*
			 * Every time xmlreader reads a node it checks the nodes name
			 * and if it is "w:p" (the w:p tags contain a paragraph)
			 * and the node is a starting element it reads the content
			 * of the node without any tags that may exist.
			 * 
			 * The content is written to a string
			 * 
			 * Every time xmlreader reads a node with name "text:soft-page-break"
			 * it means that there is a new page at the document, so a new div
			 * is created
			 */
			$cont_checker = "";
			$content = '<div id="1">';
			$divno = 1;

			while($reader->read())
			{
				
				if($reader->name === "text:p" && $reader->nodeType == XMLReader::ELEMENT)
				{
					if($divno == $page){
						$temp1 = $reader->readString();
						$temp = '<p>'.$temp1.'</p>';
						$content .= $temp;
					}	
					$cont_checker .= $temp;
				}
				else if($reader->name === "text:soft-page-break")
				{
					$divno++;
				}
				
				
			}
								//$content .= '</div>';

			
			if($cont_checker == "")
				$file_empty_or_corrupt = true;
			
			/* Add body attributes */
			 
			$dom = new DOMDocument();
			$dom->loadHTML($content);
			 
			$body = $dom->getElementsByTagName('body')->item(0);
			$body->setAttribute("data", "null");
			$body->setAttribute("title", "null");
			$body->setAttribute("file_type", "odt");
			$body->setAttribute("current_page", $page);
			$body->setAttribute("total_pages", $divno);
			$content = $dom->saveHTML();
		}
		else
		{
			$cont_checker = '';
		}
		$zip->close();
		return $content;
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
