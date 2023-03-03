// prettier-ignore
export enum Operator {
  EQ =  0b000_00_001,
  NE =  0b000_00_110,
  GT =  0b000_00_100,
  LT =  0b000_00_010,
  LTE = 0b000_00_011,
  GTE = 0b000_00_101,
  AND = 0b000_00_000,
  OR =  0b000_01_000,
  XOR = 0b000_10_000,
  NOR = 0b000_11_000
}

export type Condition = [string, string, number, ...unknown[]];

export function evaluate(conditions: Condition[]): boolean {
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
