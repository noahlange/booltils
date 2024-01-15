import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

import { Condition, evaluate, getOperator, Operator as Op } from "./conditions";

const { LT, LTE, GT, EQ, NE } = Op;

const e = (condition: Condition) => evaluate([condition]);

describe("binary operators", () => {
  it("LT, GT, EQ, NE", () => {
    strictEqual(e([2, 1, LT]), false);
    strictEqual(e([2, 1, GT]), true);
    strictEqual(e([2, 1, EQ]), false);
    strictEqual(e([2, 1, NE]), true);
  });
});

describe("union operators", () => {
  it("LT | GT = NE", () => {
    strictEqual(e([2, 2, NE]), e([2, 2, GT | LT]));
  });

  it("LT | EQ = LTE", () => {
    strictEqual(e([3, 1, LT | EQ]), e([3, 1, LTE]));
    strictEqual(e([2, 3, LT | EQ]), e([2, 3, LTE]));
    strictEqual(e([3, 3, LT | EQ]), e([3, 3, LTE]));
  });
});

describe("getOperator()", () => {
  it("LT | GT = NE", () => {
    strictEqual(getOperator(LT, GT), NE);
  });
});
