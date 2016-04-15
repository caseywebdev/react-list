import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import raf from 'raf';

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
const SCROLL_SIZE_KEYS = {x: 'scrollWidth', y: 'scrollHeight'};
const SCROLL_START_KEYS = {x: 'scrollLeft', y: 'scrollTop'};
const SIZE_KEYS = {x: 'width', y: 'height'};

const NOOP = () => {};

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
    scrollParentGetter: PropTypes.func,
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
    scrollParentGetter: null,
    threshold: 100,
    type: 'simple',
    useTranslate3d: false
  };

  constructor(props) {
    super(props);
    const {initialIndex, pageSize} = this.props;
    const itemsPerRow = 1;
    const {from, size} =
      this.constrain(initialIndex, pageSize, itemsPerRow, this.props);
    this.state = {from, size, itemsPerRow};
    this.cache = {};
  }

  componentWillReceiveProps(next) {
    let {from, size, itemsPerRow} = this.state;
    this.setState(this.constrain(from, size, itemsPerRow, next));
  }

  componentDidMount() {
    this.updateFrame = this.updateFrame.bind(this);
    window.addEventListener('resize', this.updateFrame);
    this.updateFrame(this.scrollTo.bind(this, this.props.initialIndex));
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
    this.scrollParent.removeEventListener('mousewheel', NOOP);
  }

  getOffset(el) {
    const {axis} = this.props;
    let offset = el[CLIENT_START_KEYS[axis]] || 0;
    const offsetKey = OFFSET_START_KEYS[axis];
    do offset += el[offsetKey] || 0; while (el = el.offsetParent);
    return offset;
  }

  getScrollParent() {
    const {axis, scrollParentGetter} = this.props;
    if (scrollParentGetter) return scrollParentGetter();
    let el = findDOMNode(this);
    const overflowKey = OVERFLOW_KEYS[axis];
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
    const scrollKey = SCROLL_START_KEYS[axis];
    const actual = scrollParent === window ?
      // Firefox always returns document.body[scrollKey] as 0 and Chrome/Safari
      // always return document.documentElement[scrollKey] as 0, so take
      // whichever has a value.
      document.body[scrollKey] || document.documentElement[scrollKey] :
      scrollParent[scrollKey];
    const max = this.getScrollSize() - this.getViewportSize();
    const scroll = Math.max(0, Math.min(actual, max));
    const el = findDOMNode(this);
    return this.getOffset(scrollParent) + scroll - this.getOffset(el);
  }

  setScroll(offset) {
    const {scrollParent} = this;
    const {axis} = this.props;
    offset += this.getOffset(findDOMNode(this));
    if (scrollParent === window) return window.scrollTo(0, offset);

    offset -= this.getOffset(this.scrollParent);
    scrollParent[SCROLL_START_KEYS[axis]] = offset;
  }

  getViewportSize() {
    const {scrollParent} = this;
    const {axis} = this.props;
    return scrollParent === window ?
      window[INNER_SIZE_KEYS[axis]] :
      scrollParent[CLIENT_SIZE_KEYS[axis]];
  }

  getScrollSize() {
    const {scrollParent} = this;
    const {axis} = this.props;
    return scrollParent === window ?
      document.body[SCROLL_SIZE_KEYS[axis]] :
      scrollParent[SCROLL_SIZE_KEYS[axis]];
  }

  hasDeterminateSize() {
    const {itemSizeGetter, type} = this.props;
    return type === 'uniform' || itemSizeGetter;
  }

  getStartAndEnd(threshold = this.props.threshold) {
    const scroll = this.getScroll();
    const start = Math.max(0, scroll - threshold);
    let end = scroll + this.getViewportSize() + threshold;
    if (this.hasDeterminateSize()) {
      end = Math.min(end, this.getSpaceBefore(this.props.length));
    }
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

  updateFrame(cb) {
    raf(() => this.doUpdateFrame(cb));
  }

  doUpdateFrame(cb) {
    this.updateScrollParent();
    if (typeof cb != 'function') cb = NOOP;
    switch (this.props.type) {
    case 'simple': return this.updateSimpleFrame(cb);
    case 'variable': return this.updateVariableFrame(cb);
    case 'uniform': return this.updateUniformFrame(cb);
    }
  }

  updateScrollParent() {
    const prev = this.scrollParent;
    this.scrollParent = this.getScrollParent();
    if (prev === this.scrollParent) return;
    if (prev) {
      prev.removeEventListener('scroll', this.updateFrame);
      prev.removeEventListener('mousewheel', NOOP);
    }
    this.scrollParent.addEventListener('scroll', this.updateFrame);
    this.scrollParent.addEventListener('mousewheel', NOOP);
  }

  updateSimpleFrame(cb) {
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

    if (elEnd > end) return cb();

    const {pageSize, length} = this.props;
    this.setState({size: Math.min(this.state.size + pageSize, length)}, cb);
  }

  updateVariableFrame(cb) {
    if (!this.props.itemSizeGetter) this.cacheSizes();

    const {start, end} = this.getStartAndEnd();
    const {length, pageSize} = this.props;
    let space = 0;
    let from = 0;
    let size = 0;
    const maxFrom = length - 1;

    while (from < maxFrom) {
      const itemSize = this.getSizeOf(from);
      if (itemSize == null || space + itemSize > start) break;
      space += itemSize;
      ++from;
    }

    const maxSize = length - from;

    while (size < maxSize && space < end) {
      const itemSize = this.getSizeOf(from + size);
      if (itemSize == null) {
        size = Math.min(size + pageSize, maxSize);
        break;
      }
      space += itemSize;
      ++size;
    }

    this.setState({from, size}, cb);
  }

  updateUniformFrame(cb) {
    let {itemSize, itemsPerRow} = this.getItemSizeAndItemsPerRow();

    if (!itemSize || !itemsPerRow) return cb();

    const {start, end} = this.getStartAndEnd();

    const {from, size} = this.constrain(
      Math.floor(start / itemSize) * itemsPerRow,
      (Math.ceil((end - start) / itemSize) + 1) * itemsPerRow,
      itemsPerRow,
      this.props
    );

    return this.setState({itemsPerRow, from, itemSize, size}, cb);
  }

  getSpaceBefore(index, cache = {}) {
    if (cache[index] != null) return cache[index];

    // Try the static itemSize.
    const {itemSize, itemsPerRow} = this.state;
    if (itemSize) {
      return cache[index] = Math.floor(index / itemsPerRow) * itemSize;
    }

    // Find the closest space to index there is a cached value for.
    let from = index;
    while (from > 0 && cache[--from] == null);

    // Finally, accumulate sizes of items from - index.
    let space = cache[from] || 0;
    for (let i = from; i < index; ++i) {
      cache[i] = space;
      const itemSize = this.getSizeOf(i);
      if (itemSize == null) break;
      space += itemSize;
    }

    return cache[index] = space;
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
    const {cache, items} = this;
    const {axis, itemSizeGetter, type} = this.props;
    const {from, itemSize, size} = this.state;

    // Try the static itemSize.
    if (itemSize) return itemSize;

    // Try the itemSizeGetter.
    if (itemSizeGetter) return itemSizeGetter(index);

    // Try the cache.
    if (index in cache) return cache[index];

    // Try the DOM.
    if (type === 'simple' && index >= from && index < from + size && items) {
      const itemEl = findDOMNode(items).children[index - from];
      if (itemEl) return itemEl[OFFSET_SIZE_KEYS[axis]];
    }
  }

  constrain(from, size, itemsPerRow, {length, pageSize, type}) {
    size = Math.max(size, pageSize);
    let mod = size % itemsPerRow;
    if (mod) size += itemsPerRow - mod;
    if (size > length) size = length;
    from =
      type === 'simple' || !from ? 0 :
      Math.max(Math.min(from, length - size), 0);

    if (mod = from % itemsPerRow) {
      from -= mod;
      size += mod;
    }

    return {from, size};
  }

  scrollTo(index) {
    if (index != null) this.setScroll(this.getSpaceBefore(index));
  }

  scrollAround(index) {
    const current = this.getScroll();
    const bottom = this.getSpaceBefore(index);
    const top = bottom - this.getViewportSize() + this.getSizeOf(index);
    const min = Math.min(top, bottom);
    const max = Math.max(top, bottom);
    if (current <= min) return this.setScroll(min);
    if (current > max) return this.setScroll(max);
  }

  getVisibleRange() {
    const {from, size} = this.state;
    const {start, end} = this.getStartAndEnd(0);
    const cache = {};
    let first, last;
    for (let i = from; i < from + size; ++i) {
      const itemStart = this.getSpaceBefore(i, cache);
      const itemEnd = itemStart + this.getSizeOf(i);
      if (first == null && itemEnd > start) first = i;
      if (first != null && itemStart < end) last = i;
    }
    return [first, last];
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
    const {from, itemsPerRow} = this.state;

    const items = this.renderItems();
    if (type === 'simple') return items;

    const style = {position: 'relative'};
    const cache = {};
    const bottom = Math.ceil(length / itemsPerRow) * itemsPerRow;
    const size = this.getSpaceBefore(bottom, cache);
    if (size) {
      style[SIZE_KEYS[axis]] = size;
      if (axis === 'x') style.overflowX = 'hidden';
    }
    const offset = this.getSpaceBefore(from, cache);
    const x = axis === 'x' ? offset : 0;
    const y = axis === 'y' ? offset : 0;
    const transform =
      useTranslate3d ?
      `translate3d(${x}px, ${y}px, 0)` :
      `translate(${x}px, ${y}px)`;
    const listStyle = {
      msTransform: transform,
      WebkitTransform: transform,
      transform
    };
    return <div {...{style}}><div style={listStyle}>{items}</div></div>;
  }
}
