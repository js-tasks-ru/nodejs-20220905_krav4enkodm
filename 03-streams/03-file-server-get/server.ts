import url from "url";
import http from "http";
import path from "path";

const server = new http.Server();

server.on("request", (req, res) => {
  const url = new URL(req.url ?? "", `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, "files", pathname);

  switch (req.method) {
    case "GET":
      break;

    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }
});

export default server;