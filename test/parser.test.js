'use strict';

const { TYPES, FLANKS } = require('../lib/core/constants.js');
const {
  Token,
  createTokensList,
  tokenize,
  sanitize,
  evalPreformatted,
  evalParagraph,
  evalDelimeters,
  parse,
} = require('../lib/core/parser.js');

const compareTokens = (tokens, expected) => {
  expect(tokens.length).toBe(expected.length);
  for (let i = 0; i < tokens.length; i++) {
    const e = expected[i];
    const t = tokens[i];
    expect(t).toBeInstanceOf(Token);
    expect(t.index).toBe(e.index);
    expect(t.type).toBe(e.type);
    expect(t.leftFlanked).toBe(e.leftFlanked);
    expect(t.rightFlanked).toBe(e.rightFlanked);
  }
};

const testTokenize = (label, src, expected) => {
  const tokens = tokenize(src);
  // eslint-disable-next-line jest/expect-expect
  test(`${label}`, () => {
    compareTokens(tokens, expected);
  });
};

describe('sanitization', () => {
  const raw = '  foo \n\nbar\n\n\n baz ';
  const sanitized = 'foo \n\nbar\n\n baz';
  test('should remove leading and trailing whitespaces', () => {
    expect(sanitize(raw)).toBe(sanitized);
  });
});

describe('tokenization', () => {
  // unpaired tokens
  testTokenize('can tokenize left italic', '_italic', [
    new Token(0, TYPES.ITALIC, FLANKS.LEFT),
  ]);
  testTokenize('can tokenize right italic', 'italic_', [
    new Token(6, TYPES.ITALIC, FLANKS.RIGHT),
  ]);
  testTokenize('can tokenize left bold', '**bold', [
    new Token(0, TYPES.BOLD, FLANKS.LEFT),
  ]);
  testTokenize('can tokenize right bold', 'bold**', [
    new Token(4, TYPES.BOLD, FLANKS.RIGHT),
  ]);
  testTokenize('can tokenize left monospaced', '`monospaced', [
    new Token(0, TYPES.MONOSPACED, FLANKS.LEFT),
  ]);
  testTokenize('can tokenize right monospaced', 'monospaced`', [
    new Token(10, TYPES.MONOSPACED, FLANKS.RIGHT),
  ]);
  testTokenize('can tokenize unpaired preformatted', '```preformatted', [
    new Token(0, TYPES.PREFORMATTED),
  ]);
  // paired tokens
  testTokenize('can tokenize italic', '_italic_', [
    new Token(0, TYPES.ITALIC, FLANKS.LEFT),
    new Token(7, TYPES.ITALIC, FLANKS.RIGHT),
  ]);
  testTokenize('can tokenize bold', '**bold**', [
    new Token(0, TYPES.BOLD, FLANKS.LEFT),
    new Token(6, TYPES.BOLD, FLANKS.RIGHT),
  ]);
  testTokenize('can tokenize monospaced', '`monospaced`', [
    new Token(0, TYPES.MONOSPACED, FLANKS.LEFT),
    new Token(11, TYPES.MONOSPACED, FLANKS.RIGHT),
  ]);
  testTokenize('can tokenize preformatted', '```preformatted```', [
    new Token(0, TYPES.PREFORMATTED),
    new Token(15, TYPES.PREFORMATTED),
  ]);
  testTokenize('can tokenize paragraph', '\n\nparagraph\n\n', [
    new Token(0, TYPES.PARAGRAPH),
    new Token(11, TYPES.PARAGRAPH),
  ]);
  // both left and right flanked
  testTokenize('can tokenize both left and right bold', 'left.**.right', [
    new Token(5, TYPES.BOLD, FLANKS.LEFT, FLANKS.RIGHT),
  ]);
  testTokenize('can tokenize both left and right italic', 'left._.right', [
    new Token(5, TYPES.ITALIC, FLANKS.LEFT, FLANKS.RIGHT),
  ]);
  testTokenize('can tokenize both left and right monospaced', 'left.`.right', [
    new Token(5, TYPES.MONOSPACED, FLANKS.LEFT, FLANKS.RIGHT),
  ]);
  // nested tokens
  testTokenize('can tokenize nested markdown', '`_**nested**_`', [
    new Token(0, TYPES.MONOSPACED, FLANKS.LEFT),
    new Token(1, TYPES.ITALIC, FLANKS.LEFT, FLANKS.RIGHT),
    new Token(2, TYPES.BOLD, FLANKS.LEFT),
    new Token(10, TYPES.BOLD, FLANKS.RIGHT),
    new Token(12, TYPES.ITALIC, FLANKS.RIGHT, FLANKS.LEFT),
    new Token(13, TYPES.MONOSPACED, FLANKS.RIGHT),
  ]);
  // non tokens
  testTokenize('does not tokenize non italic', '____ snake_case ____', []);
  testTokenize('does not tokenize non bold', '2 ** 2 = 4, 2**2=4', []);
  testTokenize('does not tokenize non monospaced', '`` Janne d`Arc ``', []);
});

describe('preformatted evaluation', () => {
  {
    const bold = new Token(0, TYPES.BOLD, FLANKS.LEFT);
    const paragraph = new Token(20, TYPES.PARAGRAPH);
    const scope = [
      bold,
      new Token(2, TYPES.PREFORMATTED),
      new Token(10, TYPES.ITALIC, FLANKS.LEFT),
      new Token(13, TYPES.ITALIC, FLANKS.RIGHT),
      new Token(15, TYPES.PREFORMATTED),
      paragraph,
    ];
    const res = createTokensList();
    const s = evalPreformatted(res, [scope]);
    test('should eval correct result', () => {
      expect(res.length).toEqual(2);
      expect(res[0].type).toBe(TYPES.PREFORMATTED);
      expect(res[1].type).toBe(TYPES.PREFORMATTED);
    });
    test('should return the correct scopes', () => {
      expect(s.length).toEqual(2);
      expect(s[0].length).toEqual(1);
      expect(s[0][0]).toBe(bold);
      expect(s[1].length).toEqual(1);
      expect(s[1][0]).toBe(paragraph);
    });
  }
  {
    const scope = [new Token(0, TYPES.PREFORMATTED)];
    test('should throw unpaired error', () => {
      expect(() => evalPreformatted(createTokensList(), [scope])).toThrow(
        'unpaired preformatted token found at index: 0',
      );
    });
  }
});

describe('paragraph evaluation', () => {
  const scopes = [
    [
      new Token(3, TYPES.MONOSPACED, FLANKS.LEFT),
      new Token(6, TYPES.MONOSPACED, FLANKS.RIGHT),
      new Token(9, TYPES.PARAGRAPH),
      new Token(10, TYPES.ITALIC, FLANKS.LEFT),
      new Token(13, TYPES.ITALIC, FLANKS.RIGHT),
    ],
    [
      new Token(20, TYPES.PARAGRAPH),
      new Token(22, TYPES.BOLD, FLANKS.LEFT),
      new Token(25, TYPES.BOLD, FLANKS.RIGHT),
    ],
  ];
  const res = createTokensList();
  const s = evalParagraph(res, scopes);
  test('should eval correct result', () => {
    expect(res.length).toEqual(2);
    expect(res[0].type).toBe(TYPES.PARAGRAPH);
    expect(res[0].index).toBe(9);
    expect(res[1].type).toBe(TYPES.PARAGRAPH);
    expect(res[1].index).toBe(20);
  });
  test('should return the correct scopes', () => {
    expect(s.length).toEqual(4);
    expect(s[0].length).toEqual(2);
    s[0].forEach((token) => expect(token.type).toBe(TYPES.MONOSPACED));
    expect(s[1].length).toEqual(2);
    s[1].forEach((token) => expect(token.type).toBe(TYPES.ITALIC));
    expect(s[2].length).toEqual(0);
    expect(s[3].length).toEqual(2);
    s[3].forEach((token) => expect(token.type).toBe(TYPES.BOLD));
  });
});

describe('delimeters evaluation', () => {
  {
    const scopes = [
      [
        new Token(3, TYPES.MONOSPACED, FLANKS.LEFT),
        new Token(6, TYPES.MONOSPACED, FLANKS.RIGHT),
        new Token(10, TYPES.ITALIC, FLANKS.LEFT),
        new Token(13, TYPES.ITALIC, FLANKS.RIGHT),
      ],
      [
        new Token(22, TYPES.BOLD, FLANKS.LEFT),
        new Token(25, TYPES.BOLD, FLANKS.RIGHT),
      ],
    ];
    const res = createTokensList();
    evalDelimeters(res, scopes);
    // eslint-disable-next-line jest/expect-expect
    test('should eval correct result', () => {
      compareTokens(res, scopes.flat());
    });
  }
  {
    const scopes = [
      [
        new Token(3, TYPES.MONOSPACED, FLANKS.LEFT),
        new Token(6, TYPES.MONOSPACED, FLANKS.RIGHT),
        new Token(10, TYPES.ITALIC, FLANKS.LEFT),
        new Token(13, TYPES.ITALIC, FLANKS.RIGHT),
      ],
      [new Token(22, TYPES.BOLD, FLANKS.LEFT)],
    ];
    test('should throw unpaired error', () => {
      expect(() => evalDelimeters(createTokensList(), scopes)).toThrow(
        'unpaired bold token found at index: 22',
      );
    });
  }
  {
    const scope = [
      new Token(3, TYPES.ITALIC, FLANKS.LEFT),
      new Token(6, TYPES.MONOSPACED, FLANKS.LEFT),
      new Token(10, TYPES.MONOSPACED, FLANKS.RIGHT),
      new Token(13, TYPES.ITALIC, FLANKS.RIGHT),
    ];
    test('should throw nested error', () => {
      expect(() => evalDelimeters(createTokensList(), [scope])).toThrow(
        'nested monospaced token found at index: 10',
      );
    });
  }
});

describe('parsing', () => {
  const src = 'foo _italic_ **bold** `monospaced` \n\n ```preformatted```';
  const { tokens } = parse(src);
  // eslint-disable-next-line jest/expect-expect
  test('should parse src correctly', () => {
    compareTokens(tokens, [
      new Token(4, TYPES.ITALIC, FLANKS.LEFT),
      new Token(11, TYPES.ITALIC, FLANKS.RIGHT),
      new Token(13, TYPES.BOLD, FLANKS.LEFT),
      new Token(19, TYPES.BOLD, FLANKS.RIGHT),
      new Token(22, TYPES.MONOSPACED, FLANKS.LEFT),
      new Token(33, TYPES.MONOSPACED, FLANKS.RIGHT),
      new Token(35, TYPES.PARAGRAPH),
      new Token(38, TYPES.PREFORMATTED),
      new Token(53, TYPES.PREFORMATTED),
    ]);
  });
});
