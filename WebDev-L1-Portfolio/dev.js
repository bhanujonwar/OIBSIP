const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

let PORT = parseInt(process.env.PORT, 10) || 5174;
const ROOT = process.cwd();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

const clients = new Set();

const LIVE_RELOAD_SNIPPET = `
<script>
(() => {
  const source = new EventSource('/__livereload');
  source.onmessage = (e) => {
    if (e.data === 'reload') {
      console.log('[Portfolio Dev] Live reload triggered by file update...');
      window.location.reload();
    }
  };
  source.onerror = () => {
    setTimeout(() => new EventSource('/__livereload'), 2500);
  };
})();
</script>
`;

let reloadTimeout = null;
fs.watch(ROOT, { recursive: false }, (eventType, filename) => {
  if (!filename) return;
  const ext = path.extname(filename).toLowerCase();
  if (['.html', '.css', '.js'].includes(ext)) {
    clearTimeout(reloadTimeout);
    reloadTimeout = setTimeout(() => {
      console.log(`\x1b[36m[Portfolio Dev]\x1b[0m Hot-reload triggered by update in: ${filename}`);
      for (const res of clients) {
        res.write('data: reload\n\n');
      }
    }, 120);
  }
});

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  if (urlPath === '/__livereload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('data: connected\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  let filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 File Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error');
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });

      if (ext === '.html') {
        const injected = content.toString('utf8').replace('</body>', `${LIVE_RELOAD_SNIPPET}</body>`);
        res.end(injected);
      } else {
        res.end(content);
      }
    });
  });
});

function startServer(portToTry) {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`\x1b[33m[Portfolio Dev]\x1b[0m Port ${portToTry} is in use, trying ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error(err);
    }
  });

  server.listen(portToTry, () => {
    PORT = portToTry;
    console.log(`\n\x1b[32m  BHANU PRATAP JONWAR — PORTFOLIO DEV SERVER\x1b[0m`);
    console.log(`  \x1b[36m➜\x1b[0m  \x1b[1mLocal URL:\x1b[0m  \x1b[32mhttp://localhost:${PORT}/\x1b[0m`);
    console.log(`  \x1b[36m➜\x1b[0m  \x1b[2mInternship:\x1b[0m OASIS INFOBYTE Level 1 • Task 2`);
    console.log(`  \x1b[36m➜\x1b[0m  \x1b[35mHot Reload: Active (watching index.html, style.css, script.js)\x1b[0m\n`);

    const openUrl = `http://localhost:${PORT}/`;
    if (process.platform === 'win32') {
      exec(`start ${openUrl}`, () => {});
    } else if (process.platform === 'darwin') {
      exec(`open ${openUrl}`, () => {});
    } else {
      exec(`xdg-open ${openUrl}`, () => {});
    }
  });
}

startServer(PORT);
