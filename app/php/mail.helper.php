<?php

if (!defined('SR_EXEC')) { die('Access denied'); }

require_once('config.local.php');
require_once('libs/phpmailer/class.phpmailer.php');
require_once('libs/phpmailer/class.smtp.php');
require_once('libs/phpmailer/class.pop3.php');
require_once('libs/phpmailer/PHPMailerAutoload.php');

function sendMail( $from, $fromname, $to , $subject , $body){	
	global $config;
	$mail = new PHPMailer(true);

	try {
		
		$mail->CharSet = 'UTF-8';
		
		if( isset($config['SMTP'])) {
			if($config['SMTP']['Host']&&$config['SMTP']['Username']&&$config['SMTP']['Password']&&$config['SMTP']['SMTPSecure']&&$config['SMTP']['Port']){
				
				$mail->isSMTP();                                      
				$mail->Host = $config['SMTP']['Host'];  				
				$mail->SMTPAuth = true;                               
				$mail->Username = $config['SMTP']['Username'];                 
				$mail->Password = $config['SMTP']['Password'];                          
				$mail->SMTPSecure = $config['SMTP']['SMTPSecure'];                          
				$mail->Port = $config['SMTP']['Port'];                                   
			}
		}
		
		$mail->From = $from;
		$mail->FromName = $fromname;
		$mail->AddAddress( $config ['email_to_address'] , $fromname );
		$mail->addReplyTo($from, $fromname);
		$mail->Subject = $subject;
		$mail->isHTML(true); 
		$mail->Body    = $body;
		$mail->AltBody = $body;
		
		if(!$mail->send()) {
			echo 'Message could not be sent.';
			echo 'Mailer Error: ' . $mail->ErrorInfo;
		} 
		
		echo "Message has been sent.";

	}catch ( phpmailerException $e ) {
		
		echo $e->errorMessage(); 

	}catch ( Exception $e ) {
	  
		echo $e->getMessage(); 

	}

}
?>
