import React from 'react';

const isEqualSubset = (a, b) => {
  for (const key in a) if (b[key] !== a[key]) return false;
  return true;
};

const isEqual = (a, b) => isEqualSubset(a, b) && isEqualSubset(b, a);

export class List extends React.Component {
  static propTypes = {
    itemRenderer: React.PropTypes.func,
    itemsRenderer: React.PropTypes.func,
    length: React.PropTypes.number,
    pageSize: React.PropTypes.number,
    threshold: React.PropTypes.number
  }

  static defaultProps = {
    itemRenderer: (i, j) => <div key={j}>{i}</div>,
    itemsRenderer: (items, ref) => <div ref={ref}>{items}</div>,
    length: 0,
    pageSize: 10,
    threshold: 500
  }

  state = {
    from: 0,
    to: this.props.pageSize
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  componentWillReceiveProps(next) {
    const {to} = this.state;
    const nextTo = Math.min(to, next.length);
    if (nextTo !== to) this.setState({to: nextTo});
  }

  componentDidMount() {
    this.scrollParent = this.getScrollParent();
    this.updateFrame = this.updateFrame.bind(this);
    window.addEventListener('resize', this.updateFrame);
    this.scrollParent.addEventListener('scroll', this.updateFrame);
    this.updateFrame();
  }

  componentDidUpdate() {
    this.updateFrame();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateFrame);
    this.scrollParent.removeEventListener('scroll', this.updateFrame);
  }

  getScrollParent() {
    for (let el = React.findDOMNode(this); el; el = el.parentElement) {
      const overflowY = window.getComputedStyle(el).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') return el;
    }
    return window;
  }

  getScroll() {
    const {scrollParent} = this;
    const el = React.findDOMNode(this);
    if (scrollParent === el) return el.scrollTop;
    if (scrollParent === window) return -el.getBoundingClientRect().top;
    return scrollParent.scrollTop - el.offsetTop;
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
    this.setState({to: Math.min(this.state.to + pageSize, length)});
  }

  render() {
    const {from, to} = this.state;
    const items = [];
    for (let i = from; i < to; ++i) {
      items.push(this.props.itemRenderer(i, i - from));
    }
    return this.props.itemsRenderer(items, c => this.items = c);
  }
};

export class UniformList extends List {
  static propTypes = {
    itemRenderer: React.PropTypes.func,
    itemsRenderer: React.PropTypes.func,
    length: React.PropTypes.number
  }

  static defaultProps = {
    itemRenderer: (i, j) => <div key={j}>{i}</div>,
    itemsRenderer: (items, ref) => <div ref={ref}>{items}</div>,
    length: 0
  }

  state = {
    columns: 1,
    from: 0,
    itemHeight: 0,
    to: 1
  }

  componentWillReceiveProps(next) {
    const {columns, from, to} = this.state;
    const nextFrom = Math.min(from, this.getMaxFrom(next.length, columns));
    const nextTo = Math.min(to, next.length);
    if (nextFrom === from && nextTo === to) return
    this.setState({from: nextFrom, to: nextTo});
  }

  setScroll(y) {
    const {scrollParent} = this;
    if (scrollParent === window) return window.scrollTo(0, y);
    scrollParent.scrollTop = y;
  }

  scrollTo(i) {
    const {itemHeight} = this.state;
    const current = this.getScroll();
    const max = Math.floor(i / this.state.columns) * itemHeight;
    const min = max - this.getViewportHeight() + itemHeight;
    if (current > max) this.setScroll(max);
    if (current < min) this.setScroll(min);
  }

  updateFrame() {
    const itemEls = React.findDOMNode(this.items).children;
    if (!itemEls.length) return;

    const firstRect = itemEls[0].getBoundingClientRect();
    const itemHeight = firstRect.height;
    if (!itemHeight) return;

    const firstRowBottom = firstRect.top + itemHeight;
    let columns = 1;
    while (
      itemEls[columns] &&
      itemEls[columns].getBoundingClientRect().top < firstRowBottom
    ) ++columns;

    const from = Math.min(
      Math.floor(Math.max(0, this.getScroll()) / itemHeight) * columns,
      this.getMaxFrom(this.props.length, columns)
    );

    const to = Math.min(
      from + ((Math.ceil(this.getViewportHeight() / itemHeight) + 1) * columns),
      this.props.length
    );

    this.setState({columns, from, itemHeight, to});
  }

  getMaxFrom(length, columns) {
    return Math.max(0, length - columns - (length % columns));
  }

  getSpace(n) {
    return (n / this.state.columns) * this.state.itemHeight;
  }

  render() {
    const position = 'relative';
    const height = this.getSpace(this.props.length);
    const transform = `translate(0, ${this.getSpace(this.state.from)}px)`;
    return (
      <div style={{position, height}}>
        <div style={{position, WebkitTransform: transform, transform}}>
          {super.render()}
        </div>
      </div>
    );
  }
};
