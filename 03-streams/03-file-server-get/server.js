"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const server = new http_1.default.Server();
server.on("request", (req, res) => {
    var _a;
    const url = new URL((_a = req.url) !== null && _a !== void 0 ? _a : "", `http://${req.headers.host}`);
    const pathname = url.pathname.slice(1);
    const filepath = path_1.default.join(__dirname, "files", pathname);
    switch (req.method) {
        case "GET":
            break;
        default:
            res.statusCode = 501;
            res.end("Not implemented");
    }
});
exports.default = server;
