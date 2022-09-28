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
const server = new node_http_1.default.Server();
server.on('request', (req, res) => {
  var _a;
  const url = new URL(
    (_a = req.url) !== null && _a !== void 0 ? _a : '',
    `http://${req.headers.host}`
  );
  const pathname = url.pathname.slice(1);
  const filepath = node_path_1.default.join(__dirname, 'files', pathname);
  switch (req.method) {
    case 'GET':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Nested folders are not supported');
        return;
      }
      node_fs_1.default.stat(filepath, (err, stat) => {
        if ((err === null || err === void 0 ? void 0 : err.code) === 'ENOENT') {
          res.statusCode = 404;
          res.end('File not found');
          return;
        }
        const stream = node_fs_1.default.createReadStream(filepath);
        stream.pipe(res);
      });
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});
exports.default = server;
