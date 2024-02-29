'use strict';

const { validatePath } = require('../lib/io/fs.js');

describe('File system IO', () => {
  test('can validate file path', () => {
    expect(() => validatePath('')).toThrow();
    expect(() => validatePath('file.md')).not.toThrow();
    expect(() => validatePath('file')).not.toThrow();
    expect(() => validatePath('/path/to/file.md')).not.toThrow();
    expect(() => validatePath('/path/to/file')).not.toThrow();
  });
});
