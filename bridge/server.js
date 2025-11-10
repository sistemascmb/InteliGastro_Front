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
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, streamUrl: `http://localhost:${PORT}/stream.mjpeg` }));
    return;
  }

  if (pathname === '/stream.mjpeg') {
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