<?php if (!defined('SR_EXEC')) { die('Access denied'); }?>

<!DOCTYPE html>

<html lang="el">

<head>
	
	<?php require $config['templates_dir'].'head.php';?>
	
	<?php if($config['google_analytics_tracking_id']!='') {include_once $config['templates_dir'].'google.analytics.php';}?>
	
</head>

<?php if( isset($_GET['url'] ) ) { $_url = parse_url ( $_GET['url'] ) ;}else{ $_url = false; } ?>

<body <?php echo 'data-development_mode="'.$config['development_mode'].'"'?> <?php echo 'data-host="'.$config['http_host'].'"'?> <?php echo 'data-path="'.$config['http_path'].'"'?> <?php if(isset($_GET['url'])) echo 'data-url="'.$_GET['url'].'"';?> <?php if(array_key_exists( $_url['host'] ,$custom_css)) { echo 'custom-css="'.htmlentities ( json_encode($custom_css[$_url['host']]) ).'"';}?> <?php if($_url) { foreach ($_url as $key => $value) { echo 'data'.$key.'="'.$value.'"'; } }?> >
	
	<?php require $config['templates_dir'].'header.php';?>
	<?php require $config['templates_dir'].'iframe.php';?>
	<?php require $config['templates_dir'].'loading.container.php';?>
	<?php require $config['templates_dir'].'audio.player.php';?>
	<?php require $config['templates_dir'].'splash.php';?>

</body>

</html>