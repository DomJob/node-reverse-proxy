const https = require("https");
const http = require("http");
const qs = require("querystring");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const forwards = config.services;
const domain = config.domain;

function requestListener(req, res) {
  var headers = req.headers;
  var subdomain = headers["host"].replace(`.${domain}`, "");
  if(subdomain == domain) {
    subdomain = "www";
  }
  headers["host"] = "localhost";

  forwardPort = forwards[subdomain];

  if (!forwardPort) {
    console.log(`${subdomain} — Default | -> ${req.method} ${req.url}`);

    res.end(
      `<h1>Unknown subdomain</h1><i>${subdomain}</i>`
    );
    return;
  }

  console.log(`${subdomain} — Port ${forwardPort} | ${req.method} ${req.url}`);

  var body = "";
  req.on("data", data => {
    body += data;
  });

  req.on("end", function() {
    proxyHeaders = req.headers;
    proxyHeaders["host"] = "localhost";

    proxyOptions = {
      protocol: "http:",
      hostname: "127.0.0.1",
      path: req.url,
      port: forwardPort,
      method: req.method,
      headers: proxyHeaders
    };

    proxyRequest = http.request(proxyOptions, proxyRes => {
      proxyBody = [];

      proxyRes.on("data", chunk => {
        proxyBody.push(chunk);
      });

      proxyRes.on("end", () => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        res.write(Buffer.concat(proxyBody));
        res.end();
      });
    });

    proxyRequest.on("error", e => {
      res.writeHead(500);
      res.end("<h1>500</h1>Something went wrong");
    });

    proxyRequest.write(body);
    proxyRequest.end();
  });
}

if(config.ssl.enabled) {
  https.createServer({
    key: fs.readFileSync(config.ssl.privkey),
    cert: fs.readFileSync(config.ssl.cert)
   }, requestListener).listen(443);
}

if(config.ssl.force-https) {
  http.createServer((req, res) => {
       res.writeHead(302, { Location: "https://" + req.headers.host + req.url });
       res.end();
  }).listen(80);
}else{
 http.createServer(requestListener).listen(80);
}
