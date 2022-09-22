"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_stream_1 = require("node:stream");
const LimitExceededError_1 = __importDefault(require("./LimitExceededError"));
class LimitSizeStream extends node_stream_1.Transform {
    constructor(options) {
        super(options);
        this.size = 0;
        this.limit = options.limit;
        this.isObjectMode = Boolean(options.readableObjectMode);
    }
    _transform(chunk, encoding, callback) {
        if (this.isObjectMode) {
            this.size += 1;
        }
        else {
            this.size += chunk.length;
        }
        if (this.size > this.limit) {
            callback(new LimitExceededError_1.default());
        }
        else {
            callback(null, chunk);
        }
    }
}
exports.default = LimitSizeStream;
