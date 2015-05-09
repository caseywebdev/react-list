(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'react'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.React);
    global.reactList = mod.exports;
  }
})(this, function (exports, _react) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x,
    property = _x2,
    receiver = _x3; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  var _React = _interopRequire(_react);

  var List = (function (_React$Component) {
    function List() {
      _classCallCheck(this, List);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }

      this.state = {
        from: 0,
        size: this.props.pageSize
      };
    }

    _inherits(List, _React$Component);

    _createClass(List, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(next) {
        var size = this.state.size;
        var length = next.length;
        var pageSize = next.pageSize;

        this.setState({ size: Math.min(Math.max(size, pageSize), length) });
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
      key: 'scrollTo',
      value: function scrollTo(i) {
        var itemEl = _React.findDOMNode(this.items).children[i];
        if (!itemEl) return;
        var itemElTop = itemEl.getBoundingClientRect().top;
        var elTop = _React.findDOMNode(this).getBoundingClientRect().top;
        this.setScroll(itemElTop - elTop);
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
      key: 'updateFrame',
      value: function updateFrame() {
        var frameBottom = this.getScroll() + this.getViewportHeight();
        var elBottom = _React.findDOMNode(this).getBoundingClientRect().height;
        var _props = this.props;
        var pageSize = _props.pageSize;
        var length = _props.length;
        var threshold = _props.threshold;

        if (elBottom >= frameBottom + threshold) return;
        this.setState({ size: Math.min(this.state.size + pageSize, length) });
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _state = this.state;
        var from = _state.from;
        var size = _state.size;

        var items = [];
        for (var i = 0; i < size; ++i) {
          items.push(this.props.itemRenderer(from + i, i));
        }
        return this.props.itemsRenderer(items, function (c) {
          return _this2.items = c;
        });
      }
    }], [{
      key: 'propTypes',
      value: {
        initialIndex: _React.PropTypes.number,
        itemRenderer: _React.PropTypes.func,
        itemsRenderer: _React.PropTypes.func,
        length: _React.PropTypes.number,
        pageSize: _React.PropTypes.number,
        threshold: _React.PropTypes.number
      },
      enumerable: true
    }, {
      key: 'defaultProps',
      value: {
        itemRenderer: function itemRenderer(i, j) {
          return _React.createElement(
            'div',
            { key: j },
            i
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
        threshold: 500
      },
      enumerable: true
    }]);

    return List;
  })(_React.Component);

  exports.List = List;

  List.prototype.shouldComponentUpdate = _React.addons.PureRenderMixin.shouldComponentUpdate;

  var UniformList = (function (_List) {
    function UniformList() {
      _classCallCheck(this, UniformList);

      if (_List != null) {
        _List.apply(this, arguments);
      }

      this.state = {
        from: 0,
        itemHeight: this.props.itemHeight || 0,
        itemsPerRow: this.props.itemsPerRow || 1,
        size: 1
      };
    }

    _inherits(UniformList, _List);

    _createClass(UniformList, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(next) {
        var _state2 = this.state;
        var itemsPerRow = _state2.itemsPerRow;
        var from = _state2.from;
        var size = _state2.size;
        var length = next.length;

        from = Math.max(Math.min(from, this.getMaxFrom(length, itemsPerRow)), 0);
        size = Math.min(Math.max(size, 1), length - from);
        this.setState({ from: from, size: size });
      }
    }, {
      key: 'getMaxScrollFor',
      value: function getMaxScrollFor(index) {
        var _state3 = this.state;
        var itemHeight = _state3.itemHeight;
        var itemsPerRow = _state3.itemsPerRow;

        return Math.floor(index / itemsPerRow) * itemHeight;
      }
    }, {
      key: 'scrollTo',
      value: function scrollTo(index) {
        this.setScroll(this.getMaxScrollFor(index));
      }
    }, {
      key: 'scrollAround',
      value: function scrollAround(index) {
        var itemHeight = this.state.itemHeight;

        var current = this.getScroll();
        var max = this.getMaxScrollFor(index);
        if (current > max) return this.setScroll(max);
        var min = max - this.getViewportHeight() + itemHeight;
        if (current < min) this.setScroll(min);
      }
    }, {
      key: 'updateFrame',
      value: function updateFrame() {
        var _props2 = this.props;
        var itemHeight = _props2.itemHeight;
        var itemsPerRow = _props2.itemsPerRow;

        if (itemHeight == null || itemsPerRow == null) {
          var itemEls = _React.findDOMNode(this.items).children;
          if (!itemEls.length) return;

          var firstRect = itemEls[0].getBoundingClientRect();
          itemHeight = this.state.itemHeight;
          if (Math.round(firstRect.height) !== Math.round(itemHeight)) {
            itemHeight = firstRect.height;
          }
          if (!itemHeight) return;

          var firstRowBottom = Math.round(firstRect.bottom);
          itemsPerRow = 1;
          for (var item = itemEls[itemsPerRow]; item && Math.round(item.getBoundingClientRect().top) < firstRowBottom; item = itemEls[itemsPerRow]) {
            ++itemsPerRow;
          }
        }

        if (!itemHeight || !itemsPerRow) return;

        var threshold = this.props.threshold;

        var top = Math.max(0, this.getScroll() - threshold);
        var from = Math.min(Math.floor(top / itemHeight) * itemsPerRow, this.getMaxFrom(this.props.length, itemsPerRow));

        var viewportHeight = this.getViewportHeight() + threshold * 2;
        var size = Math.min((Math.ceil(viewportHeight / itemHeight) + 1) * itemsPerRow, this.props.length - from);

        this.setState({ itemsPerRow: itemsPerRow, from: from, itemHeight: itemHeight, size: size });
      }
    }, {
      key: 'getMaxFrom',
      value: function getMaxFrom(length, itemsPerRow) {
        return Math.max(0, length - itemsPerRow - length % itemsPerRow);
      }
    }, {
      key: 'getSpace',
      value: function getSpace(n) {
        return n / this.state.itemsPerRow * this.state.itemHeight;
      }
    }, {
      key: 'render',
      value: function render() {
        var transform = 'translate(0, ' + this.getSpace(this.state.from) + 'px)';
        return _React.createElement(
          'div',
          {
            style: { position: 'relative', height: this.getSpace(this.props.length) }
          },
          _React.createElement(
            'div',
            { style: { WebkitTransform: transform, transform: transform } },
            _get(Object.getPrototypeOf(UniformList.prototype), 'render', this).call(this)
          )
        );
      }
    }], [{
      key: 'propTypes',
      value: {
        initialIndex: _React.PropTypes.number,
        itemHeight: _React.PropTypes.number,
        itemRenderer: _React.PropTypes.func,
        itemsPerRow: _React.PropTypes.number,
        itemsRenderer: _React.PropTypes.func,
        length: _React.PropTypes.number,
        threshold: _React.PropTypes.number
      },
      enumerable: true
    }, {
      key: 'defaultProps',
      value: {
        itemRenderer: function itemRenderer(i, j) {
          return _React.createElement(
            'div',
            { key: j },
            i
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
        threshold: 500
      },
      enumerable: true
    }]);

    return UniformList;
  })(List);

  exports.UniformList = UniformList;
});
