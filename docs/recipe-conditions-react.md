## Recipe: conditions in user interfaces

It's worth noting that resulting representation is _not_ human-readable. It
should be assembled using some sort of UI. The following options/values/change
handlers (JSX) should be enough to get you started.

```tsx
import { evaluate, Operator } from 'booltils/conditions';

const options = {
  math: [
    { label: '=', value: Operator.EQ },
    { label: '≠', value: Operator.NE },
    { label: '>', value: Operator.GT },
    { label: '<', value: Operator.LT },
    { label: '≥', value: Operator.GTE },
    { label: '≤', value: Operator.LTE }
  ],
  bool: [
    { label: 'AND', value: Operator.AND },
    { label: 'OR',  value: Operator.OR },
    { label: 'XOR', value: Operator.XOR },
    { label: 'NOR', value: Operator.NOR }
  ]
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'CREATE_COND': {
      state.items.push([0, Operator.SET]);
      return state;
    }
    case 'REMOVE_COND': {
      state.items.splice(payload.i, 1);
      return state;
    }
    case 'CHANGE_VAL': {
      const item = state.items[payload.i];
      state.items.splice(payload.i, 1, [payload.value, item[1], item[2]]);
      return state;
    }
    case 'CHANGE_TO': {
      const item = state.items[payload.i];
      state.items.splice(payload.i, 1, [item[0], payload.value, item[2]]);
      return state;
    }
    case 'CHANGE_OP': {
      const item = state.items[payload.i];
      state.items.splice(payload.i, 1, [item[0], item[1], payload.value]);
      return state;
    }
  }
  return state;
};

function myInput() {

  const [value, setValue] = useState(0b000_00_000);

  const math = {
    value: value & 0b000_11_000,
    onChange: e => setValue(
      +e.target.value | (value & ^0b000_11_000)
    )
  };

  const bool = {
    value: value & 0b000_00_111,
    onChange: e => setValue(
      +e.target.value | (value & ^0b000_00_111)
    )
  };

  return (
    <>
      <select value={math.value} onChange={math.onChange}>
        {options.math.map(o => <option value={o.value}>{o.label}</option>)}
      </select>
      <select value={bool.value} onChange={bool.onChange}>
        {options.bool.map(o => <option value={o.value}>{o.label}</option>)}
      </select>
    </>
  );
}
```
