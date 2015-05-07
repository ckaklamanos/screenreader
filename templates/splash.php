<div id="splash" <?php if(isset($_GET['url'])) echo 'style="display:none;"';?> >
	
	<?php if($config['offline']===false||$config['offline']===false&&!isset($_SESSION['access_key'])):?>
	
	<div id="url_form_wrapper" class="container row-fluid" style="display:none;">
		<form id="url_form" role="form" action="index.php" onsubmit="return check_valid_url();">
		  <div class="form-group">
			<input id="url" name="url" disabled class="form-control url<?php if(!isset($_GET['url'])) echo ' active';?>" placeholder="<?php echo _LANG_WEBSITE_OR_FILE_URL ?>">
		  </div>
		  <button <?php if($config['offline']===true&&!isset($_SESSION['access_key'])){echo 'disabled';}?> type="submit" class="btn btn-default"><?php echo _LANG_OK ?></button>
		</form>

	</div>
	
	<?php endif;?>
	
	<div id="splash_message_wrapper" class="container row-fluid" <?php if($config['offline']===true){ echo 'style="display:block;"';}else {echo 'style="display:none;"';}?>>
		<div id="splash_message">
			<?php if($config['offline']===true){ echo _LANG_OFFLINE;}?>
		</div>
	</div>
	
	<div id="footer">
      <div class="container">
        <p class="espa"><img title="<?php echo _LANG_ESPA;?>" src="app/css/images/espa.png"></p>
        <p class="text-muted"><?php echo _LANG_ESPA;?></p>
        <p class="text-muted"><?php echo _LANG_COPYRIGHT;?> - <a id="link-eap" title="<?php echo _LANG_EΑP;?>" href="http://www.eap.gr" target="_blank"><?php echo _LANG_EΑP;?></a></p>
		
      </div>
    </div>

</div>