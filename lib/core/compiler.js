'use strict';

const { TYPES, MARKING, HTML_MAP, ANSI_MAP } = require('./constants.js');
const { toggle } = require('./utils.js');
const { parse } = require('./parser.js');

const createCompiler = (map, type) => {
  let i = 0;
  const mapping = map[type];
  return (src, token, offset) => {
    const slice = src.slice(offset, token.index);
    const compiled = `${slice}${mapping[i]}`;
    i = toggle(i);
    return compiled;
  };
};

const createCompilers = (map) =>
  Object.fromEntries(
    Object.values(TYPES).map((type) => [type, createCompiler(map, type)]),
  );

const compile = (map) => {
  const [, , open, close] = map[TYPES.PARAGRAPH];
  const compilers = createCompilers(map);
  return (src) => {
    let offset = 0;
    const res = [open];
    const { tokens, sanitized } = parse(src);
    for (const token of tokens) {
      const compiler = compilers[token.type];
      const compiled = compiler(sanitized, token, offset);
      offset = token.index + MARKING[token.type].length;
      res.push(compiled);
    }
    res.push(sanitized.slice(offset, sanitized.length), close);
    return res.join('');
  };
};

const compileHTML = compile(HTML_MAP);
const compileANSI = compile(ANSI_MAP);

module.exports = {
  compileHTML,
  compileANSI,
};
