const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 8765;
const dir = __dirname;

const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.join(dir, urlPath);
  // Directory URLs resolve to index.html, like GitHub Pages does
  if (urlPath === '/' || urlPath.endsWith('/')) filePath = path.join(filePath, 'index.html');
  else if (!path.extname(filePath)) filePath = path.join(filePath, 'index.html');
  if (!filePath.startsWith(dir)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(filePath)] || 'text/plain' });
    res.end(data);
  });
}).listen(port, () => console.log('Serving on ' + port));
