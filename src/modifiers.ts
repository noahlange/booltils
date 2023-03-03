export enum Op {
  SET = 0b00,
  ADD = 0b01,
  MUL = 0b10,
  ADD_MUL = 0b11,
}

export type Modifier = [
  a: number,
  b: number,
  operator: number,
  ...rest: unknown[]
];

export function evaluate(modifiers: Modifier[], start: number = 0): number {
  let res = start;
  for (let [value, op] of modifiers) {
    let tmp = value;
    if ((op & Op.MUL) === Op.MUL) tmp *= res;
    if ((op & Op.ADD) === Op.ADD) tmp += res;
    res = tmp;
  }
  return res;
}
