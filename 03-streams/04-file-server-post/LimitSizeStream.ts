import { Transform, TransformOptions, TransformCallback } from "node:stream";
import LimitExceededError from "./LimitExceededError";

interface LimitSizeStreamOptions extends TransformOptions {
  limit: number;
}

class LimitSizeStream extends Transform {
  limit: number;
  isObjectMode: boolean;
  size = 0;

  constructor(options: LimitSizeStreamOptions) {
    super(options);

    this.limit = options.limit;
    this.isObjectMode = Boolean(options.readableObjectMode);
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) {
    if (this.isObjectMode) {
      this.size += 1;
    } else {
      this.size += chunk.length;
    }

    if (this.size > this.limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

export default LimitSizeStream;
