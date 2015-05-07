<?php

	function relativeToAbsoluteUrls($text, $url)
	{
		
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
				//'urls' => array('action')
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
		
		$url_components = parse_url($url);
		
		$scheme='';
		if(isset($url_components['scheme']))
			$scheme = $url_components['scheme'];
		
		$host='';
		if(isset($url_components['host']))
			$host = $url_components['host'];
		
		$pathName='';
		if(isset($url_components['path']))
			$pathName = $url_components['path'];
		
		$dom = new DOMDocument();
		$dom->loadHTML($text);
		
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
						if($actual_url =='#'){
							break;
						}
					
						if(($actual_url != '') && (strpos($actual_url, "//") === 0))
						{
							$elm->setAttribute($value, $actual_url = $scheme.':'.$actual_url);
						}
						else if (strpos($actual_url,'//') === false && isset($actual_url) && ($actual_url != '')) 
						{
							if (strpos($actual_url, "/") === 0)
							{
								$elm->setAttribute($value, $scheme.'://'.$host.$actual_url);
							}
							else
							{
								$path_pieces = explode('/', $pathName);
								$reps = count($path_pieces)-1;
								$dir_path = '';
								for($i=0; $i<$reps; $i++)
								{
									$dir_path .= $path_pieces[$i].'/';
								}
								if(strpos($dir_path, "/") !== 0)
								{
									$dir_path = '/'.$dir_path;
								}
								$elm->setAttribute($value, $scheme.'://'.$host.$dir_path.$actual_url);
							} 
						}
					}
					if($tagName == 'a')
					{
						$elm = $tags->item($i);
					}
				}
			}
		}
		
		
		$a_tags = $dom->getElementsByTagName("a");
		for($i=0; $i<$a_tags->length; $i++)
		{
			$a_elm = $a_tags->item($i);
			if($a_elm->hasAttribute("href") || $a_elm->hasAttribute("src"))
			{
				$a_elm->setAttribute('onclick', 'parent.redirect(event, this)');
				
				$actual_url = $a_elm->getAttribute('href');
				if (strpos($actual_url,':') === false) 
				{
					if (strpos($actual_url,'/') === 1)
					{
						$a_elm->setAttribute('href', $scheme.'://'.$host.$actual_url);
					}
					else
					{
						$path_pieces = explode('/', $pathName);
						$reps = count($path_pieces)-1;
						$dir_path = '';
						for($i=0; $i<$reps; $i++)
						{
							$dir_path .= $path_pieces[$i].'/';
						}
						$a_elm->setAttribute('href', $scheme.'://'.$host.$dir_path.$actual_url);
					} 
				}
			}
		}
			
		return $dom->saveHTML();
	}
	
	function create_dom($url)
	{
		/*
		 * Download file from url entered
		 */ 
		 
		 global $config;
		 
		$text = curl_file_get_contents($url);
		
		//if($text=='')
			//die('Προχωράτε πολύ γρήγορα. Περιμένετε λίγο και ξαναπροσπαθήστε. Πατήστε Alt + Αριστερό βελάκι για να γυρίσετε πίσω ή Insert για να πληκτρολογήσετε νέα διεύθυνση.');
		
		
		/*
		 * Create new DOMDocument from the above text output
		 */ 
		$dom = new DOMDocument();
		//$text = mb_convert_encoding($text, 'HTML-ENTITIES', "UTF-8");
		if (preg_match('!!u', $text))
		  $text = mb_convert_encoding($text, 'HTML-ENTITIES', "UTF-8");
		else 
		  $text = mb_convert_encoding($text, 'HTML-ENTITIES', "ISO-8859-7");
		
				
		$dom->loadHTML($text);

		/*
		 * Set iframe's body onload event
		 */
		$body = $dom->getElementsByTagName("body")->item(0);
		// $body->setAttribute('onload', 'initializeIframe()');
		
		/*
		 * Add to the iframes end a div signing it 's the end of the div
		 */
		$end_div = $dom->createElement('div', 'Τέλος σελίδας');
		$body->appendChild($end_div);
		
		/*
		 * Add to the a tags a redirect event
		 */
		$text = relativeToAbsoluteUrls($dom->saveHTML(), $url);
		
		/*
		 * Add to the file the screen_reader head elements
		 */
		$text = add_head_elements($text, $url);
		$text = add_head_elements_per_site($text, $url);
		
		return $text;
	}
	function curl_file_get_contents($url)
	{

		$curl = curl_init();

		$userAgent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.12) Gecko/20101026 Firefox/3.6.12';

        curl_setopt($curl,CURLOPT_URL,$url); //The URL to fetch. This can also be set when initializing a session with curl_init().
        curl_setopt($curl,CURLOPT_RETURNTRANSFER,TRUE); //TRUE to return the transfer as a string of the return value of curl_exec() instead of outputting it out directly.
        curl_setopt($curl,CURLOPT_CONNECTTIMEOUT,5); //The number of seconds to wait while trying to connect.

        curl_setopt($curl, CURLOPT_USERAGENT, $userAgent); //The contents of the "User-Agent: " header to be used in a HTTP request.
        curl_setopt($curl, CURLOPT_FAILONERROR, TRUE); //To fail silently if the HTTP code returned is greater than or equal to 400.
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, TRUE); //To follow any "Location: " header that the server sends as part of the HTTP header.
        curl_setopt($curl, CURLOPT_AUTOREFERER, TRUE); //To automatically set the Referer: field in requests where it follows a Location: redirect.
        curl_setopt($curl, CURLOPT_TIMEOUT, 10); //The maximum number of seconds to allow cURL functions to execute.

		
		if (!empty ($_SESSION['postdata'])){
			
			extract($_SESSION['postdata']);

			$fields = $_SESSION['postdata'];
			
			unset($_SESSION['postdata']['url']);

			curl_setopt($curl,CURLOPT_POST, 1);
			curl_setopt( $curl , CURLOPT_POSTFIELDS , http_build_query($_SESSION['postdata']) );
        }

		$contents = curl_exec($curl);

		curl_close($curl);
		return $contents;
	}

	

	function add_head_elements($text, $url){
	
		/*
		 * prepei na doume ti paizei 
		 * kai me tin kwdikopoihsh gt h selida mesa sto iframe mporei kai
		 * na exei diaforetiki kwdikopoihsh
		 * */
		
		/*
		 * Array of head elements we want to add to the iframe's head
		 */
		$script_addition = array(
			
			'0' => array(
				'tag' => 'link',
				'attributes' => array(
					'rel' => 'stylesheet',
					'type' => 'text/css',
					'href' => 'app/css/iframe.css'
				)
			),

			'1' => array(
				 'tag' => 'script',
				 'attributes' => array(
					 'type' => 'text/javascript',
					 'src' => 'app/js/shortcuts.helper.js'
				 )
			 ),
			
			 '2' => array(
				 'tag' => 'script',
				 'attributes' => array(
					 'type' => 'text/javascript',
					 'src' => 'libs/shortcut/shortcut.js'
				 )
			 ),

			'3' => array(
				'tag' => 'meta',
				'attributes' => array(
					'http-equiv' => 'content-type',
					'content' => 'text/html; charset=UTF-8'
				)
			)

		);
		
		/*
		 * Create DOMDocument from the text parameter
		 */
		$dom = new DOMDocument();
		$dom->loadHTML($text);
		
		/*
		 * Add head elements to the iframe's head from the array above
		 */
		$head = $dom->getElementsByTagName("head")->item(0);
		foreach($script_addition as $key=>$value)
		{
			$elm = $dom->createElement($value['tag']);
			foreach($value['attributes'] as $attr=>$val)
			{
				$elm->setAttribute($attr, $val);
			}
			$first_head_elm = $head->childNodes->item(0);
			$first_head_elm->parentNode->insertBefore($elm, $first_head_elm);
		}
		
		return $dom->saveHTML();
	}
	
	function add_head_elements_per_site($text, $url){
	
		/*
		 * Create DOMDocument from the text parameter
		 */
		$dom = new DOMDocument();
		$dom->loadHTML($text);
		
		/*
		 * Add head elements to the iframe's head from the array above
		 */
		$head = $dom->getElementsByTagName("head")->item(0);
		
		
		//var_dump($url);die;
		
		return $dom->saveHTML();

	
	}
	
?>
