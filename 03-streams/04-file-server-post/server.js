'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
Object.defineProperty(exports, '__esModule', {value: true});
const node_http_1 = __importDefault(require('node:http'));
const node_path_1 = __importDefault(require('node:path'));
const node_fs_1 = __importDefault(require('node:fs'));
const LimitSizeStream_1 = __importDefault(require('./LimitSizeStream'));
const server = new node_http_1.default.Server();
const limit = Math.pow(1024, 2); // 1Mb
server.on('request', (req, res) => {
  var _a;
  const url = new URL(
    (_a = req.url) !== null && _a !== void 0 ? _a : '',
    `http://${req.headers.host}`
  );
  const pathname = url.pathname.slice(1);
  const filepath = node_path_1.default.join(__dirname, 'files', pathname);
  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Nested folders are not supported');
        return;
      }
      node_fs_1.default.stat(filepath, (err, stat) => {
        if ((err === null || err === void 0 ? void 0 : err.code) === 'ENOENT') {
          const limitSizeStream = new LimitSizeStream_1.default({limit});
          const writableStream = node_fs_1.default.createWriteStream(filepath, {
            flags: 'wx',
          });
          limitSizeStream.on('error', (err) => {
            // @ts-expect-error
            if (err.code === 'LIMIT_EXCEEDED') {
              res.statusCode = 413;
              res.end(`File size greater than ${limit} bytes`);
              removeFileFromDisk();
            } else {
              console.warn(
                err === null || err === void 0 ? void 0 : err.message
              );
            }
          });
          writableStream
            .on('error', (err) => {
              console.warn(
                err === null || err === void 0 ? void 0 : err.message
              );
              res.statusCode = 500;
              res.end('Internar server error');
            })
            .on('finish', () => {
              res.statusCode = 201;
              res.end('File uploaded');
            });
          req.on('aborted', removeFileFromDisk);
          req.pipe(limitSizeStream).pipe(writableStream);
          return;
        }
        res.statusCode = 409;
        res.end('File already exist');
      });
      // res.end("wtf?");
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
  function removeFileFromDisk() {
    node_fs_1.default.unlink(filepath, (err) => {
      console.warn(err === null || err === void 0 ? void 0 : err.message);
    });
  }
});
exports.default = server;
