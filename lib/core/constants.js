'use strict';

const TYPES = {
  BOLD: 'bold',
  ITALIC: 'italic',
  MONOSPACED: 'monospaced',
  PREFORMATTED: 'preformatted',
  PARAGRAPH: 'paragraph',
};

const FLANKS = {
  LEFT: 'left',
  RIGHT: 'right',
};

const DELIMETERS = [TYPES.BOLD, TYPES.ITALIC, TYPES.MONOSPACED];

const PATTERNS = [
  /* eslint-disable max-len */
  {
    type: TYPES.BOLD,
    rx: {
      left: /(?<=\p{Z}|^)\*{2}(?![\p{Z}\p{P}`])|(?<=[\p{Z}\p{P}`]|^)\*{2}(?=\p{L}|\p{N}|[^\P{P}*]|`)/,
      right:
        /(?<![\p{Z}\p{P}`]|^)\*{2}(?=\p{Z}|$)|(?<=\p{L}|\p{N}|[^\P{P}*]|`)\*{2}(?=[\p{Z}\p{P}`]|$)/,
    },
  },
  {
    type: TYPES.ITALIC,
    rx: {
      left: /(?<=\p{Z}|^)_(?![\p{Z}\p{P}`])|(?<=[\p{Z}\p{P}`]|^)_(?=\p{L}|\p{N}|[^\P{P}_]|`)/,
      right:
        /(?<![\p{Z}\p{P}`]|^)_(?=\p{Z}|$)|(?<=\p{L}|\p{N}|[^\P{P}_]|`)_(?=[\p{Z}\p{P}`]|$)/,
    },
  },
  {
    type: TYPES.MONOSPACED,
    rx: {
      left: /(?<=\p{Z}|^)`(?![\p{Z}\p{P}`])|(?<=[\p{Z}\p{P}]|^)`(?=[\p{P}\p{L}\p{N}])/,
      right:
        /(?<![\p{Z}\p{P}`]|^)`(?=\p{Z}|$)|(?<=[\p{P}\p{L}\p{N}])`(?=[\p{Z}\p{P}]|$)/,
    },
  },
  /* eslint-enable max-len */
  {
    type: TYPES.PREFORMATTED,
    rx: /`{3}/,
  },
  {
    type: TYPES.PARAGRAPH,
    rx: /\n{2}/,
  },
];

const MARKING = {
  [TYPES.BOLD]: '**',
  [TYPES.ITALIC]: '_',
  [TYPES.MONOSPACED]: '`',
  [TYPES.PREFORMATTED]: '```',
  [TYPES.PARAGRAPH]: '\n\n',
};

const HTML_MAP = {
  [TYPES.BOLD]: ['<strong>', '</strong>'],
  [TYPES.ITALIC]: ['<i>', '</i>'],
  [TYPES.MONOSPACED]: ['<tt>', '</tt>'],
  [TYPES.PARAGRAPH]: ['</p><p>', '</p><p>', '<p>', '</p>'],
  [TYPES.PREFORMATTED]: ['<pre>', '</pre>'],
};

const ANSI_MAP = {
  [TYPES.BOLD]: ['\u001b[1m', '\u001b[22m'],
  [TYPES.ITALIC]: ['\u001b[3m', '\u001b[23m'],
  [TYPES.MONOSPACED]: ['\u001b[7m', '\u001b[27m'],
  [TYPES.PARAGRAPH]: ['\n\n', '\n\n', '', ''],
  [TYPES.PREFORMATTED]: ['\u001b[7m', '\u001b[27m'],
};

module.exports = {
  TYPES,
  FLANKS,
  DELIMETERS,
  PATTERNS,
  MARKING,
  HTML_MAP,
  ANSI_MAP,
};
