'use strict';

class SortedList extends Array {
  #strategy;

  constructor(strategy) {
    super();
    this.#strategy = strategy;
  }

  push(...values) {
    for (const value of values) {
      const index = this.findIndex((item) => this.#strategy(value, item));
      if (index === -1) super.push(value);
      else super.splice(index, 0, value);
    }
    return this.length;
  }

  clone() {
    const list = new SortedList(this.#strategy);
    return list;
  }
}

const find = (arr, strategy, skip = 0) => {
  for (let i = skip; i < arr.length; i++) {
    const item = arr[i];
    if (strategy(item)) return [item, i];
  }
  return [undefined, -1];
};

const splitArray = (arr, ...indexes) => {
  const res = [];
  let start = 0;
  for (let i = 0; i <= indexes.length; i++) {
    const end = indexes[i] ?? arr.length;
    const slice = arr.slice(start, end);
    res.push(slice);
    start = end + 1;
  }
  return res;
};

const toggle = (i) => (i ? 0 : 1);

module.exports = {
  SortedList,
  find,
  splitArray,
  toggle,
};
