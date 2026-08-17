import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildGhostpaneBlock,
  buildUmamiScriptTag,
  injectGhostpaneIntoHtml,
  loadAnalyticsConfig,
} from './analytics.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = loadAnalyticsConfig(rootDir);

function replaceMarkedBlock(html, relativePath, markerStart, markerEnd, inner) {
  if (!html.includes(markerStart) || !html.includes(markerEnd)) {
    throw new Error(`Missing ${markerStart.trim()} in ${relativePath}`);
  }

  const block = inner
    ? `${markerStart}\n    ${inner}\n${markerEnd}`
    : `${markerStart}\n${markerEnd}`;

  return html.replace(new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`), block);
}

function walkHtmlFiles(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      walkHtmlFiles(full, out);
    } else if (name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

const umamiTag = buildUmamiScriptTag(config);
const ghostpaneBlock = buildGhostpaneBlock(config);
const umamiStart = '    <!-- umami-analytics:start -->';
const umamiEnd = '    <!-- umami-analytics:end -->';
const ghostpaneStart = '    <!-- ghostpane-analytics:start -->';
const ghostpaneEnd = '    <!-- ghostpane-analytics:end -->';

const umamiTargets = ['index.html'];
const ghostpaneTargets = ['index.html', 'now/index.html', 'experiment.html', '404.html'];

for (const relativePath of umamiTargets) {
  const filePath = path.join(rootDir, relativePath);
  let html = fs.readFileSync(filePath, 'utf8');
  html = replaceMarkedBlock(html, relativePath, umamiStart, umamiEnd, umamiTag);
  fs.writeFileSync(filePath, html);
}

for (const relativePath of ghostpaneTargets) {
  const filePath = path.join(rootDir, relativePath);
  let html = fs.readFileSync(filePath, 'utf8');
  html = replaceMarkedBlock(html, relativePath, ghostpaneStart, ghostpaneEnd, ghostpaneBlock);
  fs.writeFileSync(filePath, html);
}

const archiveDir = path.join(rootDir, 'archive');
let archiveCount = 0;
if (fs.existsSync(archiveDir)) {
  for (const filePath of walkHtmlFiles(archiveDir)) {
    const original = fs.readFileSync(filePath, 'utf8');
    const next = injectGhostpaneIntoHtml(original, config);
    if (next !== original) {
      fs.writeFileSync(filePath, next);
      archiveCount += 1;
    }
  }
}

if (config.umamiWebsiteId) {
  console.log(`Umami analytics synced to ${umamiTargets.join(', ')}`);
} else {
  console.warn(
    'Umami analytics skipped: set umamiWebsiteId in analytics.config.json or UMAMI_WEBSITE_ID'
  );
}

if (config.ghostpaneSiteId) {
  console.log(`Ghostpane analytics synced to ${ghostpaneTargets.join(', ')}`);
  console.log(`Ghostpane analytics synced to ${archiveCount} archive HTML file(s)`);
} else {
  console.warn(
    'Ghostpane analytics skipped: set ghostpaneSiteId in analytics.config.json or GHOSTPANE_SITE_ID'
  );
}
