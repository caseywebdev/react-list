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

##### itemRenderer(index, key)

A function that receives an index and a key and returns the content to be
rendered for the item at that index.

##### itemsRenderer(items, ref)

A function that receives the rendered items and a ref. By default this element
is just a `<div>`. Generally it only needs to be overridden for use in a
`<table>` or other special case. **NOTE: You must set ref={ref} on the component
that contains the `items` so the correct item sizing calculations can be made.**

##### itemSizeEstimator(index, cache)

A function that receives an item index and the cached known item sizes and
returns an estimated size (height for y-axis lists and width for x-axis lists)
of that item at that index. This prop is only used when the prop `type` is set
to `variable` and `itemSizeGetter` is not defined. Use this property when you
can't know the exact size of an item before rendering it, but want it to take up
space in the list regardless.

##### itemSizeGetter(index)

A function that receives an item index and returns the size (height for y-axis
lists and width for x-axis lists) of that item at that index. This prop is only
used when the prop `type` is set to `variable`.

##### length (defaults to `0`)

The number of items in the list.

##### minSize (defaults to `1`)

The minimum number of items to render at any given time. This can be used to
render some amount of items initially when rendering HTML on the server.

##### pageSize (defaults to `10`)

The number of items to batch up for new renders. Does not apply to `'uniform'`
lists as the optimal number of items is calculated automatically.

##### scrollParentGetter (defaults to finding the nearest scrollable parent)

A function that returns a DOM Element or Window that will be treated as the
scrolling container for the list. In most cases this does not need to be set for
the list to work as intended. It is exposed as a prop for more complicated uses
where the scrolling container may not initially have an overflow property that
enables scrolling.

##### scrollParentViewportSizeGetter (defaults to scrollParent's viewport size)

A function that returns the size of the scrollParent's viewport. Provide this
prop if you can efficiently determine your scrollParent's viewport size as it
can improve performance.

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

##### useStaticSize (defaults to `false`)

Set to `true` if the item size will never change (as a result of responsive
layout changing or otherwise). This prop is only used when the prop `type` is
set to `uniform`. This is an opt-in optimization that will cause the very first
element's size to be used for all elements for the duration of the component's
life.

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

##### getVisibleRange() => `[firstIndex, lastIndex]`

Return the indices of the first and last items that are at all visible in the
viewport.

## FAQ

##### What is "ReactList failed to reach a stable state."?

This happens when specifying the `uniform` type without actually providing
uniform size elements. The component attempts to draw only the minimum necessary
elements at one time and that minimum element calculation is based off the first
element in the list. When the first element does not match the other elements,
the calculation will be wrong and the component will never be able to fully
resolve the ideal necessary elements.

##### Why doesn't it work with margins?

The calculations to figure out element positioning and size get significantly
more complicated with margins, so they are not supported. Use a transparent
border or padding or an element with nested elements to achieve the desired
spacing.

##### Why is there no onScroll event handler?

If you need an onScroll handler, just add the handler to the div wrapping your
ReactList component:

```
<div style={{height: 300, overflow: 'auto'}} onScroll={this.handleScroll}>
  <ReactList ... />
</div>
```

## Development

```bash
open docs/index.html
make
```

[React]: https://github.com/facebook/react
[the example page]: https://caseywebdev.github.io/react-list
[the example page source]: docs/index.es6
