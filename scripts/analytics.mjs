import fs from 'node:fs';
import path from 'node:path';

export const UMAMI_SCRIPT_URL = 'https://cloud.umami.is/script.js';
export const UMAMI_DOMAINS = 'adamsimms.xyz,syllabi.adamsimms.xyz';
export const UMAMI_CONNECT_SRC =
  'https://cloud.umami.is https://gateway.umami.is https://api-gateway.umami.dev';
export const GHOSTPANE_SCRIPT_URL = 'https://analytics.adamsimms.xyz/gp.js';

export function loadAnalyticsConfig(rootDir) {
  const configPath = path.join(rootDir, 'analytics.config.json');
  const defaults = {
    umamiWebsiteId: '',
    umamiScriptUrl: UMAMI_SCRIPT_URL,
    domains: UMAMI_DOMAINS,
    ghostpaneSiteId: '',
    ghostpaneScriptUrl: GHOSTPANE_SCRIPT_URL,
  };

  let file = defaults;
  if (fs.existsSync(configPath)) {
    file = { ...defaults, ...JSON.parse(fs.readFileSync(configPath, 'utf8')) };
  }

  return {
    umamiWebsiteId: process.env.UMAMI_WEBSITE_ID || file.umamiWebsiteId || '',
    umamiScriptUrl: file.umamiScriptUrl || UMAMI_SCRIPT_URL,
    domains: file.domains || UMAMI_DOMAINS,
    ghostpaneSiteId: process.env.GHOSTPANE_SITE_ID || file.ghostpaneSiteId || '',
    ghostpaneScriptUrl: file.ghostpaneScriptUrl || GHOSTPANE_SCRIPT_URL,
  };
}

export function buildUmamiScriptTag(config) {
  if (!config.umamiWebsiteId) {
    return '';
  }

  return `<script defer src="${config.umamiScriptUrl}" data-website-id="${config.umamiWebsiteId}" data-domains="${config.domains}" data-do-not-track="true"></script>`;
}

export const GHOSTPANE_MARKER_START = '<!-- ghostpane-analytics:start -->';
export const GHOSTPANE_MARKER_END = '<!-- ghostpane-analytics:end -->';

export function buildGhostpaneScripts(config) {
  if (!config.ghostpaneSiteId) {
    return '';
  }

  const stub =
    '<script>window.ghostpane=window.ghostpane||function(){(window.ghostpane.q=window.ghostpane.q||[]).push(arguments)}</script>';
  const tag = `<script defer data-site="${config.ghostpaneSiteId}" data-outbound data-vitals data-video src="${config.ghostpaneScriptUrl}"></script>`;
  return `${stub}\n${tag}`;
}

export function buildGhostpaneBlock(config, indent = '    ') {
  const scripts = buildGhostpaneScripts(config);
  if (!scripts) {
    return '';
  }

  return scripts.replace('\n', `\n${indent}`);
}

export function injectGhostpaneIntoHtml(html, config) {
  const scripts = buildGhostpaneScripts(config);
  if (!scripts) {
    if (html.includes(GHOSTPANE_MARKER_START)) {
      return html.replace(
        new RegExp(`${GHOSTPANE_MARKER_START}[\\s\\S]*?${GHOSTPANE_MARKER_END}\\n?`, 'g'),
        ''
      );
    }
    return html;
  }

  const snippet = `${GHOSTPANE_MARKER_START}\n${scripts}\n${GHOSTPANE_MARKER_END}\n`;
  if (html.includes(GHOSTPANE_MARKER_START)) {
    return html.replace(
      new RegExp(`${GHOSTPANE_MARKER_START}[\\s\\S]*?${GHOSTPANE_MARKER_END}\\n?`, 'g'),
      snippet
    );
  }

  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${snippet}</head>`);
  }

  return html;
}
