import http from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const gameDataPath = path.join(repoRoot, 'app/frontend/src/data/gameData.ts');
const publicRoot = path.join(repoRoot, 'app/frontend/public');
const editorRoot = __dirname;
const port = Number(process.env.PORT || 4174);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', ...headers });
  res.end(body);
}

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function findMatching(source, startIndex, openChar, closeChar) {
  let depth = 0;
  let inString = false;
  let stringQuote = '';
  let escape = false;
  for (let i = startIndex; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === '\\') {
        escape = true;
        continue;
      }
      if (ch === stringQuote) {
        inString = false;
        stringQuote = '';
      }
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      stringQuote = ch;
      continue;
    }
    if (ch === openChar) depth += 1;
    if (ch === closeChar) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function extractLevelBlock(source, levelId) {
  const idNeedle = `id: ${levelId},`;
  const idIndex = source.indexOf(idNeedle);
  if (idIndex === -1) return null;
  const start = source.lastIndexOf('{', idIndex);
  if (start === -1) return null;
  const end = findMatching(source, start, '{', '}');
  if (end === -1) return null;
  return { start, end: end + 1, text: source.slice(start, end + 1) };
}

function extractItemsBlock(levelBlock) {
  const itemsIndex = levelBlock.text.indexOf('items: [');
  if (itemsIndex === -1) return null;
  const lineStart = levelBlock.text.lastIndexOf('\n', itemsIndex) + 1;
  const arrayStart = levelBlock.text.indexOf('[', itemsIndex);
  const arrayEnd = findMatching(levelBlock.text, arrayStart, '[', ']');
  if (arrayEnd === -1) return null;
  let end = arrayEnd + 1;
  if (levelBlock.text[end] === ',') end += 1;
  return {
    start: lineStart,
    end,
    text: levelBlock.text.slice(arrayStart, arrayEnd + 1),
  };
}

function parseItems(itemsText) {
  const items = [];
  const itemRe = /\{\s*id: '([^']+)',\s*name: '([^']+)',\s*icon: '([^']+)'(?:,\s*image: '([^']+)')?,\s*x: ([0-9.]+),\s*y: ([0-9.]+),\s*hitRadius: ([0-9.]+)(?:,\s*hitBox: (\{[\s\S]*?\}))?\s*\},?/g;
  let match;
  while ((match = itemRe.exec(itemsText))) {
    let hitBox = null;
    if (match[8]) {
      try {
        hitBox = Function(`return (${match[8]})`)();
      } catch {
        hitBox = null;
      }
    }
    items.push({
      id: match[1],
      name: match[2],
      icon: match[3],
      image: match[4] || '',
      x: Number(match[5]),
      y: Number(match[6]),
      hitRadius: Number(match[7]),
      hitBox,
    });
  }
  return items;
}

function parseLevels(source) {
  const levels = [];
  const levelRe = /\n  \{\n    id: (\d+),[\s\S]*?\n  \},/g;
  let match;
  while ((match = levelRe.exec(source))) {
    const levelId = Number(match[1]);
    const block = extractLevelBlock(source, levelId);
    if (!block) continue;
    const backgroundMatch = block.text.match(/background: '([^']+)'/);
    const nameMatch = block.text.match(/name: '([^']+)'/);
    const itemsBlock = extractItemsBlock(block);
    if (!backgroundMatch || !nameMatch || !itemsBlock) continue;
    levels.push({
      id: levelId,
      name: nameMatch[1],
      background: backgroundMatch[1],
      items: parseItems(itemsBlock.text),
    });
  }
  return levels;
}

function formatItem(item) {
  const image = item.image ? `, image: '${item.image}'` : '';
  const hitBox = item.hitBox
    ? `, hitBox: { left: ${item.hitBox.left}, right: ${item.hitBox.right}, top: ${item.hitBox.top}, bottom: ${item.hitBox.bottom}, rotation: ${item.hitBox.rotation} }`
    : '';
  return `      { id: '${item.id}', name: '${item.name}', icon: '${item.icon}'${image}, x: ${item.x}, y: ${item.y}, hitRadius: ${item.hitRadius}${hitBox} },`;
}

async function readLevels() {
  const source = await readFile(gameDataPath, 'utf8');
  return parseLevels(source);
}

async function saveLevel(levelId, items) {
  let source = await readFile(gameDataPath, 'utf8');
  const block = extractLevelBlock(source, levelId);
  if (!block) throw new Error(`Level ${levelId} not found`);
  const itemsBlock = extractItemsBlock(block);
  if (!itemsBlock) throw new Error(`Items block for level ${levelId} not found`);

  const formatted = [
    '    items: [',
    ...items.map(formatItem),
    '    ],',
  ].join('\n');

  const updatedLevel =
    block.text.slice(0, itemsBlock.start) +
    formatted +
    block.text.slice(itemsBlock.end);
  source = source.slice(0, block.start) + updatedLevel + source.slice(block.end);
  await writeFile(gameDataPath, source, 'utf8');
}

function serveStatic(req, res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = mimeTypes[ext] || 'application/octet-stream';
  readFile(filePath)
    .then((data) => {
      res.writeHead(200, { 'Content-Type': type });
      res.end(data);
    })
    .catch(() => send(res, 404, 'Not found'));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  if (url.pathname === '/api/levels' && req.method === 'GET') {
    try {
      json(res, 200, await readLevels());
    } catch (error) {
      json(res, 500, { error: String(error) });
    }
    return;
  }

  if (url.pathname === '/api/save' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        if (!payload.levelId || !Array.isArray(payload.items)) {
          json(res, 400, { error: 'Invalid payload' });
          return;
        }
        await saveLevel(Number(payload.levelId), payload.items);
        json(res, 200, { ok: true });
      } catch (error) {
        json(res, 500, { error: String(error) });
      }
    });
    return;
  }

  if (url.pathname.startsWith('/assets/')) {
    serveStatic(req, res, path.join(publicRoot, url.pathname));
    return;
  }

  const routePath = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.join(editorRoot, routePath);
  serveStatic(req, res, filePath);
});

server.listen(port, () => {
  console.log(`Level position editor running at http://localhost:${port}`);
});
