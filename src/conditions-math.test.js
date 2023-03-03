import assert from 'node:assert';
import { describe, it } from 'node:test';

import { evaluate as e, Operator as Op } from '../lib/index.js';

const { LT, LTE, GT, EQ, NE, NOT } = Op;

const e = condition => evaluate([condition]);

describe('binary operators', () => {
  it('LT, GT, EQ, NE', () => {
    assert.strictEqual(e([2, 1, LT]), false);
    assert.strictEqual(e([2, 1, GT]), true);
    assert.strictEqual(e([2, 1, EQ]), false);
    assert.strictEqual(e([2, 1, NE]), true);
  });
});

describe('union operators', () => {
  it('LT | GT = NE', () => {
    assert.strictEqual(e([2, 2, NE]), e([2, 2, GT | LT]));
  });

  it('LT | EQ = LTE', () => {
    assert.strictEqual(e([3, 1, LT | EQ]), e([3, 1, LTE]));
    assert.strictEqual(e([2, 3, LT | EQ]), e([2, 3, LTE]));
    assert.strictEqual(e([3, 3, LT | EQ]), e([3, 3, LTE]));
  });
});
