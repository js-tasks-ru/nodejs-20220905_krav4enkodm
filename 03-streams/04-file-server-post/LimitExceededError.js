'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
class LimitExceededError extends Error {
  constructor() {
    super('Limit has been exceeded.');
    this.code = 'LIMIT_EXCEEDED';
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
exports.default = LimitExceededError;
