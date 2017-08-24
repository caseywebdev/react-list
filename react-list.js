(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'prop-types', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('prop-types'), require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.PropTypes, global.React);
    global.ReactList = mod.exports;
  }
})(this, function (_module2, _propTypes, _react) {
  'use strict';

  var _module3 = _interopRequireDefault(_module2);

  var _propTypes2 = _interopRequireDefault(_propTypes);

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var _class, _temp;

  var CLIENT_SIZE_KEYS = { x: 'clientWidth', y: 'clientHeight' };
  var CLIENT_START_KEYS = { x: 'clientTop', y: 'clientLeft' };
  var INNER_SIZE_KEYS = { x: 'innerWidth', y: 'innerHeight' };
  var OFFSET_SIZE_KEYS = { x: 'offsetWidth', y: 'offsetHeight' };
  var OFFSET_START_KEYS = { x: 'offsetLeft', y: 'offsetTop' };
  var OVERFLOW_KEYS = { x: 'overflowX', y: 'overflowY' };
  var SCROLL_SIZE_KEYS = { x: 'scrollWidth', y: 'scrollHeight' };
  var SCROLL_START_KEYS = { x: 'scrollLeft', y: 'scrollTop' };
  var SIZE_KEYS = { x: 'width', y: 'height' };

  var NOOP = function NOOP() {};

  // If a browser doesn't support the `options` argument to
  // add/removeEventListener, we need to check, otherwise we will
  // accidentally set `capture` with a truthy value.
  var PASSIVE = function () {
    if (typeof window === 'undefined') return false;
    var hasSupport = false;
    try {
      document.createElement('div').addEventListener('test', NOOP, {
        get passive() {
          hasSupport = true;
          return false;
        }
      });
    } catch (e) {}
    return hasSupport;
  }() ? { passive: true } : false;

  var UNSTABLE_MESSAGE = 'ReactList failed to reach a stable state.';
  var MAX_SYNC_UPDATES = 100;

  var isEqualSubset = function isEqualSubset(a, b) {
    for (var key in b) {
      if (a[key] !== b[key]) return false;
    }return true;
  };

  _module3.default.exports = (_temp = _class = function (_Component) {
    _inherits(ReactList, _Component);

    function ReactList(props) {
      _classCallCheck(this, ReactList);

      var _this = _possibleConstructorReturn(this, (ReactList.__proto__ || Object.getPrototypeOf(ReactList)).call(this, props));

      var initialIndex = props.initialIndex;

      var itemsPerRow = 1;

      var _this$constrain = _this.constrain(initialIndex, 0, itemsPerRow, props),
          from = _this$constrain.from,
          size = _this$constrain.size;

      _this.state = { from: from, size: size, itemsPerRow: itemsPerRow };
      _this.cache = {};
      _this.prevPrevState = {};
      _this.unstable = false;
      _this.updateCounter = 0;
      return _this;
    }

    _createClass(ReactList, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(next) {
        var _state = this.state,
            from = _state.from,
            size = _state.size,
            itemsPerRow = _state.itemsPerRow;

        this.maybeSetState(this.constrain(from, size, itemsPerRow, next), NOOP);
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.updateFrame = this.updateFrame.bind(this);
        window.addEventListener('resize', this.updateFrame);
        this.updateFrame(this.scrollTo.bind(this, this.props.initialIndex));
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        var _this2 = this;

        // If the list has reached an unstable state, prevent an infinite loop.
        if (this.unstable) return;

        if (++this.updateCounter > MAX_SYNC_UPDATES) {
          this.unstable = true;
          return console.error(UNSTABLE_MESSAGE);
        }

        if (!this.updateCounterTimeoutId) {
          this.updateCounterTimeoutId = setTimeout(function () {
            _this2.updateCounter = 0;
            delete _this2.updateCounterTimeoutId;
          }, 0);
        }

        this.updateFrame();
      }
    }, {
      key: 'maybeSetState',
      value: function maybeSetState(b, cb) {
        if (isEqualSubset(this.state, b)) return cb();

        this.setState(b, cb);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        window.removeEventListener('resize', this.updateFrame);
        this.scrollParent.removeEventListener('scroll', this.updateFrame, PASSIVE);
        this.scrollParent.removeEventListener('mousewheel', NOOP, PASSIVE);
      }
    }, {
      key: 'getOffset',
      value: function getOffset(el) {
        var axis = this.props.axis;

        var offset = el[CLIENT_START_KEYS[axis]] || 0;
        var offsetKey = OFFSET_START_KEYS[axis];
        do {
          offset += el[offsetKey] || 0;
        } while (el = el.offsetParent);
        return offset;
      }
    }, {
      key: 'getEl',
      value: function getEl() {
        return this.el || this.items;
      }
    }, {
      key: 'getScrollParent',
      value: function getScrollParent() {
        var _props = this.props,
            axis = _props.axis,
            scrollParentGetter = _props.scrollParentGetter;

        if (scrollParentGetter) return scrollParentGetter();
        var el = this.getEl();
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

        var scrollKey = SCROLL_START_KEYS[axis];
        var actual = scrollParent === window ?
        // Firefox always returns document.body[scrollKey] as 0 and Chrome/Safari
        // always return document.documentElement[scrollKey] as 0, so take
        // whichever has a value.
        document.body[scrollKey] || document.documentElement[scrollKey] : scrollParent[scrollKey];
        var max = this.getScrollSize() - this.getViewportSize();
        var scroll = Math.max(0, Math.min(actual, max));
        var el = this.getEl();
        return this.getOffset(scrollParent) + scroll - this.getOffset(el);
      }
    }, {
      key: 'setScroll',
      value: function setScroll(offset) {
        var scrollParent = this.scrollParent;
        var axis = this.props.axis;

        offset += this.getOffset(this.getEl());
        if (scrollParent === window) return window.scrollTo(0, offset);

        offset -= this.getOffset(this.scrollParent);
        scrollParent[SCROLL_START_KEYS[axis]] = offset;
      }
    }, {
      key: 'getViewportSize',
      value: function getViewportSize() {
        var scrollParent = this.scrollParent;
        var axis = this.props.axis;

        return scrollParent === window ? window[INNER_SIZE_KEYS[axis]] : scrollParent[CLIENT_SIZE_KEYS[axis]];
      }
    }, {
      key: 'getScrollSize',
      value: function getScrollSize() {
        var scrollParent = this.scrollParent;
        var _document = document,
            body = _document.body,
            documentElement = _document.documentElement;

        var key = SCROLL_SIZE_KEYS[this.props.axis];
        return scrollParent === window ? Math.max(body[key], documentElement[key]) : scrollParent[key];
      }
    }, {
      key: 'hasDeterminateSize',
      value: function hasDeterminateSize() {
        var _props2 = this.props,
            itemSizeGetter = _props2.itemSizeGetter,
            type = _props2.type;

        return type === 'uniform' || itemSizeGetter;
      }
    }, {
      key: 'getStartAndEnd',
      value: function getStartAndEnd() {
        var threshold = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.threshold;

        var scroll = this.getScroll();
        var start = Math.max(0, scroll - threshold);
        var end = scroll + this.getViewportSize() + threshold;
        if (this.hasDeterminateSize()) {
          end = Math.min(end, this.getSpaceBefore(this.props.length));
        }
        return { start: start, end: end };
      }
    }, {
      key: 'getItemSizeAndItemsPerRow',
      value: function getItemSizeAndItemsPerRow() {
        var _props3 = this.props,
            axis = _props3.axis,
            useStaticSize = _props3.useStaticSize;
        var _state2 = this.state,
            itemSize = _state2.itemSize,
            itemsPerRow = _state2.itemsPerRow;

        if (useStaticSize && itemSize && itemsPerRow) {
          return { itemSize: itemSize, itemsPerRow: itemsPerRow };
        }

        var itemEls = this.items.children;
        if (!itemEls.length) return {};

        var firstEl = itemEls[0];

        // Firefox has a problem where it will return a *slightly* (less than
        // thousandths of a pixel) different size for the same element between
        // renders. This can cause an infinite render loop, so only change the
        // itemSize when it is significantly different.
        var firstElSize = firstEl[OFFSET_SIZE_KEYS[axis]];
        var delta = Math.abs(firstElSize - itemSize);
        if (isNaN(delta) || delta >= 1) itemSize = firstElSize;

        if (!itemSize) return {};

        var startKey = OFFSET_START_KEYS[axis];
        var firstStart = firstEl[startKey];
        itemsPerRow = 1;
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
        if (prev) {
          prev.removeEventListener('scroll', this.updateFrame);
          prev.removeEventListener('mousewheel', NOOP);
        }
        this.scrollParent.addEventListener('scroll', this.updateFrame, PASSIVE);
        this.scrollParent.addEventListener('mousewheel', NOOP, PASSIVE);
      }
    }, {
      key: 'updateSimpleFrame',
      value: function updateSimpleFrame(cb) {
        var _getStartAndEnd = this.getStartAndEnd(),
            end = _getStartAndEnd.end;

        var itemEls = this.items.children;
        var elEnd = 0;

        if (itemEls.length) {
          var axis = this.props.axis;

          var firstItemEl = itemEls[0];
          var lastItemEl = itemEls[itemEls.length - 1];
          elEnd = this.getOffset(lastItemEl) + lastItemEl[OFFSET_SIZE_KEYS[axis]] - this.getOffset(firstItemEl);
        }

        if (elEnd > end) return cb();

        var _props4 = this.props,
            pageSize = _props4.pageSize,
            length = _props4.length;

        var size = Math.min(this.state.size + pageSize, length);
        this.maybeSetState({ size: size }, cb);
      }
    }, {
      key: 'updateVariableFrame',
      value: function updateVariableFrame(cb) {
        if (!this.props.itemSizeGetter) this.cacheSizes();

        var _getStartAndEnd2 = this.getStartAndEnd(),
            start = _getStartAndEnd2.start,
            end = _getStartAndEnd2.end;

        var _props5 = this.props,
            length = _props5.length,
            pageSize = _props5.pageSize;

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
          var _itemSize = this.getSizeOf(from + size);
          if (_itemSize == null) {
            size = Math.min(size + pageSize, maxSize);
            break;
          }
          space += _itemSize;
          ++size;
        }

        this.maybeSetState({ from: from, size: size }, cb);
      }
    }, {
      key: 'updateUniformFrame',
      value: function updateUniformFrame(cb) {
        var _getItemSizeAndItemsP = this.getItemSizeAndItemsPerRow(),
            itemSize = _getItemSizeAndItemsP.itemSize,
            itemsPerRow = _getItemSizeAndItemsP.itemsPerRow;

        if (!itemSize || !itemsPerRow) return cb();

        var _getStartAndEnd3 = this.getStartAndEnd(),
            start = _getStartAndEnd3.start,
            end = _getStartAndEnd3.end;

        var _constrain = this.constrain(Math.floor(start / itemSize) * itemsPerRow, (Math.ceil((end - start) / itemSize) + 1) * itemsPerRow, itemsPerRow, this.props),
            from = _constrain.from,
            size = _constrain.size;

        return this.maybeSetState({ itemsPerRow: itemsPerRow, from: from, itemSize: itemSize, size: size }, cb);
      }
    }, {
      key: 'getSpaceBefore',
      value: function getSpaceBefore(index) {
        var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (cache[index] != null) return cache[index];

        // Try the static itemSize.
        var _state3 = this.state,
            itemSize = _state3.itemSize,
            itemsPerRow = _state3.itemsPerRow;

        if (itemSize) {
          return cache[index] = Math.floor(index / itemsPerRow) * itemSize;
        }

        // Find the closest space to index there is a cached value for.
        var from = index;
        while (from > 0 && cache[--from] == null) {}

        // Finally, accumulate sizes of items from - index.
        var space = cache[from] || 0;
        for (var i = from; i < index; ++i) {
          cache[i] = space;
          var _itemSize2 = this.getSizeOf(i);
          if (_itemSize2 == null) break;
          space += _itemSize2;
        }

        return cache[index] = space;
      }
    }, {
      key: 'cacheSizes',
      value: function cacheSizes() {
        var cache = this.cache;
        var from = this.state.from;

        var itemEls = this.items.children;
        var sizeKey = OFFSET_SIZE_KEYS[this.props.axis];
        for (var i = 0, l = itemEls.length; i < l; ++i) {
          cache[from + i] = itemEls[i][sizeKey];
        }
      }
    }, {
      key: 'getSizeOf',
      value: function getSizeOf(index) {
        var cache = this.cache,
            items = this.items;
        var _props6 = this.props,
            axis = _props6.axis,
            itemSizeGetter = _props6.itemSizeGetter,
            itemSizeEstimator = _props6.itemSizeEstimator,
            type = _props6.type;
        var _state4 = this.state,
            from = _state4.from,
            itemSize = _state4.itemSize,
            size = _state4.size;


        // Try the static itemSize.
        if (itemSize) return itemSize;

        // Try the itemSizeGetter.
        if (itemSizeGetter) return itemSizeGetter(index);

        // Try the cache.
        if (index in cache) return cache[index];

        // Try the DOM.
        if (type === 'simple' && index >= from && index < from + size && items) {
          var itemEl = items.children[index - from];
          if (itemEl) return itemEl[OFFSET_SIZE_KEYS[axis]];
        }

        // Try the itemSizeEstimator.
        if (itemSizeEstimator) return itemSizeEstimator(index, cache);
      }
    }, {
      key: 'constrain',
      value: function constrain(from, size, itemsPerRow, _ref) {
        var length = _ref.length,
            minSize = _ref.minSize,
            type = _ref.type;

        size = Math.max(size, minSize);
        var mod = size % itemsPerRow;
        if (mod) size += itemsPerRow - mod;
        if (size > length) size = length;
        from = type === 'simple' || !from ? 0 : Math.max(Math.min(from, length - size), 0);

        if (mod = from % itemsPerRow) {
          from -= mod;
          size += mod;
        }

        return { from: from, size: size };
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
        var bottom = this.getSpaceBefore(index);
        var top = bottom - this.getViewportSize() + this.getSizeOf(index);
        var min = Math.min(top, bottom);
        var max = Math.max(top, bottom);
        if (current <= min) return this.setScroll(min);
        if (current > max) return this.setScroll(max);
      }
    }, {
      key: 'getVisibleRange',
      value: function getVisibleRange() {
        var _state5 = this.state,
            from = _state5.from,
            size = _state5.size;

        var _getStartAndEnd4 = this.getStartAndEnd(0),
            start = _getStartAndEnd4.start,
            end = _getStartAndEnd4.end;

        var cache = {};
        var first = void 0,
            last = void 0;
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
        var _this3 = this;

        var _props7 = this.props,
            itemRenderer = _props7.itemRenderer,
            itemsRenderer = _props7.itemsRenderer;
        var _state6 = this.state,
            from = _state6.from,
            size = _state6.size;

        var items = [];
        for (var i = 0; i < size; ++i) {
          items.push(itemRenderer(from + i, i));
        }return itemsRenderer(items, function (c) {
          return _this3.items = c;
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var _this4 = this;

        var _props8 = this.props,
            axis = _props8.axis,
            length = _props8.length,
            type = _props8.type,
            useTranslate3d = _props8.useTranslate3d;
        var _state7 = this.state,
            from = _state7.from,
            itemsPerRow = _state7.itemsPerRow;


        var items = this.renderItems();
        if (type === 'simple') return items;

        var style = { position: 'relative' };
        var cache = {};
        var bottom = Math.ceil(length / itemsPerRow) * itemsPerRow;
        var size = this.getSpaceBefore(bottom, cache);
        if (size) {
          style[SIZE_KEYS[axis]] = size;
          if (axis === 'x') style.overflowX = 'hidden';
        }
        var offset = this.getSpaceBefore(from, cache);
        var x = axis === 'x' ? offset : 0;
        var y = axis === 'y' ? offset : 0;
        var transform = useTranslate3d ? 'translate3d(' + x + 'px, ' + y + 'px, 0)' : 'translate(' + x + 'px, ' + y + 'px)';
        var listStyle = {
          msTransform: transform,
          WebkitTransform: transform,
          transform: transform
        };
        return _react2.default.createElement(
          'div',
          _extends({ style: style }, { ref: function ref(c) {
              return _this4.el = c;
            } }),
          _react2.default.createElement(
            'div',
            { style: listStyle },
            items
          )
        );
      }
    }]);

    return ReactList;
  }(_react.Component), _class.displayName = 'ReactList', _class.propTypes = {
    axis: _propTypes2.default.oneOf(['x', 'y']),
    initialIndex: _propTypes2.default.number,
    itemRenderer: _propTypes2.default.func,
    itemSizeEstimator: _propTypes2.default.func,
    itemSizeGetter: _propTypes2.default.func,
    itemsRenderer: _propTypes2.default.func,
    length: _propTypes2.default.number,
    minSize: _propTypes2.default.number,
    pageSize: _propTypes2.default.number,
    scrollParentGetter: _propTypes2.default.func,
    threshold: _propTypes2.default.number,
    type: _propTypes2.default.oneOf(['simple', 'variable', 'uniform']),
    useStaticSize: _propTypes2.default.bool,
    useTranslate3d: _propTypes2.default.bool
  }, _class.defaultProps = {
    axis: 'y',
    itemRenderer: function itemRenderer(index, key) {
      return _react2.default.createElement(
        'div',
        { key: key },
        index
      );
    },
    itemsRenderer: function itemsRenderer(items, ref) {
      return _react2.default.createElement(
        'div',
        { ref: ref },
        items
      );
    },
    length: 0,
    minSize: 1,
    pageSize: 10,
    threshold: 100,
    type: 'simple',
    useStaticSize: false,
    useTranslate3d: false
  }, _temp);
});
