import http from "node:http";
import path from "node:path";
import fs from "node:fs";

const server = new http.Server();

server.on("request", (req, res) => {
  const url = new URL(req.url ?? "", `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, "files", pathname);

  switch (req.method) {
    case "GET":
      if (pathname.includes("/")) {
        res.statusCode = 400;
        res.end("Nested folders are not supported");
        return;
      }

      fs.stat(filepath, (err, stat) => {
        if (err?.code === "ENOENT") {
          res.statusCode = 404;
          res.end("File not found");
          return;
        }

        const stream = fs.createReadStream(filepath);
        stream.pipe(res);
      });
      break;

    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }
});

export default server;
