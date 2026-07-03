<?php
if (defined('STATIC_BUILD')) {
	$basePath = getenv('SITE_BASE_PATH') ?: '/';
	$baseHref = rtrim($basePath, '/') . '/';
	if ($baseHref === '/') {
		$baseHref = '/';
	}
} else {
	$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
	$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
	$docRoot = realpath($_SERVER['DOCUMENT_ROOT'] ?? __DIR__);
	$siteDir = realpath(__DIR__);
	$basePath = '/';
	if ($docRoot && $siteDir && strpos($siteDir, $docRoot) === 0) {
		$basePath = str_replace('\\', '/', substr($siteDir, strlen($docRoot)));
		$basePath = rtrim($basePath, '/') . '/';
	}
	$baseHref = $scheme . '://' . $host . $basePath;
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" dir="ltr">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	
	<title>Adam Simms &raquo;</title>
	
	<!-- Meta Tags -->
	<base href="<?php echo htmlspecialchars($baseHref, ENT_QUOTES, 'UTF-8'); ?>" />
	<meta name="author" content="Adam Simms" />
	<meta name="description" content="" />
	<meta name="copyright" content="Adam Simms 2009" />
	<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
	<meta name="keywords" content="#" />
	
	<!-- Fav icon -->
	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
	
	<!-- JavaScript setup -->
	<script type="text/javascript">
	/*<![CDATA[*/
	// add 'js' class to root element to nicely allow css that degrades gracefully if js is disabled
	document.getElementsByTagName('html')[0].className = 'js';
	/*]]>*/
	</script>

	<script type="text/javascript">
	window.RufflePlayer = window.RufflePlayer || {};
	window.RufflePlayer.config = {
		autoplay: "on",
		unmuteOverlay: "hidden"
	};
	</script>
	<script type="text/javascript" src="js/ruffle/ruffle.js"></script>

	<script type="text/javascript" src="js/jquery-1.3.2.min.js"></script>
	<script type="text/javascript" src="js/js.js"></script>
	
	<!-- CSS -->
	<link rel="stylesheet" href="css/reset.css" type="text/css" media="screen, projection" />
	<link rel="stylesheet" href="css/styles.css" type="text/css" media="screen, projection" />
	
	<script type="text/javascript" >
		$(function() {
			if (!$('#slideshow img').length) {
				return;
			}

			$('#slideshow').after('<div id="numbers" class="numbers">').cycle({
				fx:     'fade',
				speed:  'slow',
				timeout: 0,
				pager:  '#numbers',
				before: onBefore
			});

			function onBefore() {
				$('#title').html(this.alt);
			}
		});
	</script>

	
	
</head>
<body>
<div id="container">