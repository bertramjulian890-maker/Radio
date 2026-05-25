import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
const preferredPort = Number(process.env.PORT || 8765);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.json': 'application/json',
};

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (urlPath === '/favicon.ico') {
      res.writeHead(204);
      res.end();
      return;
    }
    const safePath = normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
    const filePath = join(root, safePath === '/' ? 'radio-prototype/index.html' : safePath.replace(/^\//, ''));

    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      res.writeHead(302, { Location: `${urlPath.endsWith('/') ? urlPath : `${urlPath}/`}index.html` });
      res.end();
      return;
    }

    const body = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

function listen(port) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, () => {
      server.removeListener('error', reject);
      resolve(port);
    });
  });
}

for (let port = preferredPort; port < preferredPort + 10; port += 1) {
  try {
    // eslint-disable-next-line no-await-in-loop
    const activePort = await listen(port);
    const base = `http://localhost:${activePort}`;
    console.log(`Radio prototype dev server running at ${base}`);
    console.log(`  index:   ${base}/radio-prototype/index.html`);
    console.log(`  player:  ${base}/radio-prototype/unicorn.html`);
    break;
  } catch (error) {
    if (error.code !== 'EADDRINUSE' || port === preferredPort + 9) {
      throw error;
    }
  }
}
