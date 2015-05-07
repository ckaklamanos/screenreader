<?php
	
	define('SR_EXEC', true);
	
	session_start();

	// Load configuration data
	if (!file_exists(dirname(__FILE__) . '/config.php')) { die('The configuration file is missing.');}
	require dirname(__FILE__) . '/config.php';

	// Load loacl configuration data
	if (!file_exists(dirname(__FILE__) . '/config.local.php')) { die('The local configuration file is missing.');}
	require dirname(__FILE__) . '/config.local.php';

	
	/*
	 * An html file that has the content of the iframe
	 * 
	 * it gets with the get method the filename
	 * it takes its extension
	 * 
	 * depended on the extension the correct function for each file type
	 * is chosen
	 * 
	 * the output is echoed to the html's body
	 */
	require($config['app_dir']."/php/functions.helper.php");
	require($config['app_dir']."/php/dom.helper.php");

	if(isset($_POST['url']))
		$_GET['url'] = $_POST['url'];

	if(isset($_GET['url']))
	{
		$url = $_GET['url'];

		$file = getFileNameFromUrl($url);
		$extension = getFileExtension($file);

	}
	/*
	 * If the file type is included in allowed file extensions an html page is created
	 * */
	if(in_array($extension, $config['allowed_file_extensions']))
	{
		/* Include the file converter needed */
		require (dirname(__FILE__) . "/app/php/converters/".$extension."ToTextConverter.php");
		$url=urldecode($url);
		/* Html file's created content */
		switch ($extension)
		{
		case "pdf":
		$file_content = pdf2text($url);
		break;
		case "docx":
		$file_content = docx2text($file); 
		break;
		case "odt":
		$file_content = odt2text($file);
		break;
		case "doc":
		$file_content = doc2text($file);
		break;
		case "epub":
		$file_content = epub2text($file);
		break;
		case "txt":
		$file_content = txt2text($file);
		break;

		}
		/* Html file's created start */

		$html_start = 
		'<html>'.
		'<head>'.
		'<meta http-equiv="Content-Type" content="text/html; class="" style="white-space:pre"> '.
		'<meta name="viewport" content="width=device-width, initial-scale=1.0">'.
		'<script type="text/javascript" src="libs/shortcut/shortcut.js"></script>'.
		'<script type="text/javascript" src="libs/jquery/jquery-1.10.2.js"></script>'.
		'<script type="text/javascript" src="libs/uri/URI.js"></script>'.
		'<script type="text/javascript" src="app/js/app.helper.js"></script>'.
		'<script type="text/javascript" src="app/js/shortcuts.helper.js"></script>'.
		'<link rel="stylesheet" type="text/css" href="app/css/iframe.css">'.
		'</head>';
		if ( trim( $file_content ) == '' ){
		$html_start .= '<body class="'.$extension.'" onload=parent.SR.timeoutRedirect()></body>';
		}
		else{
		$html_start .= '<body class="'.$extension.'">';
		}

		/* Html file's created end */
		$html_end =
		'<audio id="player" href="#" src="">'.
		'</audio>'.
		'<div class="hidden">'.
		'Τέλος σελίδας'.
		'</div>'.
		'</body>'.
		'</html>';
		/* Add the tree parts af the html file */
		$text = $html_start.$file_content.$html_end;
		/* Add screen_reader head elements to the html file */
		//$text = add_head_elements($text, $url);
	}

	else
	{
		/* 
		 * Get the html downloaded from the url entered,
		 * after having certain dom elements changed 
		 *  */

		 
		
		//$text = create_dom($url);
		$parsedURL =  parse_url($url);
		$base = $parsedURL['scheme'].'://'.$parsedURL['host'];
		
		//if ( ( $parsedURL['host']=='www.w3.org' || $parsedURL['host']=='www.culture.gr' ) && isset ($parsedURL['path']) )
		if ( isset ($parsedURL['path']) )
			$base = $parsedURL['scheme'].'://'.$parsedURL['host'].$parsedURL['path'] ;
			
		
		
		
		if(empty($_SESSION['postdata'])){ 
			$text =  shell_exec( $config['phantomjs_path'].'/phantomjs '.dirname(__FILE__).'/proxy.js "'. $url.'" "'.$base.'"');
		}
		else{
			
			//$formaction = $_SESSION['postdata']['formaction'] ;
			$formaction = urlencode ( $_SESSION['postdata']['formaction'] );
			unset ($_SESSION['postdata']['formaction']);
			unset($_SESSION['postdata']['url']);

			
			// var_dump($config['phantomjs_path'].'/phantomjs '.dirname(__FILE__).'/form.js '. $url.' '.$base .' "'.$formaction.'" "'.http_build_query($_SESSION['postdata']).'"');
			// die;
			//$text =  shell_exec( $config['phantomjs_path'].'/phantomjs '.dirname(__FILE__).'/proxypost.js '. $url.' '.$base .' '.http_build_query($_SESSION['postdata']));
			
			$text =  shell_exec( $config['phantomjs_path'].'/phantomjs '.dirname(__FILE__).'/form.js '. $url.' '.$base .' '.$formaction.' "'.http_build_query($_SESSION['postdata']).'"');
		}

	}
	
	if ( trim( $text ) == 'timeouterror' ){
		$text = '<body onload=parent.SR.timeoutRedirect()></body>';
	}
	
	echo $text;
	
	
	
?>
