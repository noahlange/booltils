# Booltils

## Conditions

An _expression_ is a tuple of three values – `[number, number, number`] – where the first two values represent arbitrary numeric values and the third number (the operator) is an eight-bit integer.

The smallest three digits determine the mathematical operator for the condition.

| Operator |     Value      |
| :------: | :------------: |
|    =     | `0b000_00_001` |
|    ≠     | `0b000_00_110` |
|    <     | `0b000_00_010` |
|    >     | `0b000_00_100` |
|    ≤     | `0b000_00_011` |
|    ≥     | `0b000_00_101` |

The next two digits dictate the boolean operator used to link the previous and current expressions — defaulting to `AND`.

| Operator |     Value      |
| :------: | :------------: |
|   AND    | `0b000_00_000` |
|    OR    | `0b000_01_000` |
|   XOR    | `0b000_10_000` |
|   NOR    | `0b000_11_000` |

The last three are unused/reserved for future features.

## Example

The condition's operator is equal to the intersection (`|`) of the relevant mathematical and boolean operators.

```ts
import { evaluate, Op } from "booltils/conditions";

const conditions = [
  [1, 2, Op.LT], //     1 < 2
  [1, 2, Op.LT | Op.EQ], // AND 1 ≤ 2
  [1, 2, Op.EQ | Op.XOR], // XOR 1 = 2
  [2, 1, Op.GT | Op.OR], //  OR 2 ≥ 1
  [2, 2, Op.NE | Op.NOR], // NOR 2 ≠ 2
];

evaluate(conditions); // true
JSON.stringify(conditions); // [[2,3,18]]
```
