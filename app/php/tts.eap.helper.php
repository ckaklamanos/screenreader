<?php

	define('SR_EXEC', true);

	require '../../config.local.php';
	require '../../config.php';
	
	if($config['tts_service']=='free'){
		
		$txt=urlencode($_GET['txt']);

		$audio_url = file_get_contents('http://tts-api.com/tts.mp3?q='.$txt.'&return_url=1 ');
		echo $audio_url;
		
		return;
	}
	
	define( "WSDL_LOCATION", $config['tts_host']."vServer.php?wsdl" );
	define( "TTS_SUCCESS", 0);
	define( "TTS_INVALID_ID", -1);
	define( "TTS_NOT_ENOUGH_CREDITS", -2);
	define( "TTS_TRANSACTION_ERROR", -3);
	define( "TTS_DB_ERROR", -4);
	define( "TTS_SSML_ERROR", -5);
	define( "TTS_SYNTHESIS_ERROR", -6);
	define( "TTS_DB_COMMIT_FAILURE", -7);
	define( "TTS_POST_RROC_FAILURE", -8);
	define( "TTS_IO_FAILURE", -9);
	define( "TTS_BASE64_FAILURE", -10);
	define( "TTS_INVALID_WS_ACCOUNT", -11);
	
	$username = $config['tts_username'];
	$password= $config['tts_password'];
	

	if($config['tts_service']=='eapdemo'){
		call_tts_demo( $username , $password);
		return;
	}	
	
	if($config['tts_service']=='eaplive'){
	
		call_tts( $username , $password);
		return;	
		
	}

	//test_ws( $username, $password );
	
	
	
	function test_ws( $username, $password){
		
		//It fails to get voices
		
		$voices = get_ws_voices( $username, $password );
		
		if($voices)
			echo "available voices: ".print_r($voices);
		else
			echo "failed getting voices!";
		
		foreach ( $voices as $voice)
		{
			echo "<b> voice : $voice->voice, description:$voice->description </b><br>";
		}
		
		echo "<hr>";
		echo "<br>querying credits...<br>";
		
		$ret = get_ws_credits( $username, $password );
		
		print_r( $ret ) ;
		
		echo "<hr>";
		echo "<br>querying cost...<br>";
		
		$ret = get_ws_cost( $username , $password, "text to estimate cost");
		
		print_r( $ret ) ;
		echo "<hr>";

		call_tts( $username, $password );
		
		echo "<hr>";
		echo "<br>remaining credits...<br>";
		
		$ret = get_ws_credits( $username, $password );
		
		print_r( $ret ) ;
	
	
	}
	
	function get_ws_cost( $username, $password, $text )
	{
		$soap = new SoapClient(WSDL_LOCATION);
		try {
			$ret = $soap->queryCost( $username, $password, $text);
		}
		catch (Exception $e) {
			echo ("Service Exception!<br/>");
			echo ($e->getMessage());
			echo( $e->getFile() );
			return false;
		}
		
		return $ret;
	}
	function get_ws_credits( $username, $password ) {
	
		$soap = new SoapClient(WSDL_LOCATION);
		
		try {
			$ret = $soap->queryCredits( $username, $password);
		}
		catch (Exception $e) {

			echo ("Service Exception!<br/>");
			echo ($e->getMessage());
			echo( $e->getFile() );
			
			return false;
		}
		return $ret;
	
	}
	
	function get_ws_voices( $username, $password){
		
		$soap = new SoapClient(WSDL_LOCATION);
		
		try {
			$ret = $soap->enumVoices( $username, $password);
		}
		catch (Exception $e) {
			echo ("Service Exception!<br/>");
			echo ($e->getMessage());
			echo( $e->getFile() );
			return false;
		}
		
		return $ret;
	}
	
	function call_tts( $username , $password)
	{
		
		//$textToSay =  utf8_encode ( $_GET['txt'] ) ;
		
		if( $_GET['isie'] == 'true')
			$textToSay =  utf8_encode ( $_GET['txt'] ) ;
		else
			$textToSay =  $_GET['txt']  ;
		
		$soap = new SoapClient(WSDL_LOCATION);

		try {
			$voice = "chrysostomos";

			$withLex = 0;
			$jobname = "job name";
			$ret = $soap->wsTtS( $username, $password, $jobname, $textToSay, $voice, $withLex);
		}
		catch (Exception $e) {
			echo ("Reporting:Service Exception!<br/>");
			echo ($e->getMessage());
		}
		
		//tts success, data member contains base64 encoded audio
		if( $ret->err_code == 0 ){
			$base64 = $ret->data;
			$base64 = base64_decode( $base64 );
		
			//global $config;
			//$ret = file_put_contents( $config['home_path'].$config['http_path'].$config['audio_dir']."tts.mp3", $base64,FILE_BINARY);
			
			header('Content-Type: audio/mpeg');
			//header('Content-Disposition: filename="test.mp3"');
			
			
			// header('Content-length: '.filesize($filename));
			
			
			//header('Cache-Control: no-cache');
			//header("Content-Transfer-Encoding: chunked");	

			echo $base64;			
			
			//echo "tts result:[success]";
		}
		else
		{
				echo $ret->err_desc;
		}
		return 0;
	}
	
		function call_tts_demo( $username , $password)
		{
			if(PHP_OS=='WINNT')
				$filename = $_SERVER['DOCUMENT_ROOT'].'screenreader\audio\tts.mp3';
			else
				$filename = $_SERVER['DOCUMENT_ROOT'].'/screenreader/audio/tts.mp3';
				
			
				//$filename = '/var/www/screenreader/audio/tts.mp3';
			
			header('Content-Type: audio/mpeg');
			header('Content-Disposition: filename="test.mp3"');
				
				
			header('Cache-Control: no-cache');
			header("Content-Transfer-Encoding: chunked");	
			
			readfile($filename);
				
				
			//echo 'test';
		}
?>