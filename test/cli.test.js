'use strict';

process.argv.push('markdown.md', '--out', 'output.html');
const { args, opts } = require('../config.js');

describe('CLI', () => {
  test('can retreive the input file', () => {
    expect(args).toEqual(['markdown.md']);
  });
  test('can retreive the output file', () => {
    expect(opts.out).toBe('output.html');
  });
});
