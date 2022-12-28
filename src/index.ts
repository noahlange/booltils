// prettier-ignore
export enum Op {
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

export type Condition = [string, string, number];

export default function condeval(conditions: Condition[]): boolean {
  let res = true;
  for (const [a, b, op] of conditions) {
    let val = false;
    // mathematical operators
    if ((op & Op.EQ) === Op.EQ && a == b) val = true;
    if ((op & Op.LT) === Op.LT && a < b) val = true;
    if ((op & Op.GT) === Op.GT && a > b) val = true;
    if ((op & Op.NE) === Op.NE && a != b) val = true;
    // boolean operators
    if ((op & Op.OR) === Op.OR) res = res || val;
    if ((op & Op.NOR) === Op.NOR) res = !res && !val;
    if ((op & Op.XOR) === Op.XOR) res = res !== val;
    if ((op & Op.AND) === Op.AND) res = res && val;
  }
  return res;
}
