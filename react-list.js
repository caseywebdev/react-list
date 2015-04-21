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

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };

  var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _React = _interopRequire(_react);

  var isEqualSubset = function isEqualSubset(a, b) {
    for (var _key in a) {
      if (b[_key] !== a[_key]) {
        return false;
      }
    }return true;
  };

  var isEqual = function isEqual(a, b) {
    return isEqualSubset(a, b) && isEqualSubset(b, a);
  };

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
      key: 'state',
      value: undefined,
      enumerable: true
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
      }
    }, {
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
      }
    }, {
      key: 'getScrollParent',
      value: function getScrollParent() {
        for (var el = _React.findDOMNode(this); el; el = el.parentElement) {
          var overflowY = window.getComputedStyle(el).overflowY;
          if (overflowY === 'auto' || overflowY === 'scroll') {
            return el;
          }
        }
        return window;
      }
    }, {
      key: 'getScroll',
      value: function getScroll() {
        var scrollParent = this.scrollParent;

        var el = _React.findDOMNode(this);
        if (scrollParent === el) {
          return el.scrollTop;
        }if (scrollParent === window) {
          return -el.getBoundingClientRect().top;
        }return scrollParent.scrollTop - el.offsetTop;
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

        if (elBottom >= frameBottom + threshold) {
          return;
        }this.setState({ size: Math.min(this.state.size + pageSize, length) });
      }
    }, {
      key: 'render',
      value: function render() {
        var _this = this;

        var _state = this.state;
        var from = _state.from;
        var size = _state.size;

        var items = [];
        for (var i = 0; i < size; ++i) {
          items.push(this.props.itemRenderer(from + i, i));
        }
        return this.props.itemsRenderer(items, function (c) {
          return _this.items = c;
        });
      }
    }], [{
      key: 'propTypes',
      value: {
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
  ;

  var UniformList = (function (_List) {
    function UniformList() {
      _classCallCheck(this, UniformList);

      if (_List != null) {
        _List.apply(this, arguments);
      }

      this.state = {
        columns: 1,
        from: 0,
        itemHeight: 0,
        size: 1
      };
    }

    _inherits(UniformList, _List);

    _createClass(UniformList, [{
      key: 'state',
      value: undefined,
      enumerable: true
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(next) {
        var _state2 = this.state;
        var columns = _state2.columns;
        var from = _state2.from;
        var size = _state2.size;
        var length = next.length;

        from = Math.max(Math.min(from, this.getMaxFrom(length, columns)), 0);
        size = Math.min(Math.max(size, 1), length) - from;
        this.setState({ from: from, size: size });
      }
    }, {
      key: 'setScroll',
      value: function setScroll(y) {
        var scrollParent = this.scrollParent;

        if (scrollParent === window) {
          return window.scrollTo(0, y);
        }scrollParent.scrollTop = y;
      }
    }, {
      key: 'scrollTo',
      value: function scrollTo(i) {
        var itemHeight = this.state.itemHeight;

        var current = this.getScroll();
        var max = Math.floor(i / this.state.columns) * itemHeight;
        var min = max - this.getViewportHeight() + itemHeight;
        if (current > max) this.setScroll(max);
        if (current < min) this.setScroll(min);
      }
    }, {
      key: 'updateFrame',
      value: function updateFrame() {
        var itemEls = _React.findDOMNode(this.items).children;
        if (!itemEls.length) {
          return;
        }var firstRect = itemEls[0].getBoundingClientRect();
        var itemHeight = firstRect.height;
        if (!itemHeight) {
          return;
        }var firstRowBottom = firstRect.top + itemHeight;
        var columns = 1;
        while (itemEls[columns] && itemEls[columns].getBoundingClientRect().top < firstRowBottom) ++columns;

        var from = Math.min(Math.floor(Math.max(0, this.getScroll()) / itemHeight) * columns, this.getMaxFrom(this.props.length, columns));

        var size = Math.min((Math.ceil(this.getViewportHeight() / itemHeight) + 1) * columns, this.props.length - from);

        this.setState({ columns: columns, from: from, itemHeight: itemHeight, size: size });
      }
    }, {
      key: 'getMaxFrom',
      value: function getMaxFrom(length, columns) {
        return Math.max(0, length - columns - length % columns);
      }
    }, {
      key: 'getSpace',
      value: function getSpace(n) {
        return n / this.state.columns * this.state.itemHeight;
      }
    }, {
      key: 'render',
      value: function render() {
        var position = 'relative';
        var height = this.getSpace(this.props.length);
        var transform = 'translate(0, ' + this.getSpace(this.state.from) + 'px)';
        return _React.createElement(
          'div',
          { style: { position: position, height: height } },
          _React.createElement(
            'div',
            { style: { position: position, WebkitTransform: transform, transform: transform } },
            _get(Object.getPrototypeOf(UniformList.prototype), 'render', this).call(this)
          )
        );
      }
    }], [{
      key: 'propTypes',
      value: {
        itemRenderer: _React.PropTypes.func,
        itemsRenderer: _React.PropTypes.func,
        length: _React.PropTypes.number
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
        length: 0
      },
      enumerable: true
    }]);

    return UniformList;
  })(List);

  exports.UniformList = UniformList;
  ;
});
