<?php

define('SR_EXEC', true);

require_once dirname(__FILE__) . '/init.php';

$url='';

if(isset($_POST['url']))
	$_GET['url'] = $_POST['url'];


if(isset($_GET['url'])){

//var_dump($_GET['url']);
	
	// Encode the URL query and return the URL
	$url = fn_encode_url_query ( $_GET['url'] ) ;
	
	//var_dump($url);die;
	
	// Perfom server side URL validation
	if( !isValidURL( $url ) ){
	  header('Location: index.php?error=invalidurl');
	  die;
	}
	

	
	//Check if URL points to a file with an allowed extension
	$file = getFileNameFromUrl($url);
	$extension=getFileExtension($file);
	
	//If in allowed extensions, begin file handling 	
    if(in_array($extension, $config['allowed_file_extensions'])){
		
		$current_session = session_id();
		
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_exec($ch);
		$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);
		if($httpcode != "200"){
			header('Location: index.php?error=filefailed');
			sendMail( 'dev.yesinternet@gmail.com', 'Screenreader URL error handler', 'dev.yesinternet@gmail.com' , 'Screenreader URL error handler' , $url);
			die;
		}	

		if(!is_dir($config['downloads_dir'].$current_session.'/'.$file))
		{
			$oldmask = umask(0);
			mkdir($config['downloads_dir'].$current_session.'/'.$file, 0777, TRUE);
			chmod($config['downloads_dir'].$current_session.'/', 0777);
			chmod($config['downloads_dir'].$current_session.'/'.$file.'/', 0777);
			umask($oldmask);
			
			file_put_contents($config['downloads_dir'].$current_session."/index.html","");
			file_put_contents($config['downloads_dir'].$current_session.'/'.$file."/index.html","");
		}
		
		$path = $config['downloads_dir'].$current_session.'/'.$file.'/'.$file;

		if (!file_exists($path)) {
			
			$ch = curl_init($url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			//curl_setopt($ch,CURLOPT_SSL_VERIFYPEER, false);
			$data = curl_exec($ch);
			$info = curl_getinfo($ch);
			$url = $info['url'];
			curl_close($ch);
			file_put_contents($path, $data);
			
			if($config['enable_antivirus_scan']&&strncasecmp(PHP_OS, 'WIN', 3) != 0){
				
				$command = 'clamscan ' . $path;
				$out = '';
				$int = -1;
				exec($command, $out, $int);
				
				// print '<pre>';
				// print_r($out);
				// print '</pre>';
				// echo $int;
				// die($int);
				
				if ($int != 0&&!$config['development_mode']) {
					//unlink($config['downloads_dir'].$current_session.'/'.$file);
					header('Location: index.php?url='.$config['http_host'].'/'.$config['http_path'].'templates/static/error.html?message=clam_av_'.$int);
					return;
				}
				
				$fname = date('Y_m_d');
				$filepath = $config['logs_dir'].$fname.'.csv';
				
				file_put_contents($filepath, $out, FILE_APPEND);
							
				/*
				$retcode = cl_scanfile($file, $virus_name);
				if ($retcode !== CL_VIRUS){
					echo "Virus Detected! {$virus_name}";
				}
				*/
			}
		}

		// Set the iframe src path
		$url=urlencode($url);
		$iFrameUrl = 'proxy.php?url='.($url);	
		// Pass the page parameter	
		if(isset($_GET['page'])){
			$iFrameUrl .= '&page='.$_GET['page'];
		}
		
	}
	else{	
	
		$new_url =  shell_exec( $config['phantomjs_path'].'/phantomjs '.dirname(__FILE__).'/getfinalurl.js "'. $url .'" 5000');
		
		if( trim( $new_url ) == 'timeouterror' ){
			header('Location: index.php?error=timeout');
			die;		
		}

		if( trim( $new_url ) == 'urlfailed' ){
			header('Location: index.php?error=urlfailed');
			sendMail( $config['email_to_address'], 'Screenreader URL error handler', $config['email_to_address'] , 'Screenreader URL error handler' , $url);
			die;
		}


		//Extract URL form the output (Get the string after the tag <screenreaderfinalurl>, in order to get rid of possible phantomjs javascript errors)
		$extracted_url = substr($new_url, strrpos($new_url, '@') + 1);
		//$extracted_url = substr($new_url, strrpos($new_url, 'http'));
		//Remove whitespace
		$extracted_url = trim($extracted_url);
		

		//Remove line breaks form string
		//$extracted_url = str_replace(array("\r", "\n", "\r\n"), "", $extracted_url);
		
		// var_dump($extracted_url);
		// die;
		
		
		// if( $extracted_url  ){
			// header('Location: index.php?error=urlfailed');
			// sendMail( $config['email_to_address'], 'Screenreader URL error handler', $config['email_to_address'] , 'Screenreader URL error handler' , $url);
			// die;
		// }
		
		// var_dump(trim($url));
		// var_dump($extracted_url);
		// die;
		
		if( trim($url) != $extracted_url ){
		
			header('Location: index.php?url='.$extracted_url );
			die;
		}
		
		$url=urlencode($url);
		$iFrameUrl = 'proxy.php?url='.$url;
	}
}
else{	
	$iFrameUrl = "";
}

write_log($config, $url);
	
// Load home template
require dirname(__FILE__) . '/'.$config['templates_dir'].'home.php';