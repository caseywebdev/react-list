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

`UniformList` has the same properties as `List`, but `pageSize` is ignored and
calculated automatically based on the size of the first rendered element in the
list.

## Examples

Check out [the test file] for examples of both the `List` and `UniformList`
components.

[React]: https://github.com/facebook/react
[PureRenderMixin]: https://facebook.github.io/react/docs/pure-render-mixin.html
[the test file]: https://orgsync.github.io/react-list/
