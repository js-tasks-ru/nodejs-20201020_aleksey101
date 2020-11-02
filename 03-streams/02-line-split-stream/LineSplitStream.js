const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.row = '';
  }

  _transform(chunk, encoding, callback) {
    const chunkStr = chunk.toString();
    for (let i = 0; i < chunkStr.length; i++) {
      const char = chunkStr[i];
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
