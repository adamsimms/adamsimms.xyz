#!/usr/bin/env node

/**
 * Extract and inline critical CSS for improved First Contentful Paint
 * This script identifies above-the-fold CSS and inlines it in the HTML
 */

const fs = require('fs');
const path = require('path');

console.log('Starting critical CSS extraction...');

// Read the main CSS files
const stylesPath = path.join(__dirname, '..', 'css', 'styles.css');
const normalizePath = path.join(__dirname, '..', 'css', 'normalize.css');
const indexPath = path.join(__dirname, '..', 'index.html');

if (!fs.existsSync(stylesPath) || !fs.existsSync(indexPath)) {
  console.error('Required files not found');
  process.exit(1);
}

// Read CSS files
const styles = fs.readFileSync(stylesPath, 'utf8');
const normalize = fs.readFileSync(normalizePath, 'utf8');

// Extract critical CSS - anything that affects above-the-fold content
// This includes: root variables, body, container, heading, paragraph, intro section
const criticalSelectors = [
  ':root',
  'html',
  'body',
  '.body',
  '.container',
  '.intro',
  '.heading',
  '.paragraph',
  '.lightning-bolt',
  '.skip-navigation',
  'header',
  'h1',
  'p',
  'em',
  'strong'
];

// Simple CSS extraction (for production, use a proper critical CSS tool)
function extractCriticalCSS(css, selectors) {
  const lines = css.split('\n');
  let criticalCSS = '';
  let inCriticalBlock = false;
  let braceCount = 0;
  let currentBlock = '';

  for (let line of lines) {
    // Check if line contains a critical selector
    const isCriticalSelector = selectors.some(selector => {
      return line.includes(selector) && (line.includes('{') || line.trim().endsWith(','));
    });

    if (isCriticalSelector) {
      inCriticalBlock = true;
      braceCount = 0;
    }

    if (inCriticalBlock) {
      currentBlock += line + '\n';
      
      // Count braces to know when block ends
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;

      if (braceCount === 0 && line.includes('}')) {
        criticalCSS += currentBlock;
        currentBlock = '';
        inCriticalBlock = false;
      }
    }

    // Always include @font-face and media queries for critical fonts
    if (line.includes('@font-face') || line.includes('@media')) {
      inCriticalBlock = true;
      braceCount = 0;
    }
  }

  return criticalCSS;
}

// Extract critical CSS
const criticalCSS = extractCriticalCSS(styles, criticalSelectors);

// Basic normalize CSS (minimal reset)
const criticalNormalize = `
html { line-height: 1.15; -webkit-text-size-adjust: 100%; }
body { margin: 0; }
h1 { font-size: 2em; margin: 0.67em 0; }
`;

// Combine critical CSS
const combinedCritical = criticalNormalize + '\n' + criticalCSS;

// Minify critical CSS (simple minification)
const minifiedCritical = combinedCritical
  .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
  .replace(/\s+/g, ' ') // Collapse whitespace
  .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around punctuation
  .trim();

console.log(`✓ Extracted ${minifiedCritical.length} bytes of critical CSS`);

// Save critical CSS for reference
const criticalCSSPath = path.join(__dirname, '..', 'css', 'critical.css');
fs.writeFileSync(criticalCSSPath, minifiedCritical);
console.log(`✓ Saved critical CSS to css/critical.css`);

// Read current HTML
let html = fs.readFileSync(indexPath, 'utf8');

// Check if critical CSS is already inlined
if (html.includes('<!-- CRITICAL_CSS -->')) {
  // Replace existing critical CSS
  html = html.replace(
    /<!-- CRITICAL_CSS -->[\s\S]*?<!-- \/CRITICAL_CSS -->/,
    `<!-- CRITICAL_CSS -->\n  <style>${minifiedCritical}</style>\n  <!-- /CRITICAL_CSS -->`
  );
} else {
  // Insert critical CSS before first stylesheet link
  html = html.replace(
    /(<!-- Stylesheets -->)/,
    `<!-- CRITICAL_CSS -->\n  <style>${minifiedCritical}</style>\n  <!-- /CRITICAL_CSS -->\n\n  $1`
  );
}

// Make non-critical CSS load asynchronously
html = html.replace(
  /<link href="css\/styles\.css" rel="stylesheet">/,
  '<link href="css/styles.css" rel="preload" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">\n  <noscript><link href="css/styles.css" rel="stylesheet"></noscript>'
);

// Write updated HTML
fs.writeFileSync(indexPath, html);
console.log('✓ Updated index.html with inline critical CSS');
console.log('✓ Critical CSS optimization complete!');
