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

  var _default = (function (_React$Component) {
    var _class = function _default() {
      _classCallCheck(this, _class);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }

      this.state = {
        from: this.props.initialIndex || 0,
        itemHeight: 0,
        itemsPerRow: 1,
        size: this.props.pageSize
      };
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

        from = Math.max(Math.min(from, this.getMaxFrom(length, itemsPerRow)), 0);
        size = Math.min(Math.max(size, 1), length - from);
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
        while (el = el.parentElement) {
          var overflowY = window.getComputedStyle(el).overflowY;
          if (overflowY === 'auto' || overflowY === 'scroll') return el;
        }
        return window;
      }
    }, {
      key: 'getScroll',
      value: function getScroll() {
        var scrollParent = this.scrollParent;

        var elTop = _React.findDOMNode(this).getBoundingClientRect().top;
        if (scrollParent === window) return -elTop;
        var scrollParentTop = scrollParent.getBoundingClientRect().top;
        return scrollParentTop + scrollParent.clientTop - elTop;
      }
    }, {
      key: 'setScroll',
      value: function setScroll(y) {
        var scrollParent = this.scrollParent;

        if (scrollParent === window) {
          var elTop = _React.findDOMNode(this).getBoundingClientRect().top;
          var windowTop = document.documentElement.getBoundingClientRect().top;
          return window.scrollTo(0, Math.round(elTop) - windowTop + y);
        }
        scrollParent.scrollTop += y - this.getScroll();
      }
    }, {
      key: 'getViewportHeight',
      value: function getViewportHeight() {
        var scrollParent = this.scrollParent;
        var innerHeight = scrollParent.innerHeight;
        var clientHeight = scrollParent.clientHeight;

        return scrollParent === window ? innerHeight : clientHeight;
      }
    }, {
      key: 'getTopAndBottom',
      value: function getTopAndBottom() {
        var threshold = this.props.threshold;

        var top = Math.max(0, this.getScroll() - threshold);
        var bottom = top + this.getViewportHeight() + threshold * 2;
        return { top: top, bottom: bottom };
      }
    }, {
      key: 'getItemHeightAndItemsPerRow',
      value: function getItemHeightAndItemsPerRow() {
        var itemEls = _React.findDOMNode(this.items).children;
        if (!itemEls.length) return {};

        var firstRect = itemEls[0].getBoundingClientRect();

        // Firefox has a problem where it will return a *slightly* (less than
        // thousandths of a pixel) different height for the same element between
        // renders. This can cause an infinite render loop, so only change the
        // itemHeight when it is significantly different.
        var itemHeight = this.state.itemHeight;
        if (Math.round(firstRect.height) !== Math.round(itemHeight)) {
          itemHeight = firstRect.height;
        }

        if (!itemHeight) return {};

        var firstRowBottom = Math.round(firstRect.bottom);
        var itemsPerRow = 1;
        for (var item = itemEls[itemsPerRow]; item && Math.round(item.getBoundingClientRect().top) < firstRowBottom; item = itemEls[itemsPerRow]) {
          ++itemsPerRow;
        }return { itemHeight: itemHeight, itemsPerRow: itemsPerRow };
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
        var _getTopAndBottom = this.getTopAndBottom();

        var bottom = _getTopAndBottom.bottom;

        var elHeight = _React.findDOMNode(this).getBoundingClientRect().height;

        if (elHeight > bottom) return;

        var _props = this.props;
        var pageSize = _props.pageSize;
        var length = _props.length;

        this.setState({ size: Math.min(this.state.size + pageSize, length) });
      }
    }, {
      key: 'updateVariableFrame',
      value: function updateVariableFrame() {
        if (!this.props.itemHeightGetter) this.cacheHeights();

        var _getTopAndBottom2 = this.getTopAndBottom();

        var top = _getTopAndBottom2.top;
        var bottom = _getTopAndBottom2.bottom;
        var _props2 = this.props;
        var length = _props2.length;
        var pageSize = _props2.pageSize;

        var space = 0;
        var from = 0;
        var size = 0;
        var maxFrom = length - 1;

        while (from < maxFrom) {
          var height = this.getHeightOf(from);
          if (isNaN(height) || space + height > top) break;
          space += height;
          ++from;
        }

        var maxSize = length - from;

        while (size < maxSize && space < bottom) {
          var height = this.getHeightOf(from + size);
          if (isNaN(height)) {
            size += pageSize;
            break;
          }
          space += height;
          ++size;
        }

        this.setState({ from: from, size: size });
      }
    }, {
      key: 'updateUniformFrame',
      value: function updateUniformFrame() {
        var _getItemHeightAndItemsPerRow = this.getItemHeightAndItemsPerRow();

        var itemHeight = _getItemHeightAndItemsPerRow.itemHeight;
        var itemsPerRow = _getItemHeightAndItemsPerRow.itemsPerRow;

        if (!itemHeight || !itemsPerRow) return;

        var length = this.props.length;

        var _getTopAndBottom3 = this.getTopAndBottom();

        var top = _getTopAndBottom3.top;
        var bottom = _getTopAndBottom3.bottom;

        var from = Math.min(Math.floor(top / itemHeight) * itemsPerRow, this.getMaxFrom(length, itemsPerRow));

        var size = Math.min((Math.ceil((bottom - top) / itemHeight) + 1) * itemsPerRow, length - from);

        return this.setState({ itemsPerRow: itemsPerRow, from: from, itemHeight: itemHeight, size: size });
      }
    }, {
      key: 'getSpaceBefore',
      value: function getSpaceBefore(index) {

        // Try the static itemHeight.
        var _state2 = this.state;
        var itemHeight = _state2.itemHeight;
        var itemsPerRow = _state2.itemsPerRow;

        if (itemHeight) return Math.ceil(index / itemsPerRow) * itemHeight;

        // Finally, accumulate heights of items 0 - index.
        var height = 0;
        for (var i = 0; i < index; ++i) {
          var _itemHeight = this.getHeightOf(i);
          if (isNaN(_itemHeight)) break;
          height += _itemHeight;
        }
        return height;
      }
    }, {
      key: 'cacheHeights',
      value: function cacheHeights() {
        var cache = this.cache;
        var from = this.state.from;

        var itemEls = _React.findDOMNode(this.items).children;
        for (var i = 0, l = itemEls.length; i < l; ++i) {
          var index = from + i;
          if (cache[index]) continue;
          cache[index] = itemEls[i].getBoundingClientRect().height;
        }
      }
    }, {
      key: 'getHeightOf',
      value: function getHeightOf(index) {

        // Try the static itemHeight.
        var itemHeight = this.state.itemHeight;

        if (itemHeight) return itemHeight;

        // Try the itemHeightGetter.
        var itemHeightGetter = this.props.itemHeightGetter;

        if (itemHeightGetter) return itemHeightGetter(index);

        // Try the cache.
        var cache = this.cache;

        if (cache[index]) return cache[index];

        // We don't know the height.
        return NaN;
      }
    }, {
      key: 'getMaxFrom',
      value: function getMaxFrom(length, itemsPerRow) {
        if (this.props.type === 'simple') return 0;
        return Math.max(0, length - itemsPerRow - length % itemsPerRow);
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

        var min = max - this.getViewportHeight() + this.getHeightOf(index);
        if (current < min) this.setScroll(min);
      }
    }, {
      key: 'renderItems',
      value: function renderItems() {
        var _this = this;

        var _state3 = this.state;
        var from = _state3.from;
        var size = _state3.size;

        var items = [];
        for (var i = 0; i < size; ++i) {
          items.push(this.props.itemRenderer(from + i, i));
        }
        return this.props.itemsRenderer(items, function (c) {
          return _this.items = c;
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var items = this.renderItems();
        if (this.props.type === 'simple') return items;

        var height = this.getSpaceBefore(this.props.length);
        var offset = this.getSpaceBefore(this.state.from);
        var transform = 'translate(0, ' + offset + 'px)';
        return _React.createElement(
          'div',
          { style: { position: 'relative', height: height } },
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
        initialIndex: _React.PropTypes.number,
        itemHeightGetter: _React.PropTypes.func,
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
        threshold: 500,
        type: 'simple'
      },
      enumerable: true
    }]);

    return _class;
  })(_React.Component);

  module.exports = _default;
});
