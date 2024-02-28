'use strict';

const { TYPES, FLANKS, DELIMETERS, PATTERNS } = require('./constants.js');
const { SortedList, splitArray, find } = require('./utils.js');

const RX_FLAGS = 'gmu';

const createTokensList = () => new SortedList((a, b) => a.index < b.index);

class Token {
  #type = [];

  constructor(index, type, flank) {
    this.#type.push(type);
    this.index = index;
    if (flank) this.#type.push(flank);
  }

  get type() {
    return this.#type[0];
  }

  get leftFlanked() {
    return this.#type.includes(FLANKS.LEFT);
  }

  get rightFlanked() {
    return this.#type.includes(FLANKS.RIGHT);
  }

  set flank(flank) {
    this.#type.push(flank);
  }
}

const match = (tokens, src, rx, type, flank) => {
  const regExp = new RegExp(rx, RX_FLAGS);
  let match = null;
  while (((match = regExp.exec(src)), match)) {
    const { index } = match;
    const token = tokens.find((token) => token.index === index);
    if (token) token.flank = flank;
    else tokens.push(new Token(index, type, flank));
  }
};

const tokenize = (src) => {
  const tokens = createTokensList();
  for (const pattern of PATTERNS) {
    const flanks =
      pattern.rx instanceof RegExp
        ? [['', pattern.rx]]
        : Object.entries(pattern.rx);
    for (const [flank, rx] of flanks)
      match(tokens, src, rx, pattern.type, flank);
  }
  return tokens;
};

const prefStrat = (token) => token.type === TYPES.PREFORMATTED;

const evalPrefScope = (acc, scope) => {
  const [open, oIdx] = find(scope, prefStrat);
  if (!open) return [scope, null];
  const [close, cIdx] = find(scope, prefStrat, oIdx + 1);
  if (!close)
    throw new Error(
      `unpaired preformatted token found at index: ${open.index}`,
    );
  acc.push(open, close);
  const [part, , slice] = splitArray(scope, oIdx, cIdx);
  return [part, slice];
};

const evalPref = (acc, scopes) => {
  const res = [];
  for (let scope of scopes) {
    if (!scope.length) continue;
    do {
      const [part, slice] = evalPrefScope(acc, scope);
      res.push(part);
      scope = slice;
    } while (scope);
  }
  return res;
};

const evalParagraph = (acc, scopes) => {
  const res = [];
  for (const scope of scopes) {
    if (!scope.length) continue;
    const indexes = scope.reduce((acc, token, i) => {
      if (token.type === TYPES.PARAGRAPH) acc.push(i);
      return acc;
    }, []);
    for (const index of indexes) acc.push(scope[index]);
    const paragraphs = splitArray(scope, ...indexes);
    res.push(...paragraphs);
  }
  return res;
};

const checkNested = (scope) => {
  if (!scope.length) return;
  for (const delimeter of DELIMETERS) {
    const [left, lIdx] = find(
      scope,
      (token) => token.type === delimeter && token.leftFlanked,
    );
    if (!left) continue;
    const [right, rIdx] = find(
      scope,
      (token) => token.type === delimeter && token.rightFlanked,
      lIdx + 1,
    );
    if (right) {
      throw new Error(`nested ${delimeter} token found at index: ${rIdx}`);
    }
  }
};

const evalDelimeters = (acc, scopes) => {
  let prev = null;
  for (const scope of scopes) {
    if (!scope.length) continue;
    for (const token of scope) {
      const { type } = token;
      if (!prev) {
        if (token.leftFlanked) prev = token;
        else
          throw new Error(
            `unpaired ${type} token found at index: ${token.index}`,
          );
      } else if (prev.type === type && token.rightFlanked) {
        const oIdx = scope.indexOf(prev);
        const cIdx = scope.indexOf(token);
        checkNested(scope.slice(oIdx + 1, cIdx));
        acc.push(prev, token);
        prev = null;
      }
    }
    if (prev)
      throw new Error(
        `unpaired ${prev.type} token found at index: ${prev.index}`,
      );
  }
  return scopes;
};

const pipeline = [evalPref, evalParagraph, evalDelimeters];

const preProcess = (src) => src.replace(/\n{3,}/g, '\n\n');

const parse = (src) => {
  const processed = preProcess(src);
  const tokens = tokenize(processed);
  const res = createTokensList();
  pipeline.reduce((acc, fn) => fn(res, acc), [tokens]);
  return { tokens: res, processed };
};

module.exports = {
  Token,
  parse,
  tokenize,
  evalParagraph,
  evalDelimeters,
  evalPrefScope,
};
