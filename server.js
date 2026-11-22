const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 8080;
function getEgressIp() {
  return new Promise((resolve) => {
    const req = https.get('https://ipinfo.io/ip', {timeout: 8000}, (res) => {
      let d = '';
      res.on('data', (c) => d += c);
      res.on('end', () => resolve(d.trim() || 'unknown'));
    });
    req.on('timeout', () => { req.destroy(); resolve('unknown'); });
    req.on('error', () => resolve('unknown'));
  });
}
const server = http.createServer(async (req, res) => {
  if (req.url === '/ip') {
    const ip = await getEgressIp();
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({egress_ip: ip}));
    return;
  }
  const file = fs.readFileSync(path.join(__dirname, 'index.html'));
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(file);
});
server.listen(PORT, () => console.log('Listening on ' + PORT));
