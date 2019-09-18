(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["react", "prop-types"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("react"), require("prop-types"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.React, global.PropTypes);
    global.ReactList = mod.exports;
  }
})(this, function (_react, _propTypes) {
  "use strict";

  _react = _interopRequireWildcard(_react);
  _propTypes = _interopRequireDefault(_propTypes);

  var _class, _temp;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var CLIENT_SIZE_KEYS = {
    x: 'clientWidth',
    y: 'clientHeight'
  };
  var CLIENT_START_KEYS = {
    x: 'clientTop',
    y: 'clientLeft'
  };
  var INNER_SIZE_KEYS = {
    x: 'innerWidth',
    y: 'innerHeight'
  };
  var OFFSET_SIZE_KEYS = {
    x: 'offsetWidth',
    y: 'offsetHeight'
  };
  var OFFSET_START_KEYS = {
    x: 'offsetLeft',
    y: 'offsetTop'
  };
  var OVERFLOW_KEYS = {
    x: 'overflowX',
    y: 'overflowY'
  };
  var SCROLL_SIZE_KEYS = {
    x: 'scrollWidth',
    y: 'scrollHeight'
  };
  var SCROLL_START_KEYS = {
    x: 'scrollLeft',
    y: 'scrollTop'
  };
  var SIZE_KEYS = {
    x: 'width',
    y: 'height'
  };

  var NOOP = function NOOP() {}; // If a browser doesn't support the `options` argument to
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
    } catch (e) {// noop
    }

    return hasSupport;
  }() ? {
    passive: true
  } : false;
  var UNSTABLE_MESSAGE = 'ReactList failed to reach a stable state.';
  var MAX_SYNC_UPDATES = 50;

  var isEqualSubset = function isEqualSubset(a, b) {
    for (var key in b) {
      if (a[key] !== b[key]) return false;
    }

    return true;
  };

  var defaultScrollParentGetter = function defaultScrollParentGetter(component) {
    var axis = component.props.axis;
    var el = component.getEl();
    var overflowKey = OVERFLOW_KEYS[axis];

    while (el = el.parentElement) {
      switch (window.getComputedStyle(el)[overflowKey]) {
        case 'auto':
        case 'scroll':
        case 'overlay':
          return el;
      }
    }

    return window;
  };

  var defaultScrollParentViewportSizeGetter = function defaultScrollParentViewportSizeGetter(component) {
    var axis = component.props.axis;
    var scrollParent = component.scrollParent;
    return scrollParent === window ? window[INNER_SIZE_KEYS[axis]] : scrollParent[CLIENT_SIZE_KEYS[axis]];
  };

  module.exports = (_temp = _class =
  /*#__PURE__*/
  function (_Component) {
    _inherits(ReactList, _Component);

    function ReactList(props) {
      var _this;

      _classCallCheck(this, ReactList);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ReactList).call(this, props));
      var initialIndex = props.initialIndex;
      var itemsPerRow = 1;

      var _this$constrain = _this.constrain(initialIndex, 0, itemsPerRow, props),
          from = _this$constrain.from,
          size = _this$constrain.size;

      _this.state = {
        from: from,
        size: size,
        itemsPerRow: itemsPerRow
      };
      _this.cache = {};
      _this.cachedScrollPosition = null;
      _this.prevPrevState = {};
      _this.unstable = false;
      _this.updateCounter = 0;
      return _this;
    }

    _createClass(ReactList, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.updateFrameAndClearCache = this.updateFrameAndClearCache.bind(this);
        window.addEventListener('resize', this.updateFrameAndClearCache);
        this.updateFrame(this.scrollTo.bind(this, this.props.initialIndex));
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        var _this2 = this;

        // Viewport scroll is no longer useful if axis changes
        if (this.props.axis !== prevProps.axis) this.clearSizeCache();
        var _this$state = this.state,
            from = _this$state.from,
            size = _this$state.size,
            itemsPerRow = _this$state.itemsPerRow;
        this.maybeSetState(this.constrain(from, size, itemsPerRow, this.props), NOOP); // If the list has reached an unstable state, prevent an infinite loop.

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
      key: "maybeSetState",
      value: function maybeSetState(b, cb) {
        if (isEqualSubset(this.state, b)) return cb();
        this.setState(b, cb);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        window.removeEventListener('resize', this.updateFrameAndClearCache);
        this.scrollParent.removeEventListener('scroll', this.updateFrameAndClearCache, PASSIVE);
        this.scrollParent.removeEventListener('mousewheel', NOOP, PASSIVE);
      }
    }, {
      key: "getOffset",
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
      key: "getEl",
      value: function getEl() {
        return this.el || this.items;
      }
    }, {
      key: "getScrollPosition",
      value: function getScrollPosition() {
        // Cache scroll position as this causes a forced synchronous layout.
        if (typeof this.cachedScrollPosition === 'number') {
          return this.cachedScrollPosition;
        }

        var scrollParent = this.scrollParent;
        var axis = this.props.axis;
        var scrollKey = SCROLL_START_KEYS[axis];
        var actual = scrollParent === window ? // Firefox always returns document.body[scrollKey] as 0 and Chrome/Safari
        // always return document.documentElement[scrollKey] as 0, so take
        // whichever has a value.
        document.body[scrollKey] || document.documentElement[scrollKey] : scrollParent[scrollKey];
        var max = this.getScrollSize() - this.props.scrollParentViewportSizeGetter(this);
        var scroll = Math.max(0, Math.min(actual, max));
        var el = this.getEl();
        this.cachedScrollPosition = this.getOffset(scrollParent) + scroll - this.getOffset(el);
        return this.cachedScrollPosition;
      }
    }, {
      key: "setScroll",
      value: function setScroll(offset) {
        var scrollParent = this.scrollParent;
        var axis = this.props.axis;
        offset += this.getOffset(this.getEl());
        if (scrollParent === window) return window.scrollTo(0, offset);
        offset -= this.getOffset(this.scrollParent);
        scrollParent[SCROLL_START_KEYS[axis]] = offset;
      }
    }, {
      key: "getScrollSize",
      value: function getScrollSize() {
        var scrollParent = this.scrollParent;
        var _document = document,
            body = _document.body,
            documentElement = _document.documentElement;
        var key = SCROLL_SIZE_KEYS[this.props.axis];
        return scrollParent === window ? Math.max(body[key], documentElement[key]) : scrollParent[key];
      }
    }, {
      key: "hasDeterminateSize",
      value: function hasDeterminateSize() {
        var _this$props = this.props,
            itemSizeGetter = _this$props.itemSizeGetter,
            type = _this$props.type;
        return type === 'uniform' || itemSizeGetter;
      }
    }, {
      key: "getStartAndEnd",
      value: function getStartAndEnd() {
        var threshold = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.threshold;
        var scroll = this.getScrollPosition();
        var start = Math.max(0, scroll - threshold);
        var end = scroll + this.props.scrollParentViewportSizeGetter(this) + threshold;

        if (this.hasDeterminateSize()) {
          end = Math.min(end, this.getSpaceBefore(this.props.length));
        }

        return {
          start: start,
          end: end
        };
      }
    }, {
      key: "getItemSizeAndItemsPerRow",
      value: function getItemSizeAndItemsPerRow() {
        var _this$props2 = this.props,
            axis = _this$props2.axis,
            useStaticSize = _this$props2.useStaticSize;
        var _this$state2 = this.state,
            itemSize = _this$state2.itemSize,
            itemsPerRow = _this$state2.itemsPerRow;

        if (useStaticSize && itemSize && itemsPerRow) {
          return {
            itemSize: itemSize,
            itemsPerRow: itemsPerRow
          };
        }

        var itemEls = this.items.children;
        if (!itemEls.length) return {};
        var firstEl = itemEls[0]; // Firefox has a problem where it will return a *slightly* (less than
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
        }

        return {
          itemSize: itemSize,
          itemsPerRow: itemsPerRow
        };
      }
    }, {
      key: "clearSizeCache",
      value: function clearSizeCache() {
        this.cachedScrollPosition = null;
      } // Called by 'scroll' and 'resize' events, clears scroll position cache.

    }, {
      key: "updateFrameAndClearCache",
      value: function updateFrameAndClearCache(cb) {
        this.clearSizeCache();
        return this.updateFrame(cb);
      }
    }, {
      key: "updateFrame",
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
      key: "updateScrollParent",
      value: function updateScrollParent() {
        var prev = this.scrollParent;
        this.scrollParent = this.props.scrollParentGetter(this);
        if (prev === this.scrollParent) return;

        if (prev) {
          prev.removeEventListener('scroll', this.updateFrameAndClearCache);
          prev.removeEventListener('mousewheel', NOOP);
        } // If we have a new parent, cached parent dimensions are no longer useful.


        this.clearSizeCache();
        this.scrollParent.addEventListener('scroll', this.updateFrameAndClearCache, PASSIVE); // You have to attach mousewheel listener to the scrollable element.
        // Just an empty listener. After that onscroll events will be fired synchronously.

        this.scrollParent.addEventListener('mousewheel', NOOP, PASSIVE);
      }
    }, {
      key: "updateSimpleFrame",
      value: function updateSimpleFrame(cb) {
        var _this$getStartAndEnd = this.getStartAndEnd(),
            end = _this$getStartAndEnd.end;

        var itemEls = this.items.children;
        var elEnd = 0;

        if (itemEls.length) {
          var axis = this.props.axis;
          var firstItemEl = itemEls[0];
          var lastItemEl = itemEls[itemEls.length - 1];
          elEnd = this.getOffset(lastItemEl) + lastItemEl[OFFSET_SIZE_KEYS[axis]] - this.getOffset(firstItemEl);
        }

        if (elEnd > end) return cb();
        var _this$props3 = this.props,
            pageSize = _this$props3.pageSize,
            length = _this$props3.length;
        var size = Math.min(this.state.size + pageSize, length);
        this.maybeSetState({
          size: size
        }, cb);
      }
    }, {
      key: "updateVariableFrame",
      value: function updateVariableFrame(cb) {
        if (!this.props.itemSizeGetter) this.cacheSizes();

        var _this$getStartAndEnd2 = this.getStartAndEnd(),
            start = _this$getStartAndEnd2.start,
            end = _this$getStartAndEnd2.end;

        var _this$props4 = this.props,
            length = _this$props4.length,
            pageSize = _this$props4.pageSize;
        var space = 0;
        var from = 0;
        var size = 0;
        var maxFrom = length - 1;

        while (from < maxFrom) {
          var itemSize = this.getSizeOfItem(from);
          if (itemSize == null || space + itemSize > start) break;
          space += itemSize;
          ++from;
        }

        var maxSize = length - from;

        while (size < maxSize && space < end) {
          var _itemSize = this.getSizeOfItem(from + size);

          if (_itemSize == null) {
            size = Math.min(size + pageSize, maxSize);
            break;
          }

          space += _itemSize;
          ++size;
        }

        this.maybeSetState({
          from: from,
          size: size
        }, cb);
      }
    }, {
      key: "updateUniformFrame",
      value: function updateUniformFrame(cb) {
        var _this$getItemSizeAndI = this.getItemSizeAndItemsPerRow(),
            itemSize = _this$getItemSizeAndI.itemSize,
            itemsPerRow = _this$getItemSizeAndI.itemsPerRow;

        if (!itemSize || !itemsPerRow) return cb();

        var _this$getStartAndEnd3 = this.getStartAndEnd(),
            start = _this$getStartAndEnd3.start,
            end = _this$getStartAndEnd3.end;

        var _this$constrain2 = this.constrain(Math.floor(start / itemSize) * itemsPerRow, (Math.ceil((end - start) / itemSize) + 1) * itemsPerRow, itemsPerRow, this.props),
            from = _this$constrain2.from,
            size = _this$constrain2.size;

        return this.maybeSetState({
          itemsPerRow: itemsPerRow,
          from: from,
          itemSize: itemSize,
          size: size
        }, cb);
      }
    }, {
      key: "getSpaceBefore",
      value: function getSpaceBefore(index) {
        var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        if (cache[index] != null) return cache[index]; // Try the static itemSize.

        var _this$state3 = this.state,
            itemSize = _this$state3.itemSize,
            itemsPerRow = _this$state3.itemsPerRow;

        if (itemSize) {
          return cache[index] = Math.floor(index / itemsPerRow) * itemSize;
        } // Find the closest space to index there is a cached value for.


        var from = index;

        while (from > 0 && cache[--from] == null) {
          ;
        } // Finally, accumulate sizes of items from - index.


        var space = cache[from] || 0;

        for (var i = from; i < index; ++i) {
          cache[i] = space;

          var _itemSize2 = this.getSizeOfItem(i);

          if (_itemSize2 == null) break;
          space += _itemSize2;
        }

        return cache[index] = space;
      }
    }, {
      key: "cacheSizes",
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
      key: "getSizeOfItem",
      value: function getSizeOfItem(index) {
        var cache = this.cache,
            items = this.items;
        var _this$props5 = this.props,
            axis = _this$props5.axis,
            itemSizeGetter = _this$props5.itemSizeGetter,
            itemSizeEstimator = _this$props5.itemSizeEstimator,
            type = _this$props5.type;
        var _this$state4 = this.state,
            from = _this$state4.from,
            itemSize = _this$state4.itemSize,
            size = _this$state4.size; // Try the static itemSize.

        if (itemSize) return itemSize; // Try the itemSizeGetter.

        if (itemSizeGetter) return itemSizeGetter(index); // Try the cache.

        if (index in cache) return cache[index]; // Try the DOM.

        if (type === 'simple' && index >= from && index < from + size && items) {
          var itemEl = items.children[index - from];
          if (itemEl) return itemEl[OFFSET_SIZE_KEYS[axis]];
        } // Try the itemSizeEstimator.


        if (itemSizeEstimator) return itemSizeEstimator(index, cache);
      }
    }, {
      key: "constrain",
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

        return {
          from: from,
          size: size
        };
      }
    }, {
      key: "scrollTo",
      value: function scrollTo(index) {
        if (index != null) this.setScroll(this.getSpaceBefore(index));
      }
    }, {
      key: "scrollAround",
      value: function scrollAround(index) {
        var current = this.getScrollPosition();
        var bottom = this.getSpaceBefore(index);
        var top = bottom - this.props.scrollParentViewportSizeGetter(this) + this.getSizeOfItem(index);
        var min = Math.min(top, bottom);
        var max = Math.max(top, bottom);
        if (current <= min) return this.setScroll(min);
        if (current > max) return this.setScroll(max);
      }
    }, {
      key: "getVisibleRange",
      value: function getVisibleRange() {
        var _this$state5 = this.state,
            from = _this$state5.from,
            size = _this$state5.size;

        var _this$getStartAndEnd4 = this.getStartAndEnd(0),
            start = _this$getStartAndEnd4.start,
            end = _this$getStartAndEnd4.end;

        var cache = {};
        var first, last;

        for (var i = from; i < from + size; ++i) {
          var itemStart = this.getSpaceBefore(i, cache);
          var itemEnd = itemStart + this.getSizeOfItem(i);
          if (first == null && itemEnd > start) first = i;
          if (first != null && itemStart < end) last = i;
        }

        return [first, last];
      }
    }, {
      key: "renderItems",
      value: function renderItems() {
        var _this3 = this;

        var _this$props6 = this.props,
            itemRenderer = _this$props6.itemRenderer,
            itemsRenderer = _this$props6.itemsRenderer;
        var _this$state6 = this.state,
            from = _this$state6.from,
            size = _this$state6.size;
        var items = [];

        for (var i = 0; i < size; ++i) {
          items.push(itemRenderer(from + i, i));
        }

        return itemsRenderer(items, function (c) {
          return _this3.items = c;
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this4 = this;

        var _this$props7 = this.props,
            axis = _this$props7.axis,
            length = _this$props7.length,
            type = _this$props7.type,
            useTranslate3d = _this$props7.useTranslate3d;
        var _this$state7 = this.state,
            from = _this$state7.from,
            itemsPerRow = _this$state7.itemsPerRow;
        var items = this.renderItems();
        if (type === 'simple') return items;
        var style = {
          position: 'relative'
        };
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
        var transform = useTranslate3d ? "translate3d(".concat(x, "px, ").concat(y, "px, 0)") : "translate(".concat(x, "px, ").concat(y, "px)");
        var listStyle = {
          msTransform: transform,
          WebkitTransform: transform,
          transform: transform
        };
        return _react["default"].createElement("div", {
          style: style,
          ref: function ref(c) {
            return _this4.el = c;
          }
        }, _react["default"].createElement("div", {
          style: listStyle
        }, items));
      }
    }]);

    return ReactList;
  }(_react.Component), _defineProperty(_class, "displayName", 'ReactList'), _defineProperty(_class, "propTypes", {
    axis: _propTypes["default"].oneOf(['x', 'y']),
    initialIndex: _propTypes["default"].number,
    itemRenderer: _propTypes["default"].func,
    itemSizeEstimator: _propTypes["default"].func,
    itemSizeGetter: _propTypes["default"].func,
    itemsRenderer: _propTypes["default"].func,
    length: _propTypes["default"].number,
    minSize: _propTypes["default"].number,
    pageSize: _propTypes["default"].number,
    scrollParentGetter: _propTypes["default"].func,
    scrollParentViewportSizeGetter: _propTypes["default"].func,
    threshold: _propTypes["default"].number,
    type: _propTypes["default"].oneOf(['simple', 'variable', 'uniform']),
    useStaticSize: _propTypes["default"].bool,
    useTranslate3d: _propTypes["default"].bool
  }), _defineProperty(_class, "defaultProps", {
    axis: 'y',
    itemRenderer: function itemRenderer(index, key) {
      return _react["default"].createElement("div", {
        key: key
      }, index);
    },
    itemsRenderer: function itemsRenderer(items, ref) {
      return _react["default"].createElement("div", {
        ref: ref
      }, items);
    },
    length: 0,
    minSize: 1,
    pageSize: 10,
    scrollParentGetter: defaultScrollParentGetter,
    scrollParentViewportSizeGetter: defaultScrollParentViewportSizeGetter,
    threshold: 100,
    type: 'simple',
    useStaticSize: false,
    useTranslate3d: false
  }), _temp);
});
