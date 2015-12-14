(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'react', 'react-dom'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('react'), require('react-dom'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.React, global.ReactDOM);
    global.ReactList = mod.exports;
  }
})(this, function (exports, module, _react, _reactDom) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var _React = _interopRequireDefault(_react);

  var _ReactDOM = _interopRequireDefault(_reactDom);

  var findDOMNode = _ReactDOM['default'].findDOMNode;

  var isEqualSubset = function isEqualSubset(a, b) {
    for (var key in a) {
      if (a[key] !== b[key]) return false;
    }return true;
  };

  var isEqual = function isEqual(a, b) {
    return isEqualSubset(a, b) && isEqualSubset(b, a);
  };

  var CLIENT_SIZE_KEYS = { x: 'clientWidth', y: 'clientHeight' };
  var CLIENT_START_KEYS = { x: 'clientTop', y: 'clientLeft' };
  var INNER_SIZE_KEYS = { x: 'innerWidth', y: 'innerHeight' };
  var OFFSET_SIZE_KEYS = { x: 'offsetWidth', y: 'offsetHeight' };
  var OFFSET_START_KEYS = { x: 'offsetLeft', y: 'offsetTop' };
  var OVERFLOW_KEYS = { x: 'overflowX', y: 'overflowY' };
  var SCROLL_KEYS = { x: 'scrollLeft', y: 'scrollTop' };
  var SIZE_KEYS = { x: 'width', y: 'height' };

  var NOOP = function NOOP() {};

  var _default = (function (_Component) {
    _inherits(_default, _Component);

    _createClass(_default, null, [{
      key: 'displayName',
      value: 'ReactList',
      enumerable: true
    }, {
      key: 'propTypes',
      value: {
        axis: _react.PropTypes.oneOf(['x', 'y']),
        initialIndex: _react.PropTypes.number,
        itemSizeGetter: _react.PropTypes.func,
        itemRenderer: _react.PropTypes.func,
        itemsRenderer: _react.PropTypes.func,
        length: _react.PropTypes.number,
        pageSize: _react.PropTypes.number,
        scrollParentGetter: _react.PropTypes.func,
        threshold: _react.PropTypes.number,
        type: _react.PropTypes.oneOf(['simple', 'variable', 'uniform']),
        useTranslate3d: _react.PropTypes.bool
      },
      enumerable: true
    }, {
      key: 'defaultProps',
      value: {
        axis: 'y',
        initialIndex: null,
        itemSizeGetter: null,
        itemRenderer: function itemRenderer(index, key) {
          return _React['default'].createElement(
            'div',
            { key: key },
            index
          );
        },
        itemsRenderer: function itemsRenderer(items, ref) {
          return _React['default'].createElement(
            'div',
            { ref: ref },
            items
          );
        },
        length: 0,
        pageSize: 10,
        scrollParentGetter: null,
        threshold: 100,
        type: 'simple',
        useTranslate3d: false
      },
      enumerable: true
    }]);

    function _default(props) {
      _classCallCheck(this, _default);

      _get(Object.getPrototypeOf(_default.prototype), 'constructor', this).call(this, props);
      var _props = this.props;
      var initialIndex = _props.initialIndex;
      var length = _props.length;
      var pageSize = _props.pageSize;

      var itemsPerRow = 1;
      var from = this.constrainFrom(initialIndex, length, itemsPerRow);
      var size = this.constrainSize(pageSize, length, pageSize, from);
      this.state = { from: from, size: size, itemsPerRow: itemsPerRow };
      this.cache = {};
    }

    _createClass(_default, [{
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
        this.updateFrame = this.updateFrame.bind(this);
        window.addEventListener('resize', this.updateFrame);
        this.updateFrame(this.scrollTo.bind(this, this.props.initialIndex));
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
      key: 'getOffset',
      value: function getOffset(el) {
        var axis = this.props.axis;

        var offset = el[CLIENT_START_KEYS[axis]] || 0;
        var offsetKey = OFFSET_START_KEYS[axis];
        do offset += el[offsetKey] || 0; while (el = el.offsetParent);
        return offset;
      }
    }, {
      key: 'getScrollParent',
      value: function getScrollParent() {
        var _props2 = this.props;
        var axis = _props2.axis;
        var scrollParentGetter = _props2.scrollParentGetter;

        if (scrollParentGetter) return scrollParentGetter();
        var el = findDOMNode(this);
        var overflowKey = OVERFLOW_KEYS[axis];
        while (el = el.parentElement) {
          switch (window.getComputedStyle(el)[overflowKey]) {
            case 'auto':case 'scroll':case 'overlay':
              return el;
          }
        }
        return window;
      }
    }, {
      key: 'getScroll',
      value: function getScroll() {
        var scrollParent = this.scrollParent;
        var axis = this.props.axis;

        var scrollKey = SCROLL_KEYS[axis];
        var scroll = scrollParent === window ?
        // Firefox always returns document.body[scrollKey] as 0 and Chrome/Safari
        // always return document.documentElement[scrollKey] as 0, so take
        // whichever has a value.
        document.body[scrollKey] || document.documentElement[scrollKey] : scrollParent[scrollKey];
        var el = findDOMNode(this);
        return scroll - (this.getOffset(el) - this.getOffset(scrollParent));
      }
    }, {
      key: 'setScroll',
      value: function setScroll(offset) {
        var scrollParent = this.scrollParent;

        if (scrollParent === window) {
          return window.scrollTo(0, this.getOffset(findDOMNode(this)) + offset);
        }
        scrollParent[SCROLL_KEYS[this.props.axis]] += offset - this.getScroll();
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
        var threshold = arguments.length <= 0 || arguments[0] === undefined ? this.props.threshold : arguments[0];

        var start = this.getScroll() - threshold;
        var end = start + this.getViewportSize() + threshold * 2;
        return { start: start, end: end };
      }
    }, {
      key: 'getItemSizeAndItemsPerRow',
      value: function getItemSizeAndItemsPerRow() {
        var itemEls = findDOMNode(this.items).children;
        if (!itemEls.length) return {};

        var firstEl = itemEls[0];

        // Firefox has a problem where it will return a *slightly* (less than
        // thousandths of a pixel) different size for the same element between
        // renders. This can cause an infinite render loop, so only change the
        // itemSize when it is significantly different.
        var itemSize = this.state.itemSize;
        var axis = this.props.axis;

        var firstElSize = firstEl[OFFSET_SIZE_KEYS[axis]];
        var delta = Math.abs(firstElSize - itemSize);
        if (isNaN(delta) || delta >= 1) itemSize = firstElSize;

        if (!itemSize) return {};

        var startKey = OFFSET_START_KEYS[axis];
        var firstStart = firstEl[startKey];
        var itemsPerRow = 1;
        for (var item = itemEls[itemsPerRow]; item && item[startKey] === firstStart; item = itemEls[itemsPerRow]) {
          ++itemsPerRow;
        }return { itemSize: itemSize, itemsPerRow: itemsPerRow };
      }
    }, {
      key: 'updateFrame',
      value: function updateFrame(cb) {
        this.updateScrollParent();
        if (typeof cb != 'function') cb = NOOP;
        switch (this.props.type) {
          case 'simple':
            return this.updateSimpleFrame(cb);
          case 'variable':
            return this.updateVariableFrame(cb);
          case 'uniform':
            return this.updateUniformFrame(cb);
        }
      }
    }, {
      key: 'updateScrollParent',
      value: function updateScrollParent() {
        var prev = this.scrollParent;
        this.scrollParent = this.getScrollParent();
        if (prev === this.scrollParent) return;
        if (prev) prev.removeEventListener('scroll', this.updateFrame);
        this.scrollParent.addEventListener('scroll', this.updateFrame);
      }
    }, {
      key: 'updateSimpleFrame',
      value: function updateSimpleFrame(cb) {
        var _getStartAndEnd = this.getStartAndEnd();

        var end = _getStartAndEnd.end;

        var itemEls = findDOMNode(this.items).children;
        var elEnd = 0;

        if (itemEls.length) {
          var axis = this.props.axis;

          var firstItemEl = itemEls[0];
          var lastItemEl = itemEls[itemEls.length - 1];
          elEnd = this.getOffset(lastItemEl) + lastItemEl[OFFSET_SIZE_KEYS[axis]] - this.getOffset(firstItemEl);
        }

        if (elEnd > end) return cb();

        var _props3 = this.props;
        var pageSize = _props3.pageSize;
        var length = _props3.length;

        this.setState({ size: Math.min(this.state.size + pageSize, length) }, cb);
      }
    }, {
      key: 'updateVariableFrame',
      value: function updateVariableFrame(cb) {
        if (!this.props.itemSizeGetter) this.cacheSizes();

        var _getStartAndEnd2 = this.getStartAndEnd();

        var start = _getStartAndEnd2.start;
        var end = _getStartAndEnd2.end;
        var _props4 = this.props;
        var length = _props4.length;
        var pageSize = _props4.pageSize;

        var space = 0;
        var from = 0;
        var size = 0;
        var maxFrom = length - 1;

        while (from < maxFrom) {
          var itemSize = this.getSizeOf(from);
          if (itemSize == null || space + itemSize > start) break;
          space += itemSize;
          ++from;
        }

        var maxSize = length - from;

        while (size < maxSize && space < end) {
          var itemSize = this.getSizeOf(from + size);
          if (itemSize == null) {
            size = Math.min(size + pageSize, maxSize);
            break;
          }
          space += itemSize;
          ++size;
        }

        this.setState({ from: from, size: size }, cb);
      }
    }, {
      key: 'updateUniformFrame',
      value: function updateUniformFrame(cb) {
        var _getItemSizeAndItemsPerRow = this.getItemSizeAndItemsPerRow();

        var itemSize = _getItemSizeAndItemsPerRow.itemSize;
        var itemsPerRow = _getItemSizeAndItemsPerRow.itemsPerRow;

        if (!itemSize || !itemsPerRow) return cb();

        var _props5 = this.props;
        var length = _props5.length;
        var pageSize = _props5.pageSize;

        var _getStartAndEnd3 = this.getStartAndEnd();

        var start = _getStartAndEnd3.start;
        var end = _getStartAndEnd3.end;

        var from = this.constrainFrom(Math.floor(start / itemSize) * itemsPerRow, length, itemsPerRow);

        var size = this.constrainSize((Math.ceil((end - start) / itemSize) + 1) * itemsPerRow, length, pageSize, from);

        return this.setState({ itemsPerRow: itemsPerRow, from: from, itemSize: itemSize, size: size }, cb);
      }
    }, {
      key: 'getSpaceBefore',
      value: function getSpaceBefore(index) {
        var cache = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        if (cache[index] != null) return cache[index];

        // Try the static itemSize.
        var _state2 = this.state;
        var itemSize = _state2.itemSize;
        var itemsPerRow = _state2.itemsPerRow;

        if (itemSize) {
          return cache[index] = Math.ceil(index / itemsPerRow) * itemSize;
        }

        // Find the closest space to index there is a cached value for.
        var from = index;
        while (from > 0 && cache[--from] == null);

        // Finally, accumulate sizes of items from - index.
        var space = cache[from] || 0;
        for (var i = from; i < index; ++i) {
          cache[i] = space;
          var _itemSize = this.getSizeOf(i);
          if (_itemSize == null) break;
          space += _itemSize;
        }

        return cache[index] = space;
      }
    }, {
      key: 'cacheSizes',
      value: function cacheSizes() {
        var cache = this.cache;
        var from = this.state.from;

        var itemEls = findDOMNode(this.items).children;
        var sizeKey = OFFSET_SIZE_KEYS[this.props.axis];
        for (var i = 0, l = itemEls.length; i < l; ++i) {
          cache[from + i] = itemEls[i][sizeKey];
        }
      }
    }, {
      key: 'getSizeOf',
      value: function getSizeOf(index) {
        var cache = this.cache;
        var items = this.items;
        var _props6 = this.props;
        var axis = _props6.axis;
        var itemSizeGetter = _props6.itemSizeGetter;
        var type = _props6.type;
        var _state3 = this.state;
        var from = _state3.from;
        var itemSize = _state3.itemSize;
        var size = _state3.size;

        // Try the static itemSize.
        if (itemSize) return itemSize;

        // Try the itemSizeGetter.
        if (itemSizeGetter) return itemSizeGetter(index);

        // Try the cache.
        if (index in cache) return cache[index];

        // Try the DOM.
        if (type === 'simple' && index >= from && index < from + size && items) {
          var itemEl = findDOMNode(items).children[index - from];
          if (itemEl) return itemEl[OFFSET_SIZE_KEYS[axis]];
        }
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
        if (index != null) this.setScroll(this.getSpaceBefore(index));
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
      key: 'getVisibleRange',
      value: function getVisibleRange() {
        var _state4 = this.state;
        var from = _state4.from;
        var size = _state4.size;

        var _getStartAndEnd4 = this.getStartAndEnd(0);

        var start = _getStartAndEnd4.start;
        var end = _getStartAndEnd4.end;

        var cache = {};
        var first = undefined,
            last = undefined;
        for (var i = from; i < from + size; ++i) {
          var itemStart = this.getSpaceBefore(i, cache);
          var itemEnd = itemStart + this.getSizeOf(i);
          if (first == null && itemEnd > start) first = i;
          if (first != null && itemStart < end) last = i;
        }
        return [first, last];
      }
    }, {
      key: 'renderItems',
      value: function renderItems() {
        var _this = this;

        var _props7 = this.props;
        var itemRenderer = _props7.itemRenderer;
        var itemsRenderer = _props7.itemsRenderer;
        var _state5 = this.state;
        var from = _state5.from;
        var size = _state5.size;

        var items = [];
        for (var i = 0; i < size; ++i) {
          items.push(itemRenderer(from + i, i));
        }return itemsRenderer(items, function (c) {
          return _this.items = c;
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var _props8 = this.props;
        var axis = _props8.axis;
        var length = _props8.length;
        var type = _props8.type;
        var useTranslate3d = _props8.useTranslate3d;
        var from = this.state.from;

        var items = this.renderItems();
        if (type === 'simple') return items;

        var style = { position: 'relative' };
        var cache = {};
        var size = this.getSpaceBefore(length, cache);
        style[SIZE_KEYS[axis]] = size;
        if (size && axis === 'x') style.overflowX = 'hidden';
        var offset = this.getSpaceBefore(from, cache);
        var x = axis === 'x' ? offset : 0;
        var y = axis === 'y' ? offset : 0;
        var transform = useTranslate3d ? 'translate3d(' + x + 'px, ' + y + 'px, 0)' : 'translate(' + x + 'px, ' + y + 'px)';
        var listStyle = {
          msTransform: transform,
          WebkitTransform: transform,
          transform: transform
        };
        return _React['default'].createElement(
          'div',
          { style: style },
          _React['default'].createElement(
            'div',
            { style: listStyle },
            items
          )
        );
      }
    }]);

    return _default;
  })(_react.Component);

  module.exports = _default;
});
