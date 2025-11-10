const http = require('http');
const https = require('https');
const url = require('url');

const PORT = process.env.PORT || 8765;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);

  if (req.method === 'OPTIONS') {
    setCors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === '/status') {
    setCors(res);
    const scheme = req.socket && req.socket.encrypted ? 'https' : 'http';
    const host = req.headers.host || `localhost:${scheme === 'https' ? (Number(process.env.PORT_HTTPS || (Number(PORT) + 1))) : Number(PORT)}`;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, streamUrl: `${scheme}://${host}/stream.mjpeg` }));
    return;
  }

  if (pathname === '/snapshot.jpg') {
    setCors(res);
    const fetchFrame = (cb) => {
      const imgUrl = `https://picsum.photos/800/600.jpg?random=${Date.now()}`;
      https.get(imgUrl, (r) => {
        const chunks = [];
        r.on('data', (d) => chunks.push(d));
        r.on('end', () => cb(Buffer.concat(chunks)));
      }).on('error', () => cb(null));
    };
    fetchFrame((buf) => {
      if (!buf) { res.writeHead(500); res.end('no frame'); return; }
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(buf);
    });
    return;
  }

  if (pathname === '/stream.mjpeg') {
    // Habilitar CORS para permitir uso en canvas desde la app (https://localhost:3002)
    setCors(res);
    res.writeHead(200, {
      'Content-Type': 'multipart/x-mixed-replace; boundary=frame',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    let closed = false;
    res.on('close', () => { closed = true; clearInterval(timer); });

    const fetchFrame = (cb) => {
      const imgUrl = `https://picsum.photos/800/600.jpg?random=${Date.now()}`;
      https.get(imgUrl, (r) => {
        const chunks = [];
        r.on('data', (d) => chunks.push(d));
        r.on('end', () => cb(Buffer.concat(chunks)));
      }).on('error', () => cb(null));
    };

    const sendFrame = () => {
      fetchFrame((buf) => {
        if (closed || !buf) return;
        res.write(`--frame\r\nContent-Type: image/jpeg\r\nContent-Length: ${buf.length}\r\n\r\n`);
        res.write(buf);
        res.write('\r\n');
      });
    };

    const timer = setInterval(sendFrame, 800);
    sendFrame();
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bridge server running. Endpoints: /status, /stream.mjpeg');
});

server.listen(PORT, () => {
  console.log(`Bridge server listening on http://localhost:${PORT}`);
});

// Intentar levantar también servidor HTTPS si hay certificados disponibles
try {
  const crtPath = require('path').join(__dirname, '..', 'certs', 'dev-cert.pem');
  const keyPath = require('path').join(__dirname, '..', 'certs', 'dev-key.pem');
  const cert = require('fs').readFileSync(crtPath);
  const key = require('fs').readFileSync(keyPath);
  const httpsServer = https.createServer({ key, cert }, server.listeners('request')[0]);
  const HTTPS_PORT = Number(process.env.PORT_HTTPS || (Number(PORT) + 1));
  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`Bridge HTTPS server listening on https://localhost:${HTTPS_PORT}`);
  });
} catch (err) {
  console.log('[bridge] HTTPS not enabled:', err?.message || err);
}