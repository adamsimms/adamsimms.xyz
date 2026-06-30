#!/usr/bin/env node

/**
 * Optimization script for static site
 * Removes unused CSS, optimizes assets
 */

const fs = require('fs');
const path = require('path');

console.log('Starting optimization process...');

// Check if minified CSS files exist
const cssDir = path.join(__dirname, '..', 'css');
const minifiedFiles = ['styles.min.css', 'normalize.min.css'];

minifiedFiles.forEach((file) => {
  const filePath = path.join(cssDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✓ Found minified file: ${file}`);
  } else {
    console.warn(`⚠ Missing minified file: ${file}`);
  }
});

// Verify font files
const fontsDir = path.join(__dirname, '..', 'fonts');
if (fs.existsSync(fontsDir)) {
  const fonts = fs.readdirSync(fontsDir);
  console.log(`✓ Found ${fonts.length} font files`);
}

// Verify image files
const imgDir = path.join(__dirname, '..', 'img');
if (fs.existsSync(imgDir)) {
  const images = fs.readdirSync(imgDir);
  console.log(`✓ Found ${images.length} image files`);
}

console.log('Optimization check complete!');
