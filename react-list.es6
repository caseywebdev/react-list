import React from 'react';

const isEqualSubset = (a, b) => {
  for (let key in a) if (a[key] !== b[key]) return false;
  return true;
};

const isEqual = (a, b) => isEqualSubset(a, b) && isEqualSubset(b, a);

export default class extends React.Component {
  static propTypes = {
    initialIndex: React.PropTypes.number,
    itemHeightGetter: React.PropTypes.func,
    itemRenderer: React.PropTypes.func,
    itemsRenderer: React.PropTypes.func,
    length: React.PropTypes.number,
    pageSize: React.PropTypes.number,
    simple: React.PropTypes.bool,
    threshold: React.PropTypes.number,
    type: React.PropTypes.oneOf(['simple', 'variable', 'uniform'])
  };

  static defaultProps = {
    itemRenderer: (index, key) => <div key={key}>{index}</div>,
    itemsRenderer: (items, ref) => <div ref={ref}>{items}</div>,
    length: 0,
    pageSize: 10,
    threshold: 500,
    type: 'simple'
  };

  state = {
    from: this.props.initialIndex || 0,
    itemHeight: 0,
    itemsPerRow: 1,
    size: this.props.pageSize
  };

  cache = {};

  componentWillReceiveProps(next) {
    let {itemsPerRow, from, size} = this.state;
    const {length, pageSize} = next;
    from = Math.max(Math.min(from, this.getMaxFrom(length, itemsPerRow)), 0);
    size = Math.min(Math.max(size, pageSize), length - from);
    this.setState({from, size});
  }

  componentDidMount() {
    this.scrollParent = this.getScrollParent();
    this.updateFrame = this.updateFrame.bind(this);
    window.addEventListener('resize', this.updateFrame);
    this.scrollParent.addEventListener('scroll', this.updateFrame);
    this.updateFrame();
    const {initialIndex} = this.props;
    if (initialIndex == null) return;
    this.afId = requestAnimationFrame(this.scrollTo.bind(this, initialIndex));
  }

  shouldComponentUpdate(props, state) {
    return !isEqual(props, this.props) || !isEqual(state, this.state);
  }

  componentDidUpdate() {
    this.updateFrame();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateFrame);
    this.scrollParent.removeEventListener('scroll', this.updateFrame);
    cancelAnimationFrame(this.afId);
  }

  getScrollParent() {
    let el = React.findDOMNode(this);
    while (el = el.parentElement) {
      const overflowY = window.getComputedStyle(el).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') return el;
    }
    return window;
  }

  getScroll() {
    const {scrollParent} = this;
    const elTop = React.findDOMNode(this).getBoundingClientRect().top;
    if (scrollParent === window) return -elTop;
    const scrollParentTop = scrollParent.getBoundingClientRect().top;
    return scrollParentTop + scrollParent.clientTop - elTop;
  }

  setScroll(y) {
    const {scrollParent} = this;
    if (scrollParent === window) {
      const elTop = React.findDOMNode(this).getBoundingClientRect().top;
      const windowTop = document.documentElement.getBoundingClientRect().top;
      return window.scrollTo(0, Math.round(elTop) - windowTop + y);
    }
    scrollParent.scrollTop += y - this.getScroll();
  }

  getViewportHeight() {
    const {scrollParent} = this;
    const {innerHeight, clientHeight} = scrollParent;
    return scrollParent === window ? innerHeight : clientHeight;
  }

  getTopAndBottom() {
    const {threshold} = this.props;
    const top = Math.max(0, this.getScroll() - threshold);
    const bottom = top + this.getViewportHeight() + (threshold * 2);
    return {top, bottom};
  }

  getItemHeightAndItemsPerRow() {
    const itemEls = React.findDOMNode(this.items).children;
    if (!itemEls.length) return {};

    const firstRect = itemEls[0].getBoundingClientRect();

    // Firefox has a problem where it will return a *slightly* (less than
    // thousandths of a pixel) different height for the same element between
    // renders. This can cause an infinite render loop, so only change the
    // itemHeight when it is significantly different.
    let itemHeight = this.state.itemHeight;
    if (Math.round(firstRect.height) !== Math.round(itemHeight)) {
      itemHeight = firstRect.height;
    }

    if (!itemHeight) return {};

    const firstRowBottom = Math.round(firstRect.bottom);
    let itemsPerRow = 1;
    for (
      let item = itemEls[itemsPerRow];
      item && Math.round(item.getBoundingClientRect().top) < firstRowBottom;
      item = itemEls[itemsPerRow]
    ) ++itemsPerRow;

    return {itemHeight, itemsPerRow};
  }

  updateFrame() {
    switch (this.props.type) {
    case 'simple': return this.updateSimpleFrame();
    case 'variable': return this.updateVariableFrame();
    case 'uniform': return this.updateUniformFrame();
    }
  }

  updateSimpleFrame() {
    const {bottom} = this.getTopAndBottom();
    const elHeight = React.findDOMNode(this).getBoundingClientRect().height;

    if (elHeight > bottom) return;

    const {pageSize, length} = this.props;
    this.setState({size: Math.min(this.state.size + pageSize, length)});
  }

  updateVariableFrame() {
    if (!this.props.itemHeightGetter) this.cacheHeights();

    const {top, bottom} = this.getTopAndBottom();
    const {length, pageSize} = this.props;
    let space = 0;
    let from = 0;
    let size = 0;
    const maxFrom = length - 1;

    while (from < maxFrom) {
      const height = this.getHeightOf(from);
      if (isNaN(height) || space + height > top) break;
      space += height;
      ++from;
    }

    const maxSize = length - from;

    while (size < maxSize && space < bottom) {
      const height = this.getHeightOf(from + size);
      if (isNaN(height)) {
        size += pageSize;
        break;
      }
      space += height;
      ++size;
    }

    this.setState({from, size});
  }

  updateUniformFrame() {
    let {itemHeight, itemsPerRow} = this.getItemHeightAndItemsPerRow();

    if (!itemHeight || !itemsPerRow) return;

    const {length} = this.props;
    const {top, bottom} = this.getTopAndBottom();

    const from = Math.min(
      Math.floor(top / itemHeight) * itemsPerRow,
      this.getMaxFrom(length, itemsPerRow)
    );

    const size = Math.min(
      (Math.ceil((bottom - top) / itemHeight) + 1) * itemsPerRow,
      length - from
    );

    return this.setState({itemsPerRow, from, itemHeight, size});
  }

  getSpaceBefore(index) {

    // Try the static itemHeight.
    const {itemHeight, itemsPerRow} = this.state;
    if (itemHeight) return Math.ceil(index / itemsPerRow) * itemHeight;

    // Finally, accumulate heights of items 0 - index.
    let height = 0;
    for (let i = 0; i < index; ++i) {
      const itemHeight = this.getHeightOf(i);
      if (isNaN(itemHeight)) break;
      height += itemHeight;
    }
    return height;
  }

  cacheHeights() {
    const {cache} = this;
    const {from} = this.state;
    const itemEls = React.findDOMNode(this.items).children;
    for (let i = 0, l = itemEls.length; i < l; ++i) {
      const index = from + i;
      if (cache[index]) continue;
      cache[index] = itemEls[i].getBoundingClientRect().height;
    }
  }

  getHeightOf(index) {

    // Try the static itemHeight.
    const {itemHeight} = this.state;
    if (itemHeight) return itemHeight;

    // Try the itemHeightGetter.
    const {itemHeightGetter} = this.props;
    if (itemHeightGetter) return itemHeightGetter(index);

    // Try the cache.
    const {cache} = this;
    if (cache[index]) return cache[index];

    // We don't know the height.
    return NaN;
  }

  getMaxFrom(length, itemsPerRow) {
    if (this.props.type === 'simple') return 0;
    return Math.max(0, length - itemsPerRow - (length % itemsPerRow));
  }

  scrollTo(index) {
    this.setScroll(this.getSpaceBefore(index));
  }

  scrollAround(index) {
    const current = this.getScroll();

    const max = this.getSpaceBefore(index);
    if (current > max) return this.setScroll(max);

    const min = max - this.getViewportHeight() + this.getHeightOf(index);
    if (current < min) this.setScroll(min);
  }

  renderItems() {
    const {from, size} = this.state;
    const items = [];
    for (let i = 0; i < size; ++i) {
      items.push(this.props.itemRenderer(from + i, i));
    }
    return this.props.itemsRenderer(items, c => this.items = c);
  }

  render() {
    const items = this.renderItems();
    if (this.props.type === 'simple') return items;

    const height = this.getSpaceBefore(this.props.length);
    const offset = this.getSpaceBefore(this.state.from);
    const transform = `translate(0, ${offset}px)`;
    return (
      <div style={{position: 'relative', height}}>
        <div style={{WebkitTransform: transform, transform}}>{items}</div>
      </div>
    );
  }
}
