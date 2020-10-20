function sum(a, b) {
  if (typeof a !== 'number') {
    throw new TypeError('First argument is not a number');
  }
  if (typeof b !== 'number') {
    throw new TypeError('Second argument is not a number');
  }
  return a + b;
}

module.exports = sum;
