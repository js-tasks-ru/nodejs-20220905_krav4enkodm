class LimitExceededError extends Error {
  code = "LIMIT_EXCEEDED";

  constructor() {
    super("Limit has been exceeded.");

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default LimitExceededError;
