import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API_ORIGIN = 'https://api.zotero.org';
const DEFAULT_COLLECTION_PATH = 'Website/Reading';
const LIST_START = '          <!-- reading-list:start -->';
const LIST_END = '          <!-- reading-list:end -->';
const SCHEMA_START = '    <!-- reading-schema:start -->';
const SCHEMA_END = '    <!-- reading-schema:end -->';

function loadDotEnv(dir) {
  const envPath = path.join(dir, '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }

  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const eq = trimmed.indexOf('=');
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function replaceMarkedBlock(html, relativePath, markerStart, markerEnd, inner) {
  if (!html.includes(markerStart) || !html.includes(markerEnd)) {
    throw new Error(`Missing ${markerStart.trim()} in ${relativePath}`);
  }

  const block = inner ? `${markerStart}\n${inner}\n${markerEnd}` : `${markerStart}\n${markerEnd}`;
  return html.replace(new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`), block);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function safeHttpUrl(value) {
  if (!value) {
    return '';
  }
  try {
    const url = new URL(String(value).trim());
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.href;
    }
  } catch {
    return '';
  }
  return '';
}

function itemUrl(data) {
  const direct = safeHttpUrl(data.url);
  if (direct) {
    return direct;
  }
  if (data.DOI) {
    const doi = String(data.DOI).trim().replace(/^https?:\/\/doi\.org\//i, '');
    return doi ? `https://doi.org/${doi}` : '';
  }
  return '';
}

function parseExtra(extra) {
  const parsed = { note: '', quote: '', cite: '', order: null };
  if (!extra) {
    return parsed;
  }

  for (const line of String(extra).split(/\r?\n/)) {
    const match = line.match(/^reading-(note|quote|cite|order):\s*(.*)$/i);
    if (!match) {
      continue;
    }
    const field = match[1].toLowerCase();
    const value = match[2].trim();
    if (field === 'order') {
      const n = Number.parseInt(value, 10);
      parsed.order = Number.isFinite(n) ? n : null;
    } else {
      parsed[field] = value;
    }
  }

  return parsed;
}

function hasTag(data, name) {
  const needle = name.toLowerCase();
  return (data.tags || []).some((tag) => String(tag.tag || '').toLowerCase() === needle);
}

function formatCreator(creator) {
  if (creator.name) {
    return String(creator.name).trim();
  }
  return [creator.firstName, creator.lastName].filter(Boolean).join(' ').trim();
}

function formatAuthors(creators) {
  const list = creators || [];
  const authors = list.filter(
    (creator) => !creator.creatorType || creator.creatorType === 'author'
  );
  const names = (authors.length ? authors : list).map(formatCreator).filter(Boolean);
  if (names.length === 0) {
    return '';
  }
  if (names.length === 1) {
    return names[0];
  }
  if (names.length === 2) {
    return `${names[0]} and ${names[1]}`;
  }
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

function displayCollectionName(name) {
  return String(name)
    .replace(/^\d+([.)]|[-:])\s+/, '')
    .trim();
}

function slugify(name) {
  const slug = String(name)
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-');
  return slug || 'section';
}

function sortItems(items) {
  return [...items].sort((a, b) => {
    if (a.order != null && b.order != null && a.order !== b.order) {
      return a.order - b.order;
    }
    if (a.order != null) {
      return -1;
    }
    if (b.order != null) {
      return 1;
    }
    return a.added.localeCompare(b.added) || a.title.localeCompare(b.title);
  });
}

function normalizeItem(raw) {
  const data = raw.data || {};
  if (data.itemType === 'attachment' || data.itemType === 'annotation') {
    return null;
  }

  const extra = parseExtra(data.extra);
  const isQuote = hasTag(data, 'quote') || Boolean(extra.quote);
  if (data.itemType === 'note' && !isQuote) {
    return null;
  }

  const title = String(data.title || '').trim();
  const authors = formatAuthors(data.creators);
  const quoteText = extra.quote || (isQuote ? String(data.abstractNote || '').trim() : '');

  return {
    key: data.key,
    title,
    authors,
    url: itemUrl(data),
    note: extra.note,
    order: extra.order,
    added: data.dateAdded || '',
    isQuote,
    quote: quoteText,
    cite: extra.cite || (isQuote ? authors || title : ''),
  };
}

async function zoteroRequest(apiKey, apiPath, searchParams = {}) {
  const url = new URL(apiPath, API_ORIGIN);
  for (const [key, value] of Object.entries(searchParams)) {
    if (value != null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    headers: {
      'Zotero-API-Key': apiKey,
      'Zotero-API-Version': '3',
    },
  });

  if (response.status === 429) {
    const wait = Number(response.headers.get('Backoff') || response.headers.get('Retry-After') || 5);
    await new Promise((resolve) => setTimeout(resolve, wait * 1000));
    return zoteroRequest(apiKey, apiPath, searchParams);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Zotero ${response.status} ${url.pathname}: ${body.slice(0, 240)}`);
  }

  return response;
}

async function zoteroJson(apiKey, apiPath, searchParams) {
  const response = await zoteroRequest(apiKey, apiPath, searchParams);
  return response.json();
}

async function zoteroAll(apiKey, apiPath, searchParams = {}) {
  const limit = 100;
  let start = 0;
  const all = [];

  for (;;) {
    const response = await zoteroRequest(apiKey, apiPath, {
      ...searchParams,
      limit: String(limit),
      start: String(start),
    });
    const batch = await response.json();
    if (!Array.isArray(batch) || batch.length === 0) {
      break;
    }
    all.push(...batch);
    const total = Number(response.headers.get('Total-Results') || all.length);
    start += batch.length;
    if (start >= total) {
      break;
    }
  }

  return all;
}

function findCollectionByPath(collections, pathParts) {
  let parentKey = false;
  let found = null;

  for (const part of pathParts) {
    found =
      collections.find((collection) => {
        const parent = collection.data.parentCollection || false;
        const parentMatch = parentKey === false ? parent === false : parent === parentKey;
        return collection.data.name === part && parentMatch;
      }) || null;
    if (!found) {
      return null;
    }
    parentKey = found.data.key;
  }

  return found;
}

function indentLines(html, spaces = 6) {
  const pad = ' '.repeat(spaces);
  return html
    .split('\n')
    .map((line) => (line ? pad + line : line))
    .join('\n');
}

function renderItem(item) {
  const title = escapeHtml(item.title || 'Untitled');
  const url = safeHttpUrl(item.url);
  const titleHtml = url
    ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${title}</a>`
    : `<span class="reading-item__title">${title}</span>`;
  const authorHtml = item.authors
    ? `<span class="reading-item__author">${escapeHtml(item.authors)}</span>`
    : '';
  const noteHtml = item.note
    ? `\n          <p class="reading-item__note">${escapeHtml(item.note)}</p>`
    : '';

  return `<li class="reading-item">
          <span class="reading-item__line">${titleHtml}${authorHtml}</span>${noteHtml}
        </li>`;
}

function renderQuote(item) {
  const text = escapeHtml(item.quote || item.title);
  const cite = item.cite ? `\n        <cite>${escapeHtml(item.cite)}</cite>` : '';
  return `<blockquote class="reading-quote">
        <p>${text}</p>${cite}
      </blockquote>`;
}

function renderSection(section, slugCounts) {
  const entries = sortItems(section.items.filter((item) => !item.isQuote));
  const quotes = sortItems(section.items.filter((item) => item.isQuote && item.quote));
  if (entries.length === 0 && quotes.length === 0) {
    return '';
  }

  let heading = '';
  if (section.name) {
    const base = slugify(section.name);
    const count = slugCounts.get(base) || 0;
    slugCounts.set(base, count + 1);
    const id = count === 0 ? `reading-${base}` : `reading-${base}-${count + 1}`;
    heading = `<h2 class="reading-section__title" id="${id}">${escapeHtml(section.name)}</h2>\n      `;
  }

  const list =
    entries.length > 0
      ? `<ul class="reading-list">
        ${entries.map(renderItem).join('\n        ')}
      </ul>`
      : '';
  const quoteHtml = quotes.map(renderQuote).join('\n      ');
  const labelledBy = heading.match(/id="([^"]+)"/);
  const aria = labelledBy
    ? ` aria-labelledby="${labelledBy[1]}"`
    : ' aria-label="Reading list"';

  return `<section class="reading-section"${aria}>
      ${heading}${list}${list && quoteHtml ? '\n      ' : ''}${quoteHtml}
    </section>`;
}

function renderListHtml(payload) {
  const sections = payload.sections.filter(
    (section) =>
      section.items.some((item) => !item.isQuote) ||
      section.items.some((item) => item.isQuote && item.quote)
  );

  if (sections.length === 0) {
    return indentLines(`<p class="reading-empty">This list is still empty.</p>`, 10);
  }

  const synced = payload.syncedAt ? new Date(payload.syncedAt) : new Date();
  const iso = synced.toISOString().slice(0, 10);
  const label = synced.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const slugCounts = new Map();
  const body = sections.map((section) => renderSection(section, slugCounts)).filter(Boolean);

  return indentLines(
    `<p class="reading-updated">
            Last updated: <time datetime="${iso}">${label}</time>
          </p>
          ${body.join('\n          ')}`,
    10
  );
}

function renderSchema(payload) {
  const elements = [];
  let position = 1;
  for (const section of payload.sections) {
    for (const item of sortItems(section.items.filter((entry) => !entry.isQuote))) {
      const element = {
        '@type': 'ListItem',
        position,
        name: item.title || 'Untitled',
      };
      if (item.authors) {
        element.author = item.authors;
      }
      const url = safeHttpUrl(item.url);
      if (url) {
        element.url = url;
      }
      elements.push(element);
      position += 1;
    }
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Reading list',
    url: 'https://adamsimms.xyz/reading/',
    author: {
      '@type': 'Person',
      name: 'Adam Simms',
      url: 'https://adamsimms.xyz',
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: elements,
    },
  };

  return `    <script type="application/ld+json">
      ${JSON.stringify(schema, null, 2).replace(/\n/g, '\n      ')}
    </script>`;
}

function writePage(payload) {
  const relativePath = 'reading/index.html';
  const filePath = path.join(rootDir, relativePath);
  let html = fs.readFileSync(filePath, 'utf8');
  html = replaceMarkedBlock(html, relativePath, LIST_START, LIST_END, renderListHtml(payload));
  html = replaceMarkedBlock(html, relativePath, SCHEMA_START, SCHEMA_END, renderSchema(payload));
  fs.writeFileSync(filePath, html);

  const snapshotPath = path.join(rootDir, 'reading', 'data.json');
  fs.writeFileSync(snapshotPath, `${JSON.stringify(payload, null, 2)}\n`);
}

function setupHelp(collectionPath) {
  return `Create a Zotero collection path "${collectionPath}" (subcollections become themes).
Add public URLs on items. Optional Extra fields:
  reading-note: short commentary
  reading-quote: standout passage
  reading-cite: quote attribution
  reading-order: 1
Tag an item quote to render it as a blockquote instead of a list entry.
Create a read-only API key at https://www.zotero.org/settings/keys
Then set ZOTERO_API_KEY (and optionally ZOTERO_COLLECTION_KEY or ZOTERO_COLLECTION_PATH).`;
}

async function fetchReadingList(apiKey) {
  const collectionPath = process.env.ZOTERO_COLLECTION_PATH || DEFAULT_COLLECTION_PATH;
  const pathParts = collectionPath.split('/').map((part) => part.trim()).filter(Boolean);
  if (pathParts.length === 0) {
    throw new Error('ZOTERO_COLLECTION_PATH is empty');
  }

  const keyInfo = await zoteroJson(apiKey, '/keys/current');
  const userID = process.env.ZOTERO_USER_ID || String(keyInfo.userID);
  if (!userID) {
    throw new Error('Could not determine Zotero user ID from the API key');
  }

  const base = `/users/${userID}`;
  const collections = await zoteroAll(apiKey, `${base}/collections`);
  const rootCollection = process.env.ZOTERO_COLLECTION_KEY
    ? collections.find((collection) => collection.data.key === process.env.ZOTERO_COLLECTION_KEY)
    : findCollectionByPath(collections, pathParts);

  if (!rootCollection) {
    throw new Error(
      `Zotero collection "${process.env.ZOTERO_COLLECTION_KEY || collectionPath}" was not found.\n${setupHelp(collectionPath)}`
    );
  }

  const rootKey = rootCollection.data.key;
  const subcollections = collections
    .filter((collection) => collection.data.parentCollection === rootKey)
    .sort((a, b) => a.data.name.localeCompare(b.data.name, 'en', { numeric: true }));

  const childKeys = new Set();
  const subSections = [];

  for (const sub of subcollections) {
    const items = (await zoteroAll(apiKey, `${base}/collections/${sub.data.key}/items/top`))
      .map(normalizeItem)
      .filter(Boolean);
    for (const item of items) {
      childKeys.add(item.key);
    }
    subSections.push({
      name: displayCollectionName(sub.data.name),
      key: sub.data.key,
      items,
    });
  }

  const parentItems = (await zoteroAll(apiKey, `${base}/collections/${rootKey}/items/top`))
    .map(normalizeItem)
    .filter((item) => item && !childKeys.has(item.key));

  const sections = [];
  if (parentItems.length > 0) {
    sections.push({ name: '', key: rootKey, items: parentItems });
  }
  sections.push(...subSections);

  return {
    syncedAt: new Date().toISOString(),
    collection: {
      key: rootKey,
      path: collectionPath,
      name: rootCollection.data.name,
    },
    sections,
  };
}

async function main() {
  loadDotEnv(rootDir);
  const optional = process.argv.includes('--optional');
  const fromJsonIdx = process.argv.indexOf('--from-json');

  if (fromJsonIdx !== -1) {
    const next = process.argv[fromJsonIdx + 1];
    const jsonPath = path.resolve(
      next && !next.startsWith('-') ? next : path.join(rootDir, 'reading', 'data.json')
    );
    const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    writePage(payload);
    console.log(`Reading list built from ${path.relative(rootDir, jsonPath)}.`);
    return;
  }

  const apiKey = process.env.ZOTERO_API_KEY || '';

  if (!apiKey) {
    const message = `ZOTERO_API_KEY is not set.\n${setupHelp(process.env.ZOTERO_COLLECTION_PATH || DEFAULT_COLLECTION_PATH)}`;
    if (optional) {
      console.warn(`Skipping reading list sync: ${message}`);
      return;
    }
    throw new Error(message);
  }

  const payload = await fetchReadingList(apiKey);
  writePage(payload);
  const count = payload.sections.reduce((sum, section) => sum + section.items.length, 0);
  console.log(
    `Reading list synced from Zotero collection "${payload.collection.path}" (${count} item${count === 1 ? '' : 's'}).`
  );
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
