import "dotenv/config";
import { readFile } from "node:fs/promises";
import http from "node:http";
import { extname, join, normalize } from "node:path";

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "localhost";
const cwd = process.cwd();
const distClient = join(cwd, "dist/client");
const serverEntryUrl = new URL("../dist/server/server.js", import.meta.url);

const { default: server } = await import(serverEntryUrl.href);

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "application/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
]);

const serverInstance = http.createServer(async (req, res) => {
  const url = new URL(
    req.url ?? "/",
    `http://${req.headers.host ?? `${host}:${port}`}`,
  );
  const assetPath = normalize(url.pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(
    distClient,
    assetPath === "/" ? "index.html" : assetPath,
  );

  try {
    const stats = await readFile(filePath);
    const contentType =
      mimeTypes.get(extname(filePath)) ?? "application/octet-stream";
    res.writeHead(200, { "content-type": contentType });
    res.end(stats);
    return;
  } catch {
    const request = new Request(url, {
      body: req.method === "GET" || req.method === "HEAD" ? undefined : req,
      duplex: "half",
      headers: req.headers,
      method: req.method,
    });

    const response = await server.fetch(request);
    res.writeHead(response.status, Object.fromEntries(response.headers));

    if (req.method === "HEAD") {
      res.end();
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    res.end(Buffer.from(arrayBuffer));
  }
});

serverInstance.listen(port, host, () => {
  console.log(`Preview server running at http://${host}:${port}`);
});
