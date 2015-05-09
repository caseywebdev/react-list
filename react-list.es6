import React from 'react';

export class List extends React.Component {
  static propTypes = {
    initialIndex: React.PropTypes.number,
    itemRenderer: React.PropTypes.func,
    itemsRenderer: React.PropTypes.func,
    length: React.PropTypes.number,
    pageSize: React.PropTypes.number,
    threshold: React.PropTypes.number
  };

  static defaultProps = {
    itemRenderer: (i, j) => <div key={j}>{i}</div>,
    itemsRenderer: (items, ref) => <div ref={ref}>{items}</div>,
    length: 0,
    pageSize: 10,
    threshold: 500
  };

  state = {
    from: 0,
    size: this.props.pageSize
  };

  componentWillReceiveProps(next) {
    const {size} = this.state;
    const {length, pageSize} = next;
    this.setState({size: Math.min(Math.max(size, pageSize), length)});
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

  scrollTo(i) {
    const itemEl = React.findDOMNode(this.items).children[i];
    if (!itemEl) return;
    const itemElTop = itemEl.getBoundingClientRect().top;
    const elTop = React.findDOMNode(this).getBoundingClientRect().top;
    this.setScroll(itemElTop - elTop);
  }

  getViewportHeight() {
    const {scrollParent} = this;
    const {innerHeight, clientHeight} = scrollParent;
    return scrollParent === window ? innerHeight : clientHeight;
  }

  updateFrame() {
    const frameBottom = this.getScroll() + this.getViewportHeight();
    const elBottom = React.findDOMNode(this).getBoundingClientRect().height;
    const {pageSize, length, threshold} = this.props;
    if (elBottom >= frameBottom + threshold) return;
    this.setState({size: Math.min(this.state.size + pageSize, length)});
  }

  render() {
    const {from, size} = this.state;
    const items = [];
    for (let i = 0; i < size; ++i) {
      items.push(this.props.itemRenderer(from + i, i));
    }
    return this.props.itemsRenderer(items, c => this.items = c);
  }
}

List.prototype.shouldComponentUpdate =
  React.addons.PureRenderMixin.shouldComponentUpdate;

export class UniformList extends List {
  static propTypes = {
    initialIndex: React.PropTypes.number,
    itemHeight: React.PropTypes.number,
    itemRenderer: React.PropTypes.func,
    itemsPerRow: React.PropTypes.number,
    itemsRenderer: React.PropTypes.func,
    length: React.PropTypes.number,
    threshold: React.PropTypes.number
  };

  static defaultProps = {
    itemRenderer: (i, j) => <div key={j}>{i}</div>,
    itemsRenderer: (items, ref) => <div ref={ref}>{items}</div>,
    length: 0,
    threshold: 500
  };

  state = {
    from: 0,
    itemHeight: this.props.itemHeight || 0,
    itemsPerRow: this.props.itemsPerRow || 1,
    size: 1
  };

  componentWillReceiveProps(next) {
    let {itemsPerRow, from, size} = this.state;
    const {length} = next;
    from = Math.max(Math.min(from, this.getMaxFrom(length, itemsPerRow)), 0);
    size = Math.min(Math.max(size, 1), length - from);
    this.setState({from, size});
  }

  getMaxScrollFor(index) {
    const {itemHeight, itemsPerRow} = this.state;
    return Math.floor(index / itemsPerRow) * itemHeight;
  }

  scrollTo(index) {
    this.setScroll(this.getMaxScrollFor(index));
  }

  scrollAround(index) {
    const {itemHeight} = this.state;
    const current = this.getScroll();
    const max = this.getMaxScrollFor(index);
    if (current > max) return this.setScroll(max);
    const min = max - this.getViewportHeight() + itemHeight;
    if (current < min) this.setScroll(min);
  }

  updateFrame() {
    let {itemHeight, itemsPerRow} = this.props;

    if (itemHeight == null || itemsPerRow == null) {
      const itemEls = React.findDOMNode(this.items).children;
      if (!itemEls.length) return;

      const firstRect = itemEls[0].getBoundingClientRect();
      itemHeight = this.state.itemHeight;
      if (Math.round(firstRect.height) !== Math.round(itemHeight)) {
        itemHeight = firstRect.height;
      }
      if (!itemHeight) return;

      const firstRowBottom = Math.round(firstRect.bottom);
      itemsPerRow = 1;
      for (
        let item = itemEls[itemsPerRow];
        item && Math.round(item.getBoundingClientRect().top) < firstRowBottom;
        item = itemEls[itemsPerRow]
      ) ++itemsPerRow;
    }

    if (!itemHeight || !itemsPerRow) return;

    const {threshold} = this.props;
    const top = Math.max(0, this.getScroll() - threshold);
    const from = Math.min(
      Math.floor(top / itemHeight) * itemsPerRow,
      this.getMaxFrom(this.props.length, itemsPerRow)
    );

    const viewportHeight = this.getViewportHeight() + (threshold * 2);
    const size = Math.min(
      (Math.ceil(viewportHeight / itemHeight) + 1) * itemsPerRow,
      this.props.length - from
    );

    this.setState({itemsPerRow, from, itemHeight, size});
  }

  getMaxFrom(length, itemsPerRow) {
    return Math.max(0, length - itemsPerRow - (length % itemsPerRow));
  }

  getSpace(n) {
    return (n / this.state.itemsPerRow) * this.state.itemHeight;
  }

  render() {
    const transform = `translate(0, ${this.getSpace(this.state.from)}px)`;
    return (
      <div
        style={{position: 'relative', height: this.getSpace(this.props.length)}}
      >
        <div style={{WebkitTransform: transform, transform}}>
          {super.render()}
        </div>
      </div>
    );
  }
}
