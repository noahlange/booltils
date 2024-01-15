## Recipe: Subwriter

Can be used alongside [`subwriter`](https://github.com/noahlange/subwriter) to interpolate variables, &c., while still permitting plaintext serialization.

```ts
import _ from "subwriter";
import evaluate, { Op } from "booltils";

const filters = {
  "-": (str, val) => str - val,
  "+": (str, val) => str + val,
};

const data = { abc: 1, def: 2 };

const items = [
  [3, 4, Op.LT],
  ["{abc|-=1}", "{def|-=2}", Op.EQ | Op.XOR],
];

const map = ([a, b, op]) => [_(a, data, filters), _(b, data, filters), op];

evaluate(Array.from(items, map)); // false

JSON.stringify(items); // [["{abc}","{def}",2],["{abc|-=1}","{def|-=2}",17]]
```
