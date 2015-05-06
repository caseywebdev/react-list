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

## Components

### `reactList.List`

#### itemRenderer(index, key)

A function that receives an index and a key and returns the content to be
rendered for the item at that index.

#### itemsRenderer(items, ref)

A function that receives the rendered items and a ref. By default this element
is just a `<div>`. Generally it only needs to be overriden for use in a
`<table>` or other special case. **NOTE: You must set ref={ref} on the component
that contains the `items` so the correct item sizing calculations can be made.**

#### length

The number of items in the list.

#### pageSize (defaults to `10`)

The number of items to batch up for new renders.

#### threshold (defaults to `500`)

The number of pixels to ensure the list is buffered with.

### `reactList.UniformList`

`UniformList` has the same properties as `List`, but `pageSize` is calculated
automatically. It also supports two more optional properties.

#### itemHeight (defaults to automatic calculation)

While not necessary, providing the exact rendered height of each item can
improve performance. If not provided, the height of the first rendered element
will be used to assume the height of all items.

#### itemsPerRow (defaults to automatic calculation)

Similar to `itemHeight`, providing the number of items that render per row of
items (columns) can improve performance. This is also not required and if not
provided will be calculated by counting the number of rendered items in the
first row.

**NOTE: `itemHeight` and `itemsPerRow` should always both be defined or both not
be defined. If one is defined but not the other, the automatic calculation will
take over.**

## Examples

Check out [the test file] for examples of both the `List` and `UniformList`
components.

[React]: https://github.com/facebook/react
[PureRenderMixin]: https://facebook.github.io/react/docs/pure-render-mixin.html
[the test file]: https://orgsync.github.io/react-list/
