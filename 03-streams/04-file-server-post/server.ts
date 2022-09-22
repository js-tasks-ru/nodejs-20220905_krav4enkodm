import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import LimitSizeStream from "./LimitSizeStream";

const server = new http.Server();

const limit = Math.pow(1024, 2); // 1Mb

server.on("request", (req, res) => {
  const url = new URL(req.url ?? "", `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, "files", pathname);

  switch (req.method) {
    case "POST":
      if (pathname.includes("/")) {
        res.statusCode = 400;
        res.end("Nested folders are not supported");
        return;
      }

      fs.stat(filepath, (err, stat) => {
        if (err?.code === "ENOENT") {
          const limitSizeStream = new LimitSizeStream({ limit });
          const writableStream = fs.createWriteStream(filepath, {
            flags: "wx",
          });

          limitSizeStream.on("error", (err) => {
            // @ts-expect-error
            if (err.code === "LIMIT_EXCEEDED") {
              res.statusCode = 413;
              res.end(`File size greater than ${limit} bytes`);
              removeFileFromDisk();
            } else {
              console.warn(err?.message);
            }
          });

          writableStream
            .on("error", (err) => {
              console.warn(err?.message);
              res.statusCode = 500;
              res.end("Internar server error");
            })
            .on("finish", () => {
              res.statusCode = 201;
              res.end("File uploaded");
            });

          req.on("aborted", removeFileFromDisk);

          req.pipe(limitSizeStream).pipe(writableStream);

          return;
        }

        res.statusCode = 409;
        res.end("File already exist");
      });

      // res.end("wtf?");
      break;

    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }

  function removeFileFromDisk() {
    fs.unlink(filepath, (err) => {
      console.warn(err?.message);
    });
  }
});

export default server;
