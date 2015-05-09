# react-list

A versatile infinite scroll [React] component.

## Install

```bash
bower install react-list

# or

npm install react-list
```

`react-list` depends on React **with addons**. `react-list` leverages the
[PureRenderMixin] to make updates more efficient.

## Examples

Check out [the test page] (and the [the test page source]) for examples of both
the `List` and `UniformList` components in action.

Here's another simple example to get you started.

```js
import React from 'react';
import {UniformList} from 'react-list';
import loadAccount from 'my-account-loader';

class MyComponent extends React.Component {
  state = {
    accounts: []
  };

  componentWillMount() {
    loadAccounts(this.handleAccounts.bind(this));
  }

  handleAccounts(accounts) {
    this.setState({accounts});
  }

  renderItem(index, key) {
    return <div key={key}>{this.state.accounts[index].name}</div>;
  }

  render() {
    return (
      <div>
        <h1>Accounts</h1>
        <div
          style={{
            position: 'relative',
            overflow: 'auto',
            maxHeight: 400
          }}
        >
          <UniformList
            itemRenderer={this.renderItem}
            length={this.state.accounts.length}
          />
        </div>
      </div>
    );
  }
}
```

## API

### `reactList.List`

The `List` component is best used when rendering items of variable heights. This
component will only attempt to draw elements once they are above the fold or
near it.

#### Props

##### initialIndex

Optionally specify an index to scroll to after mounting. For the `UniformList`,
this can be any index less than `length`. For the variable height `List`,
however, this value must be less than `pageSize`.

##### itemRenderer(index, key)

A function that receives an index and a key and returns the content to be
rendered for the item at that index.

##### itemsRenderer(items, ref)

A function that receives the rendered items and a ref. By default this element
is just a `<div>`. Generally it only needs to be overriden for use in a
`<table>` or other special case. **NOTE: You must set ref={ref} on the component
that contains the `items` so the correct item sizing calculations can be made.**

##### length

The number of items in the list.

##### pageSize (defaults to `10`)

The number of items to batch up for new renders.

##### threshold (defaults to `500`)

The number of pixels to ensure the list is buffered with.

#### Methods

##### scrollTo(index)

Put the element at `index` at the top of the viewport. **NOTE: Unlike with the
UniformList, you can only scroll to elements that have been rendered.**

---

### `reactList.UniformList`

The `UniformList` component is preferred when you can guarantee all of your
elements will be the same height. The advantage here is that the height of the
entire list can be calculated ahead of time and only enough items to fill the
viewport ever need to be drawn.

`UniformList` has the same properties as `List`, but `pageSize` is calculated
automatically. It also supports two more optional properties.

#### Props

##### itemHeight (defaults to automatic calculation)

While not necessary, providing the exact rendered height of each item can
improve performance. If not provided, the height of the first rendered element
will be used to assume the height of all items.

##### itemsPerRow (defaults to automatic calculation)

Similar to `itemHeight`, providing the number of items that render per row of
items (columns) can improve performance. This is also not required and if not
provided will be calculated by counting the number of rendered items in the
first row.

**NOTE: `itemHeight` and `itemsPerRow` should always both be defined or both not
be defined. If one is defined but not the other, the automatic calculation will
take over.**

#### Methods

##### scrollTo(index)

Put the element at `index` at the top of the viewport.

##### scrollAround(index)

Scroll the viewport so that the element at `index` is visible.

[React]: https://github.com/facebook/react
[PureRenderMixin]: https://facebook.github.io/react/docs/pure-render-mixin.html
[the test page]: https://orgsync.github.io/react-list/
[the test page source]: index.html
