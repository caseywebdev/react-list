(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'react'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.React);
    global.ReactList = mod.exports;
  }
})(this, function (exports, module, _react) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x,
    property = _x2,
    receiver = _x3; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  var _React = _interopRequire(_react);

  var isEqualSubset = function isEqualSubset(a, b) {
    for (var key in a) {
      if (a[key] !== b[key]) return false;
    }return true;
  };

  var isEqual = function isEqual(a, b) {
    return isEqualSubset(a, b) && isEqualSubset(b, a);
  };

  var CLIENT_START_KEYS = { x: 'clientTop', y: 'clientLeft' };
  var CLIENT_SIZE_KEYS = { x: 'clientWidth', y: 'clientHeight' };
  var END_KEYS = { x: 'right', y: 'bottom' };
  var INNER_SIZE_KEYS = { x: 'innerWidth', y: 'innerHeight' };
  var OVERFLOW_KEYS = { x: 'overflowX', y: 'overflowY' };
  var SCROLL_KEYS = { x: 'scrollLeft', y: 'scrollTop' };
  var SIZE_KEYS = { x: 'width', y: 'height' };
  var START_KEYS = { x: 'left', y: 'top' };

  var _default = (function (_React$Component) {
    var _class = function _default(props) {
      _classCallCheck(this, _class);

      _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this, props);
      var _props = this.props;
      var initialIndex = _props.initialIndex;
      var length = _props.length;
      var pageSize = _props.pageSize;

      var itemsPerRow = 1;
      var from = this.constrainFrom(initialIndex, length, itemsPerRow);
      var size = this.constrainSize(pageSize, length, pageSize, from);
      this.state = { from: from, size: size, itemsPerRow: itemsPerRow };
      this.cache = {};
    };

    _inherits(_class, _React$Component);

    _createClass(_class, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(next) {
        var _state = this.state;
        var itemsPerRow = _state.itemsPerRow;
        var from = _state.from;
        var size = _state.size;
        var length = next.length;
        var pageSize = next.pageSize;

        from = this.constrainFrom(from, length, itemsPerRow);
        size = this.constrainSize(size, length, pageSize, from);
        this.setState({ from: from, size: size });
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.scrollParent = this.getScrollParent();
        this.updateFrame = this.updateFrame.bind(this);
        window.addEventListener('resize', this.updateFrame);
        this.scrollParent.addEventListener('scroll', this.updateFrame);
        this.updateFrame();
        var initialIndex = this.props.initialIndex;

        if (initialIndex == null) return;
        this.afId = requestAnimationFrame(this.scrollTo.bind(this, initialIndex));
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(props, state) {
        return !isEqual(props, this.props) || !isEqual(state, this.state);
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        this.updateFrame();
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        window.removeEventListener('resize', this.updateFrame);
        this.scrollParent.removeEventListener('scroll', this.updateFrame);
        cancelAnimationFrame(this.afId);
      }
    }, {
      key: 'getScrollParent',
      value: function getScrollParent() {
        var el = _React.findDOMNode(this);
        var overflowKey = OVERFLOW_KEYS[this.props.axis];
        while (el = el.parentElement) {
          var overflow = window.getComputedStyle(el)[overflowKey];
          if (overflow === 'auto' || overflow === 'scroll') return el;
        }
        return window;
      }
    }, {
      key: 'getScroll',
      value: function getScroll() {
        var scrollParent = this.scrollParent;
        var axis = this.props.axis;

        var startKey = START_KEYS[axis];
        var elStart = _React.findDOMNode(this).getBoundingClientRect()[startKey];
        if (scrollParent === window) return -elStart;
        var scrollParentStart = scrollParent.getBoundingClientRect()[startKey];
        var scrollParentClientStart = scrollParent[CLIENT_START_KEYS[axis]];
        return scrollParentStart + scrollParentClientStart - elStart;
      }
    }, {
      key: 'setScroll',
      value: function setScroll(offset) {
        var scrollParent = this.scrollParent;
        var axis = this.props.axis;

        var startKey = START_KEYS[axis];
        if (scrollParent === window) {
          var elStart = _React.findDOMNode(this).getBoundingClientRect()[startKey];
          var windowStart = document.documentElement.getBoundingClientRect()[startKey];
          return window.scrollTo(0, Math.round(elStart) - windowStart + offset);
        }
        scrollParent[SCROLL_KEYS[axis]] += offset - this.getScroll();
      }
    }, {
      key: 'getViewportSize',
      value: function getViewportSize() {
        var scrollParent = this.scrollParent;
        var axis = this.props.axis;

        return scrollParent === window ? window[INNER_SIZE_KEYS[axis]] : scrollParent[CLIENT_SIZE_KEYS[axis]];
      }
    }, {
      key: 'getStartAndEnd',
      value: function getStartAndEnd() {
        var threshold = this.props.threshold;

        var start = Math.max(0, this.getScroll() - threshold);
        var end = start + this.getViewportSize() + threshold * 2;
        return { start: start, end: end };
      }
    }, {
      key: 'getItemSizeAndItemsPerRow',
      value: function getItemSizeAndItemsPerRow() {
        var itemEls = _React.findDOMNode(this.items).children;
        if (!itemEls.length) return {};

        var firstRect = itemEls[0].getBoundingClientRect();

        // Firefox has a problem where it will return a *slightly* (less than
        // thousandths of a pixel) different size for the same element between
        // renders. This can cause an infinite render loop, so only change the
        // itemSize when it is significantly different.
        var itemSize = this.state.itemSize;
        var axis = this.props.axis;

        var sizeKey = SIZE_KEYS[axis];
        var firstRectSize = firstRect[sizeKey];
        if (Math.round(firstRectSize) !== Math.round(itemSize)) {
          itemSize = firstRectSize;
        }

        if (!itemSize) return {};

        var startKey = START_KEYS[axis];
        var firstRowEnd = Math.round(firstRect[END_KEYS[axis]]);
        var itemsPerRow = 1;
        for (var item = itemEls[itemsPerRow]; item && Math.round(item.getBoundingClientRect()[startKey]) < firstRowEnd; item = itemEls[itemsPerRow]) {
          ++itemsPerRow;
        }return { itemSize: itemSize, itemsPerRow: itemsPerRow };
      }
    }, {
      key: 'updateFrame',
      value: function updateFrame() {
        switch (this.props.type) {
          case 'simple':
            return this.updateSimpleFrame();
          case 'variable':
            return this.updateVariableFrame();
          case 'uniform':
            return this.updateUniformFrame();
        }
      }
    }, {
      key: 'updateSimpleFrame',
      value: function updateSimpleFrame() {
        var _getStartAndEnd = this.getStartAndEnd();

        var end = _getStartAndEnd.end;

        var itemEls = _React.findDOMNode(this).children;
        var elEnd = 0;

        if (itemEls.length) {
          var axis = this.props.axis;

          var firstItemEl = itemEls[0];
          var lastItemEl = itemEls[itemEls.length - 1];
          elEnd = lastItemEl.getBoundingClientRect()[END_KEYS[axis]] - firstItemEl.getBoundingClientRect()[START_KEYS[axis]];
        }

        if (elEnd > end) return;

        var _props2 = this.props;
        var pageSize = _props2.pageSize;
        var length = _props2.length;

        this.setState({ size: Math.min(this.state.size + pageSize, length) });
      }
    }, {
      key: 'updateVariableFrame',
      value: function updateVariableFrame() {
        if (!this.props.itemSizeGetter) this.cacheSizes();

        var _getStartAndEnd2 = this.getStartAndEnd();

        var start = _getStartAndEnd2.start;
        var end = _getStartAndEnd2.end;
        var _props3 = this.props;
        var length = _props3.length;
        var pageSize = _props3.pageSize;

        var space = 0;
        var from = 0;
        var size = 0;
        var maxFrom = length - 1;

        while (from < maxFrom) {
          var itemSize = this.getSizeOf(from);
          if (isNaN(itemSize) || space + itemSize > start) break;
          space += itemSize;
          ++from;
        }

        var maxSize = length - from;

        while (size < maxSize && space < end) {
          var itemSize = this.getSizeOf(from + size);
          if (isNaN(itemSize)) {
            size = Math.min(size + pageSize, maxSize);
            break;
          }
          space += itemSize;
          ++size;
        }

        this.setState({ from: from, size: size });
      }
    }, {
      key: 'updateUniformFrame',
      value: function updateUniformFrame() {
        var _getItemSizeAndItemsPerRow = this.getItemSizeAndItemsPerRow();

        var itemSize = _getItemSizeAndItemsPerRow.itemSize;
        var itemsPerRow = _getItemSizeAndItemsPerRow.itemsPerRow;

        if (!itemSize || !itemsPerRow) return;

        var _props4 = this.props;
        var length = _props4.length;
        var pageSize = _props4.pageSize;

        var _getStartAndEnd3 = this.getStartAndEnd();

        var start = _getStartAndEnd3.start;
        var end = _getStartAndEnd3.end;

        var from = this.constrainFrom(Math.floor(start / itemSize) * itemsPerRow, length, itemsPerRow);

        var size = this.constrainSize((Math.ceil((end - start) / itemSize) + 1) * itemsPerRow, length, pageSize, from);

        return this.setState({ itemsPerRow: itemsPerRow, from: from, itemSize: itemSize, size: size });
      }
    }, {
      key: 'getSpaceBefore',
      value: function getSpaceBefore(index) {

        // Try the static itemSize.
        var _state2 = this.state;
        var itemSize = _state2.itemSize;
        var itemsPerRow = _state2.itemsPerRow;

        if (itemSize) return Math.ceil(index / itemsPerRow) * itemSize;

        // Finally, accumulate sizes of items 0 - index.
        var space = 0;
        for (var i = 0; i < index; ++i) {
          var _itemSize = this.getSizeOf(i);
          if (isNaN(_itemSize)) break;
          space += _itemSize;
        }
        return space;
      }
    }, {
      key: 'cacheSizes',
      value: function cacheSizes() {
        var cache = this.cache;
        var from = this.state.from;

        var itemEls = _React.findDOMNode(this.items).children;
        var sizeKey = SIZE_KEYS[this.props.axis];
        for (var i = 0, l = itemEls.length; i < l; ++i) {
          cache[from + i] = itemEls[i].getBoundingClientRect()[sizeKey];
        }
      }
    }, {
      key: 'getSizeOf',
      value: function getSizeOf(index) {

        // Try the static itemSize.
        var itemSize = this.state.itemSize;

        if (itemSize) return itemSize;

        // Try the itemSizeGetter.
        var itemSizeGetter = this.props.itemSizeGetter;

        if (itemSizeGetter) return itemSizeGetter(index);

        // Try the cache.
        var cache = this.cache;

        if (cache[index]) return cache[index];

        // We don't know the size.
        return NaN;
      }
    }, {
      key: 'constrainFrom',
      value: function constrainFrom(from, length, itemsPerRow) {
        if (this.props.type === 'simple') return 0;
        if (!from) return 0;
        return Math.max(Math.min(from, length - itemsPerRow - length % itemsPerRow), 0);
      }
    }, {
      key: 'constrainSize',
      value: function constrainSize(size, length, pageSize, from) {
        return Math.min(Math.max(size, pageSize), length - from);
      }
    }, {
      key: 'scrollTo',
      value: function scrollTo(index) {
        this.setScroll(this.getSpaceBefore(index));
      }
    }, {
      key: 'scrollAround',
      value: function scrollAround(index) {
        var current = this.getScroll();

        var max = this.getSpaceBefore(index);
        if (current > max) return this.setScroll(max);

        var min = max - this.getViewportSize() + this.getSizeOf(index);
        if (current < min) this.setScroll(min);
      }
    }, {
      key: 'renderItems',
      value: function renderItems() {
        var _this2 = this;

        var _state3 = this.state;
        var from = _state3.from;
        var size = _state3.size;

        var items = [];
        for (var i = 0; i < size; ++i) {
          items.push(this.props.itemRenderer(from + i, i));
        }
        return this.props.itemsRenderer(items, function (c) {
          return _this2.items = c;
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var items = this.renderItems();
        if (this.props.type === 'simple') return items;

        var axis = this.props.axis;

        var style = { position: 'relative' };
        var size = this.getSpaceBefore(this.props.length);
        style[SIZE_KEYS[axis]] = size;
        if (size && axis === 'x') style.overflowX = 'hidden';
        var offset = this.getSpaceBefore(this.state.from);
        var x = axis === 'x' ? offset : 0;
        var y = axis === 'y' ? offset : 0;
        var transform = 'translate(' + x + 'px, ' + y + 'px)';
        return _React.createElement(
          'div',
          { style: style },
          _React.createElement(
            'div',
            { style: { WebkitTransform: transform, transform: transform } },
            items
          )
        );
      }
    }], [{
      key: 'propTypes',
      value: {
        axis: _React.PropTypes.oneOf(['x', 'y']),
        initialIndex: _React.PropTypes.number,
        itemSizeGetter: _React.PropTypes.func,
        itemRenderer: _React.PropTypes.func,
        itemsRenderer: _React.PropTypes.func,
        length: _React.PropTypes.number,
        pageSize: _React.PropTypes.number,
        simple: _React.PropTypes.bool,
        threshold: _React.PropTypes.number,
        type: _React.PropTypes.oneOf(['simple', 'variable', 'uniform'])
      },
      enumerable: true
    }, {
      key: 'defaultProps',
      value: {
        axis: 'y',
        itemRenderer: function itemRenderer(index, key) {
          return _React.createElement(
            'div',
            { key: key },
            index
          );
        },
        itemsRenderer: function itemsRenderer(items, ref) {
          return _React.createElement(
            'div',
            { ref: ref },
            items
          );
        },
        length: 0,
        pageSize: 10,
        threshold: 100,
        type: 'simple'
      },
      enumerable: true
    }]);

    return _class;
  })(_React.Component);

  module.exports = _default;
});
