# condeval

Condition evaluation supporting mathematical and boolean operators. Ideal for embedding complex conditional logic into JSON or other static text formats.

```ts
import evaluate, { Op } from "condeval";

const conditions = [
  // value, comparison, operator(s)
  [1, 2, Op.LT | Op.XOR],
];

evaluate(conditions); // true
JSON.stringify(conditions); // [[2,3,18]]
```

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
