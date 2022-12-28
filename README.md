# condeval

Condition evaluation supporting mathematical and boolean operators. Ideal for embedding complex conditional logic into JSON or other static text formats.

A _condition_ is a tuple of three values – `[string, string, number`] –where the number (the operator) is an eight-bit integer.

The smallest three digits dictate the mathematical operator for the condition.

| Operator |     Value      |
| :------: | :------------: |
|    =     | `0b000_00_001` |
|    ≠    | `0b000_00_110` |
|    <     | `0b000_00_010` |
|    >     | `0b000_00_100` |
|    ≤    | `0b000_00_011` |
|    ≥    | `0b000_00_101` |

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
import evaluate, { Op } from "condeval";

const conditions = [
  [1, 2, Op.LT],            //     1 < 2
  [1, 2, Op.LT | Op.EQ],    // AND 1 ≤ 2
  [1, 2, Op.EQ | Op.XOR],   // XOR 1 = 2
  [2, 1, Op.GT | Op.OR],    //  OR 2 ≥ 1
  [2, 2, Op.NE | Op.NOR]    // NOR 2 ≠ 2
];

evaluate(conditions);       // true
JSON.stringify(conditions); // [[2,3,18]]
```

## `condeval` in user interfaces

It's worth noting that resulting representation is _not_ human-readable. It
should be assembled using some sort of UI. The following options/values/change
handlers (JSX) should be enough to get you started.

```tsx
const options = {
  math: [
    { label: '=', value: Op.EQ },
    { label: '≠', value: Op.NE },
    { label: '>', value: Op.GT },
    { label: '<', value: Op.LT },
    { label: '≥', value: Op.GTE },
    { label: '≤', value: Op.LTE }
  ],
  bool: [
    { label: 'AND', value: Op.AND },
    { label: 'OR', value: Op.OR },
    { label: 'XOR', value: Op.XOR },
    { label: 'NOR', value: Op.NOR }
  ]
};

const [value, setValue] = useState(0b000_00_000);

const props = {
  math: {
    value: value & 0b000_11_000,
    onChange: e => setValue(
      +e.target.value | (value & ^0b000_11_000)
    )
  },
  bool: {
    value: value & 0b000_00_111,
    onChange: e => setValue(
      +e.target.value | (value & ^0b000_00_111)
    )
  }
}

const inputs = (
  <>
    <select value={props.math.value} onChange={props.math.onChange}>
      {options.math.map(o => <option value={o.value}>{o.label}</option>)}
    </select>
    <select value={props.bool.value} onChange={props.bool.onChange}>
      {options.bool.map(o => <option value={o.value}>{o.label}</option>)}
    </select>
  </>
);
```

## Misc

Can be used alongside [`subwriter`](https://github.com/noahlange/subwriter) to interpolate variables, &c., while still permitting plaintext serialization.

```ts
import { sub } from "subwriter";
import evaluate, { Op } from "condeval";

const filters = {
  "-": (str, val) => str - val,
  "+": (str, val) => str + val,
};

const data = { abc: 1, def: 2 };

const items = [
  [3, 4, Op.LT],
  ["{abc|-=1}", "{def|-=2}", Op.EQ | Op.XOR],
];

const map = ([a, b, op]) => [sub(a, data, filters), sub(b, data, filters), op];

evaluate(Array.from(items, map)); // false

JSON.stringify(items); // [["{abc}","{def}",2],["{abc|-=1}","{def|-=2}",17]]
```
