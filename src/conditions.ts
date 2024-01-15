/**
 * First three bits are for value comparison (>, <, =).
 * Last two bits are for boolean operations (AND/OR/XOR/NOR).
 */
// prettier-ignore
export enum Operator {
  EQ =  0b00_001,
  LT =  0b00_010,
  GT =  0b00_100,
  // these can be composed from the previous three operators.
  NE =  0b00_110,
  LTE = 0b00_011,
  GTE = 0b00_101,
  AND = 0b00_000,
  // this may the opposite of what you might expect.
  OR =  0b01_000,
  XOR = 0b10_000,
  NOR = 0b11_000
}

export type Condition = [number, number, number, ...unknown[]];

/**
 * Helper function for composing operators
 */
export function getOperator(...parts: Operator[]) {
  return parts.reduce((a, b) => a | b, 0);
}

export function evaluate(conditions: Condition[]): boolean {
  // we're ANDing by default — an empty list of conditions should evaluate to true.
  let res = true;
  for (const [a, b, op] of conditions) {
    let val = false;
    // mathematical operators
    if ((op & Operator.EQ) === Operator.EQ && a == b) val = true;
    if ((op & Operator.LT) === Operator.LT && a < b) val = true;
    if ((op & Operator.GT) === Operator.GT && a > b) val = true;
    if ((op & Operator.NE) === Operator.NE && a != b) val = true;
    // boolean operators
    if ((op & Operator.OR) === Operator.OR) res = res || val;
    if ((op & Operator.NOR) === Operator.NOR) res = !res && !val;
    if ((op & Operator.XOR) === Operator.XOR) res = res !== val;
    if ((op & Operator.AND) === Operator.AND) res = res && val;
  }
  return res;
}
