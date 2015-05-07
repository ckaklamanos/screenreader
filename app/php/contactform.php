<?php


if(!$_POST) die;

define('SR_EXEC', true);

require_once('../../config.local.php');
require_once('../../libs/phpmailer/class.phpmailer.php');
require_once('../../libs/phpmailer/class.smtp.php');
require_once('../../libs/phpmailer/class.pop3.php');
require_once('../../libs/phpmailer/PHPMailerAutoload.php');


if( !isset($config['email_to_address']) )
	return;
	
$mail = new PHPMailer(true);


$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$user = $_POST['user'];
$type = $_POST['type'];
$message = $_POST['message'];

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
	
	$mail->From = $email;
	$mail->FromName = $name;
    $mail->AddAddress($config ['email_to_address'], 'EAP Contact Form');
	$mail->addReplyTo($email, $name);
    $mail->Subject = $type.' από '.$user;
    $body = chr(0xEF).chr(0xBB).chr(0xBF).
    	'<br>Όνοματεπώνυμο: '.$name.
    	'<br>e-mail: '.$email.
    	'<br>Τηλέφωνο: '.$phone.
    	'<br>Είδος χρήστη: '.$user.
    	'<br>Κατηγορία ερώτησης: '.$type.
    	'<br>Ερώτημα: '.$message.
		'<br><br>'.
		'Αυτό το μήνυμα εστάλει μέσω της φόρμας επικοινωνίας της εφαρμογής Screereader.';
		
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
?>
