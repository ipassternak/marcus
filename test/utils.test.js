'use strict';

const { SortedList, find, splitArray } = require('../lib/core/utils.js');

describe('sorted list', () => {
  const list = new SortedList((a, b) => a < b);
  const items = [4, 2, 1, 3, 5];
  list.push(...items);
  test('sorts items correctly', () => {
    expect(items.sort((a, b) => a - b)).toEqual(list);
  });
});

describe('find', () => {
  const items = [
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
    { id: 4, value: 3 },
  ];
  const strat = ({ value }) => value === 3;
  test('finds the correct element', () => {
    const [item1, index1] = find(items, strat);
    const [item2, index2] = find(items, strat, index1 + 1);
    expect(item1.value).toBe(3);
    expect(index1).toBe(2);
    expect(item2.value).toBe(3);
    expect(index2).toBe(3);
  });
  test('returns [undefined, -1] if item not found', () => {
    expect(find(items, ({ value }) => value === 4)).toEqual([undefined, -1]);
  });
});

describe('split array', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8];
  test('splits array correctly', () => {
    const [left, middle, right] = splitArray(items, 2, 5);
    expect(left).toEqual([1, 2]);
    expect(middle).toEqual([4, 5]);
    expect(right).toEqual([7, 8]);
  });
});
