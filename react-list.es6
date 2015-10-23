import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

const {findDOMNode} = ReactDOM;

const isEqualSubset = (a, b) => {
  for (let key in a) if (a[key] !== b[key]) return false;
  return true;
};

const isEqual = (a, b) => isEqualSubset(a, b) && isEqualSubset(b, a);

const CLIENT_SIZE_KEYS = {x: 'clientWidth', y: 'clientHeight'};
const CLIENT_START_KEYS = {x: 'clientTop', y: 'clientLeft'};
const INNER_SIZE_KEYS = {x: 'innerWidth', y: 'innerHeight'};
const OFFSET_SIZE_KEYS = {x: 'offsetWidth', y: 'offsetHeight'};
const OFFSET_START_KEYS = {x: 'offsetLeft', y: 'offsetTop'};
const OVERFLOW_KEYS = {x: 'overflowX', y: 'overflowY'};
const SCROLL_KEYS = {x: 'scrollLeft', y: 'scrollTop'};
const SIZE_KEYS = {x: 'width', y: 'height'};

export default class extends Component {
  static displayName = 'ReactList';

  static propTypes = {
    axis: PropTypes.oneOf(['x', 'y']),
    initialIndex: PropTypes.number,
    itemSizeGetter: PropTypes.func,
    itemRenderer: PropTypes.func,
    itemsRenderer: PropTypes.func,
    length: PropTypes.number,
    pageSize: PropTypes.number,
    threshold: PropTypes.number,
    type: PropTypes.oneOf(['simple', 'variable', 'uniform']),
    useTranslate3d: PropTypes.bool
  };

  static defaultProps = {
    axis: 'y',
    initialIndex: null,
    itemSizeGetter: null,
    itemRenderer: (index, key) => <div key={key}>{index}</div>,
    itemsRenderer: (items, ref) => <div ref={ref}>{items}</div>,
    length: 0,
    pageSize: 10,
    threshold: 100,
    type: 'simple',
    useTranslate3d: false
  };

  constructor(props) {
    super(props);
    const {initialIndex, length, pageSize} = this.props;
    const itemsPerRow = 1;
    const from = this.constrainFrom(initialIndex, length, itemsPerRow);
    const size = this.constrainSize(pageSize, length, pageSize, from);
    this.state = {from, size, itemsPerRow};
    this.cache = {};
  }

  componentWillReceiveProps(next) {
    let {itemsPerRow, from, size} = this.state;
    const {length, pageSize} = next;
    from = this.constrainFrom(from, length, itemsPerRow);
    size = this.constrainSize(size, length, pageSize, from);
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
    if (this.afId) {
      cancelAnimationFrame(this.afId);
    }
  }

  getOffset(el) {
    const {axis} = this.props;
    let offset = el[CLIENT_START_KEYS[axis]] || 0;
    const offsetKey = OFFSET_START_KEYS[axis];
    do offset += el[offsetKey] || 0; while (el = el.offsetParent);
    return offset;
  }

  getScrollParent() {
    let el = findDOMNode(this);
    const overflowKey = OVERFLOW_KEYS[this.props.axis];
    while (el = el.parentElement) {
      switch (window.getComputedStyle(el)[overflowKey]) {
      case 'auto': case 'scroll': case 'overlay': return el;
      }
    }
    return window;
  }

  getScroll() {
    const {scrollParent} = this;
    const {axis} = this.props;
    const scrollKey = SCROLL_KEYS[axis];
    const scroll = scrollParent === window ?
      // Firefox always returns document.body[scrollKey] as 0 and Chrome/Safari
      // always return document.documentElement[scrollKey] as 0, so take
      // whichever has a value.
      document.body[scrollKey] || document.documentElement[scrollKey] :
      scrollParent[scrollKey];
    const el = findDOMNode(this);
    return scroll - (this.getOffset(el) - this.getOffset(scrollParent));
  }

  setScroll(offset) {
    const {scrollParent} = this;
    if (scrollParent === window) {
      return window.scrollTo(0, this.getOffset(findDOMNode(this)) + offset);
    }
    scrollParent[SCROLL_KEYS[this.props.axis]] += offset - this.getScroll();
  }

  getViewportSize() {
    const {scrollParent} = this;
    const {axis} = this.props;
    return scrollParent === window ?
      window[INNER_SIZE_KEYS[axis]] :
      scrollParent[CLIENT_SIZE_KEYS[axis]];
  }

  getStartAndEnd(threshold = this.props.threshold) {
    const start = this.getScroll() - threshold;
    const end = start + this.getViewportSize() + (threshold * 2);
    return {start, end};
  }

  getItemSizeAndItemsPerRow() {
    const itemEls = findDOMNode(this.items).children;
    if (!itemEls.length) return {};

    const firstEl = itemEls[0];

    // Firefox has a problem where it will return a *slightly* (less than
    // thousandths of a pixel) different size for the same element between
    // renders. This can cause an infinite render loop, so only change the
    // itemSize when it is significantly different.
    let {itemSize} = this.state;
    const {axis} = this.props;
    const firstElSize = firstEl[OFFSET_SIZE_KEYS[axis]];
    const delta = Math.abs(firstElSize - itemSize);
    if (isNaN(delta) || delta >= 1) itemSize = firstElSize;

    if (!itemSize) return {};

    const startKey = OFFSET_START_KEYS[axis];
    const firstStart = firstEl[startKey];
    let itemsPerRow = 1;
    for (
      let item = itemEls[itemsPerRow];
      item && item[startKey] === firstStart;
      item = itemEls[itemsPerRow]
    ) ++itemsPerRow;

    return {itemSize, itemsPerRow};
  }

  updateFrame() {
    switch (this.props.type) {
    case 'simple': return this.updateSimpleFrame();
    case 'variable': return this.updateVariableFrame();
    case 'uniform': return this.updateUniformFrame();
    }
  }

  updateSimpleFrame() {
    const {end} = this.getStartAndEnd();
    const itemEls = findDOMNode(this.items).children;
    let elEnd = 0;

    if (itemEls.length) {
      const {axis} = this.props;
      const firstItemEl = itemEls[0];
      const lastItemEl = itemEls[itemEls.length - 1];
      elEnd = this.getOffset(lastItemEl) + lastItemEl[OFFSET_SIZE_KEYS[axis]] -
        this.getOffset(firstItemEl);
    }

    if (elEnd > end) return;

    const {pageSize, length} = this.props;
    this.setState({size: Math.min(this.state.size + pageSize, length)});
  }

  updateVariableFrame() {
    if (!this.props.itemSizeGetter) this.cacheSizes();

    const {start, end} = this.getStartAndEnd();
    const {length, pageSize} = this.props;
    let space = 0;
    let from = 0;
    let size = 0;
    const maxFrom = length - 1;

    while (from < maxFrom) {
      const itemSize = this.getSizeOf(from);
      if (isNaN(itemSize) || space + itemSize > start) break;
      space += itemSize;
      ++from;
    }

    const maxSize = length - from;

    while (size < maxSize && space < end) {
      const itemSize = this.getSizeOf(from + size);
      if (isNaN(itemSize)) {
        size = Math.min(size + pageSize, maxSize);
        break;
      }
      space += itemSize;
      ++size;
    }

    this.setState({from, size});
  }

  updateUniformFrame() {
    let {itemSize, itemsPerRow} = this.getItemSizeAndItemsPerRow();

    if (!itemSize || !itemsPerRow) return;

    const {length, pageSize} = this.props;
    const {start, end} = this.getStartAndEnd();

    const from = this.constrainFrom(
      Math.floor(start / itemSize) * itemsPerRow,
      length,
      itemsPerRow
    );

    const size = this.constrainSize(
      (Math.ceil((end - start) / itemSize) + 1) * itemsPerRow,
      length,
      pageSize,
      from
    );

    return this.setState({itemsPerRow, from, itemSize, size});
  }

  getSpaceBefore(index) {

    // Try the static itemSize.
    const {itemSize, itemsPerRow} = this.state;
    if (itemSize) return Math.ceil(index / itemsPerRow) * itemSize;

    // Finally, accumulate sizes of items 0 - index.
    let space = 0;
    for (let i = 0; i < index; ++i) {
      const itemSize = this.getSizeOf(i);
      if (isNaN(itemSize)) break;
      space += itemSize;
    }
    return space;
  }

  cacheSizes() {
    const {cache} = this;
    const {from} = this.state;
    const itemEls = findDOMNode(this.items).children;
    const sizeKey = OFFSET_SIZE_KEYS[this.props.axis];
    for (let i = 0, l = itemEls.length; i < l; ++i) {
      cache[from + i] = itemEls[i][sizeKey];
    }
  }

  getSizeOf(index) {

    // Try the static itemSize.
    const {itemSize} = this.state;
    if (itemSize) return itemSize;

    // Try the itemSizeGetter.
    const {itemSizeGetter} = this.props;
    if (itemSizeGetter) return itemSizeGetter(index);

    // Try the cache.
    const {cache} = this;
    if (cache[index]) return cache[index];

    // We don't know the size.
    return NaN;
  }

  constrainFrom(from, length, itemsPerRow) {
    if (this.props.type === 'simple') return 0;
    if (!from) return 0;
    return Math.max(
      Math.min(from, length - itemsPerRow - (length % itemsPerRow)),
      0
    );
  }

  constrainSize(size, length, pageSize, from) {
    return Math.min(Math.max(size, pageSize), length - from);
  }

  scrollTo(index) {
    this.setScroll(this.getSpaceBefore(index));
  }

  scrollAround(index) {
    const current = this.getScroll();

    const max = this.getSpaceBefore(index);
    if (current > max) return this.setScroll(max);

    const min = max - this.getViewportSize() + this.getSizeOf(index);
    if (current < min) this.setScroll(min);
  }

  getVisibleRange() {
    const el = findDOMNode(this);
    const itemEls = el.children;
    const top = this.getOffset(el);
    const sizeKey = OFFSET_SIZE_KEYS[this.props.axis];
    const {start, end} = this.getStartAndEnd(0);
    let first = 0, last = 0;
    for (let i = 0; i < itemEls.length; ++i) {
      const itemEl = itemEls[i];
      const itemStart = this.getOffset(itemEl) - top;
      const itemEnd = itemStart + itemEl[sizeKey];
      if (itemStart <= start && itemEnd > start) first = i;
      if (itemStart < end && itemEnd >= end) last = i;
    }
    const {from} = this.state;
    return [from + first, from + last];
  }

  renderItems() {
    const {itemRenderer, itemsRenderer} = this.props;
    const {from, size} = this.state;
    const items = [];
    for (let i = 0; i < size; ++i) items.push(itemRenderer(from + i, i));
    return itemsRenderer(items, c => this.items = c);
  }

  render() {
    const {axis, length, type, useTranslate3d} = this.props;
    const {from} = this.state;

    const items = this.renderItems();
    if (type === 'simple') return items;

    const style = {position: 'relative'};
    const size = this.getSpaceBefore(length);
    style[SIZE_KEYS[axis]] = size;
    if (size && axis === 'x') style.overflowX = 'hidden';
    const offset = this.getSpaceBefore(from);
    const x = axis === 'x' ? offset : 0;
    const y = axis === 'y' ? offset : 0;
    const transform =
      useTranslate3d ?
      `translate3d(${x}px, ${y}px, 0)` :
      `translate(${x}px, ${y}px)`;
    const listStyle = {
      MsTransform: transform,
      WebkitTransform: transform,
      transform
    };
    return <div {...{style}}><div style={listStyle}>{items}</div></div>;
  }
}
