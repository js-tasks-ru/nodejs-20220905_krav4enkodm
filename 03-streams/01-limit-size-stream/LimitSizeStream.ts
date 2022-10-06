import {Transform, TransformOptions, TransformCallback} from 'stream';
import LimitExceededError from './LimitExceededError';

interface LimitSizeStreamOption extends TransformOptions {
  limit: number;
}

class LimitSizeStream extends Transform {
  size = 0;
  limit: number;

  constructor(options: LimitSizeStreamOption) {
    super(options);
    this.limit = options.limit;
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) {
    this.size += Buffer.byteLength(chunk, encoding);

    callback(this.size > this.limit ? new LimitExceededError() : null, chunk);
  }
}

export default LimitSizeStream;
