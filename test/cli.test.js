'use strict';

process.argv.push('markdown.md', '--out', 'output.html', '--format', 'ansi');
const { args, opts } = require('../config.js');

describe('CLI', () => {
  {
    test('can receive the input file', () => {
      expect(args).toEqual(['markdown.md']);
    });
    test('can receive the output file', () => {
      expect(opts.out).toBe('output.html');
    });
    test('can receive the format', () => {
      expect(opts.format).toBe('ansi');
    });
  }
});
