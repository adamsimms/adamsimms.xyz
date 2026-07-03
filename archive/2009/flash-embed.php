<?php
function render_flash_embed(string $src, int $width, int $height, string $containerId = 'ruffle-container'): void
{
	$src = htmlspecialchars($src, ENT_QUOTES, 'UTF-8');
	$containerId = htmlspecialchars($containerId, ENT_QUOTES, 'UTF-8');
?>
<div id="<?php echo $containerId; ?>"></div>
<script type="text/javascript">
window.addEventListener('DOMContentLoaded', function() {
	var ruffle = window.RufflePlayer.newest();
	var player = ruffle.createPlayer();
	player.style.width = '<?php echo $width; ?>px';
	player.style.height = '<?php echo $height; ?>px';
	document.getElementById('<?php echo $containerId; ?>').appendChild(player);
	player.load('<?php echo $src; ?>');
});
</script>
<?php
}
