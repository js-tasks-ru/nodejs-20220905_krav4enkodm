"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const LimitExceededError_1 = __importDefault(require("./LimitExceededError"));
class LimitSizeStream extends stream_1.Transform {
    constructor(options) {
        super(options);
        this.size = 0;
        this.limit = options.limit;
    }
    _transform(chunk, encoding, callback) {
        this.size += Buffer.byteLength(chunk, encoding);
        callback(this.size > this.limit ? new LimitExceededError_1.default() : null, chunk);
    }
}
exports.default = LimitSizeStream;
