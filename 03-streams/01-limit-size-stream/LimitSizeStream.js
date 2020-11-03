const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.sent = 0;
  }

  _transform(chunk, encoding, callback) {
    const isLimitExceeded = this.sent + chunk.length > this.limit;

    if (isLimitExceeded) {
      callback(new LimitExceededError());
      return;
    }

    this.sent += chunk.length;
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
