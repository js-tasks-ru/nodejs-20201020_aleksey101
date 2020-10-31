const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super({
      ...options,
      objectMode: true,
    });
    this.row = '';
  }

  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; i++) {
      const char = chunk[i];
      if (char === os.EOL) {
        this.push(this.row);
        this.row = '';
      } else {
        this.row += char;
      }
    }
    callback();
  }

  _flush(callback) {
    callback(null, this.row);
  }
}

module.exports = LineSplitStream;
