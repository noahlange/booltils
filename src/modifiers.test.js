import { strictEqual } from 'node:assert';
import { describe, it } from 'node:test';

import { evaluate as e, Operator as Op } from '../lib/modifiers.js';

const mod = {
  set: {
    a: [[4, Op.SET]]
  },
  add: {
    a: [[1, Op.ADD]],
    b: [
      [1, Op.ADD],
      [2, Op.ADD]
    ]
  },
  mul: {
    a: [
      [1, Op.SET],
      [3, Op.MUL],
      [4, Op.MUL]
    ]
  }
};

describe('=', () => {
  it('0 = 4 = 4', () => strictEqual(4, e(mod.set.a)));
});

describe('+', () => {
  it('0 + 1 = 1', () => strictEqual(1, e(mod.add.a)));
  it('1 + 2 = 3', () => strictEqual(3, e(mod.add.b)));
});

describe('*', () => {
  it('3 * 4 = 12', () => strictEqual(12, e(mod.mul.a)));
});

describe('+*', () => {
  it('3 * 4 = 12', () => strictEqual(12, e(mod.mul.a)));
});
