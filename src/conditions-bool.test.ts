import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

import { Condition, evaluate, Operator } from "./conditions";

const { GT, EQ, AND, LT, LTE, OR, XOR } = Operator;

const cond: Record<string, Record<string, Condition[]>> = {
  and: {
    tf: [
      [3, 2, LT | AND],
      [2, 3, LT | AND],
    ],
    tt: [
      [1, 2, LT | AND],
      [2, 3, LT | AND],
    ],
    ff: [
      [3, 2, LT | AND],
      [4, 3, LT | AND],
    ],
  },
  or: {
    tf: [
      [3, 2, LT | AND],
      [2, 3, LT | OR],
    ],
    tt: [
      [2, 3, LT | AND],
      [2, 3, LT | OR],
    ],
    ff: [
      [3, 2, LT | AND],
      [3, 2, LT | OR],
    ],
  },
  xor: {
    tt: [
      [3, 3, EQ],
      [4, 4, EQ | XOR],
    ],
    tf: [
      [3, 2, EQ],
      [4, 4, EQ | XOR],
    ],
    ff: [
      [3, 2, EQ],
      [4, 3, EQ | XOR],
    ],
  },
};

describe("basic boolean operators: AND", () => {
  it("false && true", () => strictEqual(evaluate(cond.and.tf), false));
  it("true && true", () => strictEqual(evaluate(cond.and.tt), true));
  it("false && false", () => strictEqual(evaluate(cond.and.ff), false));
});

describe("basic boolean operators: OR", () => {
  it("false || true", () => strictEqual(evaluate(cond.or.tf), true));
  it("false || false", () => strictEqual(evaluate(cond.or.ff), false));
  it("true || true", () => strictEqual(evaluate(cond.or.tt), true));
});

describe("basic boolean operators: XOR", () => {
  it("true || true", () => strictEqual(evaluate(cond.xor.tt), false));
  it("true || false", () => strictEqual(evaluate(cond.xor.tf), true));
  it("false || false", () => strictEqual(evaluate(cond.xor.ff), false));
});

describe("mixed operators", () => {
  it("AND/OR/XOR", () => {
    strictEqual(
      evaluate([
        [3, 2, EQ | AND],
        [3, 2, GT | OR],
        [4, 4, EQ | XOR],
      ]),
      false
    );
  });
});
