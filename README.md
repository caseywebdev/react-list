# ReactList

A versatile infinite scroll [React] component.

## Install

```bash
bower install react-list

# or

npm install react-list
```

ReactList depends on React.

## Examples

Check out [the example page] and the [the example page source] for examples of
different configurations.

Here's another simple example to get you started.

```js
import loadAccount from 'my-account-loader';
import React from 'react';
import ReactList from 'react-list';

class MyComponent extends React.Component {
  state = {
    accounts: []
  };

  componentWillMount() {
    loadAccounts(::this.handleAccounts);
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
        <div style={{overflow: 'auto', maxHeight: 400}}>
          <ReactList
            itemRenderer={::this.renderItem}
            length={this.state.accounts.length}
            type='uniform'
          />
        </div>
      </div>
    );
  }
}
```

## Props

##### axis (defaults to `y`)

The axis that this list scrolls on.

##### initialIndex

An index to scroll to after mounting.

##### itemSizeGetter(index)

A function that receives an item index and returns the size (height for y-axis
lists and width for x-axis lists) of that item at that index.

##### itemRenderer(index, key)

A function that receives an index and a key and returns the content to be
rendered for the item at that index.

##### itemsRenderer(items, ref)

A function that receives the rendered items and a ref. By default this element
is just a `<div>`. Generally it only needs to be overridden for use in a
`<table>` or other special case. **NOTE: You must set ref={ref} on the component
that contains the `items` so the correct item sizing calculations can be made.**

##### length (defaults to `0`)

The number of items in the list.

##### pageSize (defaults to `10`)

The number of items to batch up for new renders.

##### threshold (defaults to `100`)

The number of pixels to buffer at the beginning and end of the rendered list
items.

##### type (one of `simple`, `variable`, or `uniform`, defaults to `simple`)

- `simple` This type is...simple. It will not cache item sizes or remove items
that are above the viewport. This type is sufficient for many cases when the
only requirement is incremental rendering when scrolling.

- `variable` This type is preferred when the sizes of the items in the list
vary. Supply the `itemSizeGetter` when possible so the entire length of the
list can be established beforehand. Otherwise, the item sizes will be cached
as they are rendered so that items that are above the viewport can be removed as
the list is scrolled.

- `uniform` This type is preferred when you can guarantee all of your
elements will be the same size. The advantage here is that the size of the
entire list can be calculated ahead of time and only enough items to fill the
viewport ever need to be drawn. The size of the first item will be used to
infer the size of every other item. Multiple items per row are also supported
with this type.

##### useTranslate3d (defaults to `false`)

A boolean to determine whether the `translate3d` CSS property should be used for
positioning instead of the default `translate`. This can help performance on
mobile devices, but is supported by fewer browsers.

## Methods

##### scrollTo(index)

Put the element at `index` at the top of the viewport. Note that if you aren't
using `type='uniform'` or an `itemSizeGetter`, you will only be able to scroll
to an element that has already been rendered.

##### scrollAround(index)

Scroll the viewport so that the element at `index` is visible, but not
necessarily at the top. The `scrollTo` note above also applies to this method.

## Troubleshooting

This is a place to share common problems and solutions to them.  

#### I have a stack overflow with type=`uniform`

This is probably because the items you are rendering don't have a fixed height.
react-list will end up in an unstable state. He will call `setState` to display the correct items.
which will trigger `componentDidUpdate`, which will trigger `setState` and so on.

To fix it
 - either set an height to item your render `<div style={{height: 100}} />`
 - or use a different `type`

## Development

```bash
open index.html
make
```

[React]: https://github.com/facebook/react
[the example page]: https://orgsync.github.io/react-list/
[the example page source]: examples/index.es6
