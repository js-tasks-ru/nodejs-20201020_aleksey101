const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const STREAM_LIMIT = 1024 * 1024; // 1MB

const server = new http.Server();

const saveFile = (req, res, filepath) => {
  const limitStream = new LimitSizeStream({limit: STREAM_LIMIT});
  const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});

  req
      .pipe(limitStream)
      .pipe(writeStream);

  limitStream.on('error', (err) => {
    if (err.code === 'LIMIT_EXCEEDED') {
      res.statusCode = 413;
      fs.unlink(filepath, (err) => {});
      res.end('file id too big');
    }
  });

  writeStream
      .on('error', (err) => {
        res.statusCode = 409;
        res.end();
      })
      .on('close', () => {
        res.statusCode = 201;
        res.end('file created');
      });

  res.on('close', () => {
    if (res.finished) {
      return;
    }

    fs.unlink(filepath, (err) => {});
  });
};

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const isNestedPath = pathname.includes('..') || pathname.includes('/');

  if (isNestedPath) {
    res.statusCode = 400;
    res.end('Nested path is forbidden');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST': {
      saveFile(req, res, filepath);
      break;
    }
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
