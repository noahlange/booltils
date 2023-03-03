## Recipe: modifiers in user interfaces

It's worth noting that resulting representation is _not_ human-readable. It
should be assembled using some sort of UI. The following options/values/change
handlers (JSX) should be enough to get you started.

```tsx
import { evaluate, Operator } from 'booltils/modifiers';

const options = [
  { label: '=', value: Operator.SET },
  { label: '+', value: Operator.ADD },
  { label: '×', value: Operator.MUL },
  { label: '+×', value: Operator.ADD | Operator.MUL }
];

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'CREATE_MOD': {
      state.items.push([0, Operator.SET]);
      return state;
    }
    case 'REMOVE_MOD': {
      state.items.splice(payload.i, 1);
      return state;
    }
    case 'CHANGE_VAL': {
      const item = state.items[payload.i];
      state.items.splice(payload.i, 1, [payload.value, item[1]]);
      return state;
    }
    case 'CHANGE_MOD': {
      const item = state.items[payload.i];
      state.items.splice(payload.i, 1, [item[0], payload.value]);
      return state;
    }
  }
  return state;
};

function MyInput(props: { value: number }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  const handle = {
    onCreate: () => dispatch({ type: 'CREATE_MOD' }),
    onRemove: (i: number) => () =>
      dispatch({ type: 'REMOVE_MOD', payload: { i } }),
    onValueChange: (i: number, e: ChangeEvent) =>
      dispatch({ type: 'CHANGE_VAL', payload: { i, value: e.target.value } }),
    onOperatorChange: (i: number, e: ChangeEvent) =>
      dispatch({ type: 'CHANGE_MOD', payload: { i, value: e.target.value } })
  };

  return (
    <div>
      <button type="button" onClick={handle.onCreate}>
        Add Modifier Step
      </button>
      {state.items.map(([val, mod], i) => (
        <div key={i}>
          <input
            type="number"
            value={val}
            onChange={e => handle.onValueChange(i, e)}
          />
          <select onChange={e => handle.onOperatorChange(i, e)} value={mod}>
            {options.map(o => (
              <option value={o.value}>{o.label}</option>
            ))}
          </select>
          <button type="button" onClick={handle.onRemove(i)} />
        </div>
      ))}
      <div>{evaluate(state.items, props.value)}</div>
    </div>
  );
}
```
