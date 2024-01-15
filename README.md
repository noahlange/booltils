# booltils

> Condition and modifier evaluation supporting mathematical and boolean operators. Ideal for embedding complex conditional logic into JSON or other static text formats.

In implementation terms it's code to evaluate boolean expressions written in reverse Polish notation using an eight-bit integer and bitmasks for boolean/mathematical operators, though it's much less complicated than it sounds.

```ts
import { Operator, evaluate } from "booltils";

import { ClassID, interpolate } from "./data";

const { EQ, NE, LT, GT, AND, OR, XOR, NOR } = Operator;

const ctx = {
  target: { STR: 8, class_id: ClassID.BARBARIAN },
  item: { MIN_STR: 4 },
};

evaluate(
  interpolate(["target.STR", "item.MIN_STR", GT | EQ], ctx),
  interpolate(["target.class_id", ClassID.BARBARIAN, NE | XOR], ctx)
); // true
```

## ...but _why_?

Okay, here goes: say you'd like to write a virtual tabletop web application with support for user-created rulesets. Allowing people to execute arbitrary JS on your site is a Very Bad Idea, so we need an alternative way to handle things like formulae for equipment requirements.

Say we're working with something like D&D and we'd like to write a rule saying that you can only equip an item if your `STR` is above its `MIN_STR` value.

Yeah, you _could_ do something like this:

```json
{
  "myItem": {
    "requirements": [
      { "type": "target.STR", "operator": "gte", "value": "item.MIN_STR" },
      { "type": "target.class_id", "operator": "neq", "value": 2 }
    }
  }
}
```

It's great, so long as we're okay with `AND`. But say we want `XOR`, or `OR` instead? We'll quickly run into issues where this approach simply doesn't scale. Enter **booltils**, which helps you serialize these types of things succinctly without any verbose syntax or ambiguity. How?

## The Jist of It, Part I: Conditions

Long story short, [reverse Polish notation](https://en.wikipedia.org/wiki/Reverse_Polish_notation).

**booltils** exports an `Operation` enum that allows you to combine any number of arbitrary boolean operations into a single value. It comes preloaded with the usual suspects, but you can naturally create things like "≥" from `> | =`, "≠" from `> | <`, &c., yourself.

```ts
import { Operator } from "booltils";

const { EQ, NE, LT, GT, LTE, GTE, AND, OR, XOR, NOR } = Operator;

export default {
  myItem: {
    requirements: [
      ["target.STR", "item.MIN_STR", GTE],
      ["target.class_id", 2, NE | XOR],
    ],
  },
};
```

If the bitwise operator is a little esoteric or inexplicable for your tastes (no judging), there's also a `getOperator()` function that will combine them for you.

```ts
import { Operator, getOperator } from "booltils";

const { GT, EQ, GTE, OR } = Operator;

console.log((getOperator(GT, EQ, OR) == (GTE | OR)) == (GT | EQ | OR));
```

But then you're off to the races:

```js
import _ from "subwriter";
import { evaluate } from "booltils";

function applyValues<T extends {}>(ctx: T) {
  return (...args: Array<string | number>): number[] => {
      // coerce a subwriter expression into a number
    return args.map((value) => {
      return typeof value === "string" ? +_(value, ctx) : value;
    });
  };
}

const ruleset = await fetch("./my-ruleset.json")
  .then((res) => res.json())
  .then((res) => res.myItem);

const ctx = { target: { STR: 8 }, item: { MIN_STR: 6 } };

const isValid = evaluate(
  Array.from(ruleset.myItem.requirements, applyValues(ctx))
);
```

The downside of this approach: it's completely unintelligible to real-life human beings. So this project is predicated under the assumption that you have (or are willing to create) a tool to assemble at least some of this condition creation for you. (There are some suggestions for that in `/docs`.)
