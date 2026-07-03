#!/usr/bin/env php
<?php
/**
 * Build a static HTML export into dist/
 *
 * Usage:
 *   php build.php
 *   SITE_BASE_PATH=/design-v1 php build.php   # GitHub Pages project site
 */

define('STATIC_BUILD', true);

$root = __DIR__;
$dist = $root . '/dist';

$pages = [
	'index.php' => 'index.html',
	'washedup.php' => 'washedup.html',
	'desolate.php' => 'desolate.html',
	'fromto.php' => 'fromto.html',
	'bed.php' => 'bed.html',
	'controlme.php' => 'controlme.html',
	'pos.php' => 'pos.html',
	'mobile.php' => 'mobile.html',
	'istats.php' => 'istats.html',
	'lightspeed.php' => 'lightspeed.html',
	'webstore.php' => 'webstore.html',
	'pepin.php' => 'pepin.html',
	'xsilva.php' => 'xsilva.html',
	'copypaste.php' => 'copypaste.html',
	'irmaboom.php' => 'irmaboom.html',
	'booth.php' => 'booth.html',
	'lamp.php' => 'lamp.html',
	'lsmobileads.php' => 'lsmobileads.html',
	'info.php' => 'info.html',
	'images/hivaids/index.php' => 'images/hivaids/index.html',
];

function remove_dir(string $dir): void
{
	if (!is_dir($dir)) {
		return;
	}

	$items = scandir($dir);
	if ($items === false) {
		return;
	}

	foreach ($items as $item) {
		if ($item === '.' || $item === '..') {
			continue;
		}

		$path = $dir . '/' . $item;
		if (is_dir($path)) {
			remove_dir($path);
		} else {
			unlink($path);
		}
	}

	rmdir($dir);
}

function copy_dir(string $src, string $dest, array $exclude = []): void
{
	if (!is_dir($dest)) {
		mkdir($dest, 0755, true);
	}

	$items = scandir($src);
	if ($items === false) {
		return;
	}

	foreach ($items as $item) {
		if ($item === '.' || $item === '..') {
			continue;
		}

		$srcPath = $src . '/' . $item;
		$destPath = $dest . '/' . $item;
		$relative = str_replace('\\', '/', substr($srcPath, strlen($GLOBALS['root']) + 1));

		if (in_array($relative, $exclude, true)) {
			continue;
		}

		if (is_dir($srcPath)) {
			copy_dir($srcPath, $destPath, $exclude);
		} else {
			copy($srcPath, $destPath);
		}
	}
}

function rewrite_php_links(string $html): string
{
	return preg_replace('/\.php(\?|"|\'|#)/', '.html$1', $html);
}

function render_page(string $root, string $phpFile): string
{
	$_SERVER['HTTP_HOST'] = 'localhost';
	$_SERVER['HTTPS'] = 'off';
	$_SERVER['DOCUMENT_ROOT'] = $root;
	$_SERVER['SCRIPT_NAME'] = '/' . $phpFile;

	ob_start();
	include $root . '/' . $phpFile;
	$html = ob_get_clean();

	return rewrite_php_links($html);
}

echo "Building static site...\n";

remove_dir($dist);
mkdir($dist, 0755, true);

foreach ($pages as $phpFile => $htmlFile) {
	$output = $dist . '/' . $htmlFile;
	$dir = dirname($output);
	if (!is_dir($dir)) {
		mkdir($dir, 0755, true);
	}

	$html = render_page($root, $phpFile);
	file_put_contents($output, $html);
	echo "  {$phpFile} -> {$htmlFile}\n";
}

copy_dir($root . '/css', $dist . '/css');
copy_dir($root . '/js', $dist . '/js');
copy_dir($root . '/images', $dist . '/images', ['images/hivaids/index.php']);

foreach (['favicon.ico', 'favicon.gif'] as $file) {
	if (is_file($root . '/' . $file)) {
		copy($root . '/' . $file, $dist . '/' . $file);
	}
}

$basePath = getenv('SITE_BASE_PATH') ?: '/';
echo "\nDone. Output: dist/\n";
echo "Base path: {$basePath}\n";
echo "Preview:  cd dist && php -S 127.0.0.1:9090\n";
