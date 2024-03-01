'use strict';

const { compileHTML, compileANSI } = require('../lib/core/compiler.js');

const italic = '_italic_';
const bold = '**bold**';
const monospaced = '`monospaced`';
const paragraph = 'paragraph1\n\nparagraph2';
const preformatted = '```preformatted```';
const leftBold = '**bold';
const rightBold = 'bold**';
const leftItalic = '_italic';
const rightItalic = 'italic_';
const leftMonospaced = '`monospaced';
const rightMonospaced = 'monospaced`';
const unpairedPreformatted = '```preformatted';
const nested = '**_nested_**';
/* eslint-disable max-len */
const complex = [
  'This is a **bold** text.',
  'This is an _italic_ text.',
  'This is a `monospaced` text.',
  'Here is a preformatted text: ``` const a = 1;',
  'const b = 2;',
  'console.log(a + b); ```',
].join('\n\n');
/* eslint-enable max-len */

describe('HTML compilation', () => {
  test('can compile italic', () => {
    const expected = '<p><i>italic</i></p>';
    expect(compileHTML(italic)).toBe(expected);
  });
  test('can compile bold', () => {
    const expected = '<p><strong>bold</strong></p>';
    expect(compileHTML(bold)).toBe(expected);
  });
  test('can compile monospaced', () => {
    const expected = '<p><tt>monospaced</tt></p>';
    expect(compileHTML(monospaced)).toBe(expected);
  });
  test('can compile paragraph', () => {
    const expected = '<p>paragraph1</p><p>paragraph2</p>';
    expect(compileHTML(paragraph)).toBe(expected);
  });
  test('can compile preformatted', () => {
    const expected = '<p><pre>preformatted</pre></p>';
    expect(compileHTML(preformatted)).toBe(expected);
  });
  test('can compile complex HTML', () => {
    // eslint-disable-next-line quotes
    const expected = `\
<p>This is a <strong>bold</strong> text.</p>\
<p>This is an <i>italic</i> text.</p>\
<p>This is a <tt>monospaced</tt> text.</p>\
<p>Here is a preformatted text: <pre> const a = 1;

const b = 2;

console.log(a + b); </pre></p>`;
    expect(compileHTML(complex)).toBe(expected);
  });
  test('can compile empty string', () => {
    expect(compileHTML('')).toBe('<p></p>');
  });
  test('does not compile unpaired tokens', () => {
    expect(() => compileHTML(leftBold)).toThrow();
    expect(() => compileHTML(rightBold)).toThrow();
    expect(() => compileHTML(leftItalic)).toThrow();
    expect(() => compileHTML(rightItalic)).toThrow();
    expect(() => compileHTML(leftMonospaced)).toThrow();
    expect(() => compileHTML(rightMonospaced)).toThrow();
    expect(() => compileHTML(unpairedPreformatted)).toThrow();
  });
  test('does not compile nested tokens', () => {
    expect(() => compileHTML(nested)).toThrow();
  });
});

describe('ANSI compilation', () => {
  test('can compile italic', () => {
    const expected = '\u001b[3mitalic\u001b[23m';
    expect(compileANSI(italic)).toBe(expected);
  });
  test('can compile bold', () => {
    const expected = '\u001b[1mbold\u001b[22m';
    expect(compileANSI(bold)).toBe(expected);
  });
  test('can compile monospaced', () => {
    const expected = '\u001b[7mmonospaced\u001b[27m';
    expect(compileANSI(monospaced)).toBe(expected);
  });
  test('can compile paragraph', () => {
    const expected = 'paragraph1\n\nparagraph2';
    expect(compileANSI(paragraph)).toBe(expected);
  });
  test('can compile preformatted', () => {
    const expected = '\u001b[7mpreformatted\u001b[27m';
    expect(compileANSI(preformatted)).toBe(expected);
  });
  test('can compile complex HTML', () => {
    // eslint-disable-next-line quotes
    const expected = `\
This is a \u001b[1mbold\u001b[22m text.\n\n\
This is an \u001b[3mitalic\u001b[23m text.\n\n\
This is a \u001b[7mmonospaced\u001b[27m text.\n\n\
Here is a preformatted text: \u001b[7m const a = 1;

const b = 2;

console.log(a + b); \u001b[27m`;
    expect(compileANSI(complex)).toBe(expected);
  });
  test('can compile empty string', () => {
    expect(compileANSI('')).toBe('');
  });
  test('does not compile unpaired tokens', () => {
    expect(() => compileANSI(leftBold)).toThrow();
    expect(() => compileANSI(rightBold)).toThrow();
    expect(() => compileANSI(leftItalic)).toThrow();
    expect(() => compileANSI(rightItalic)).toThrow();
    expect(() => compileANSI(leftMonospaced)).toThrow();
    expect(() => compileANSI(unpairedPreformatted)).toThrow();
  });
  test('does not compile nested tokens', () => {
    expect(() => compileANSI(nested)).toThrow();
  });
});
