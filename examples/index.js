(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'react-list'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('react-list'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.React, global.ReactList);
    global.index = mod.exports;
  }
})(this, function (exports, _react, _reactList) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _reactList2 = _interopRequireDefault(_reactList);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

  var renderItem = function renderItem(index, key) {
    return _react2.default.createElement(
      'div',
      { key: key, className: 'item' + (index % 2 ? '' : ' even') },
      index
    );
  };
  renderItem.toJSON = function () {
    return renderItem.toString();
  };

  var renderSquareItem = function renderSquareItem(index, key) {
    return _react2.default.createElement(
      'div',
      { key: key, className: 'square-item' + (index % 2 ? '' : ' even') },
      index
    );
  };
  renderSquareItem.toJSON = function () {
    return renderSquareItem.toString();
  };

  var getHeight = function getHeight(index) {
    return 30 + 10 * (index % 10);
  };
  getHeight.toJSON = function () {
    return getHeight.toString();
  };

  var getWidth = function getWidth(index) {
    return 100 + 10 * (index % 10);
  };
  getWidth.toJSON = function () {
    return getWidth.toString();
  };

  var renderVariableHeightItem = function renderVariableHeightItem(index, key) {
    return _react2.default.createElement(
      'div',
      {
        key: key,
        className: 'item' + (index % 2 ? '' : ' even'),
        style: { lineHeight: getHeight(index) + 'px' }
      },
      index
    );
  };
  renderVariableHeightItem.toJSON = function () {
    return renderVariableHeightItem.toString();
  };

  var renderVariableWidthItem = function renderVariableWidthItem(index, key) {
    return _react2.default.createElement(
      'div',
      {
        key: key,
        className: 'item' + (index % 2 ? '' : ' even'),
        style: { width: getWidth(index) + 'px' }
      },
      index
    );
  };
  renderVariableWidthItem.toJSON = function () {
    return renderVariableWidthItem.toString();
  };

  var renderGridLine = function renderGridLine(row, key) {
    return _react2.default.createElement(_reactList2.default, {
      axis: 'x',
      key: key,
      length: 10000,
      itemRenderer: function itemRenderer(column, key) {
        return renderSquareItem(column + 10000 * row, key);
      },
      type: 'uniform'
    });
  };
  renderGridLine.toJSON = function () {
    return renderGridLine.toString();
  };

  var examples = [{
    length: 10000,
    itemRenderer: renderVariableHeightItem
  }, {
    axis: 'x',
    length: 10000,
    itemRenderer: renderVariableWidthItem
  }, {
    length: 10000,
    itemRenderer: renderVariableHeightItem,
    type: 'variable'
  }, {
    axis: 'x',
    length: 10000,
    itemRenderer: renderVariableWidthItem,
    type: 'variable'
  }, {
    length: 10000,
    itemRenderer: renderVariableHeightItem,
    itemSizeGetter: getHeight,
    type: 'variable'
  }, {
    axis: 'x',
    length: 10000,
    itemRenderer: renderVariableWidthItem,
    itemSizeGetter: getWidth,
    threshold: 0,
    type: 'variable'
  }, {
    length: 10000,
    initialIndex: 5000,
    itemRenderer: renderVariableHeightItem,
    itemSizeGetter: getHeight,
    type: 'variable'
  }, {
    length: 10000,
    itemRenderer: renderItem,
    type: 'uniform'
  }, {
    axis: 'x',
    length: 10000,
    itemRenderer: renderItem,
    type: 'uniform'
  }, {
    length: 10000,
    itemRenderer: renderSquareItem,
    type: 'uniform'
  }, {
    length: 10000,
    initialIndex: 5000,
    itemRenderer: renderItem,
    type: 'uniform'
  }, {
    length: 10000,
    itemRenderer: renderGridLine,
    type: 'uniform',
    useTranslate3d: true
  }];

  var _class = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'renderExamples',
      value: function renderExamples() {
        return examples.map(function (props, key) {
          return _react2.default.createElement(
            'div',
            { key: key, className: 'example axis-' + props.axis },
            _react2.default.createElement(
              'strong',
              null,
              'Props'
            ),
            _react2.default.createElement(
              'pre',
              { className: 'props' },
              JSON.stringify(props, null, 2)
            ),
            _react2.default.createElement(
              'strong',
              null,
              'Component'
            ),
            _react2.default.createElement(
              'div',
              { className: 'component' },
              _react2.default.createElement(_reactList2.default, props)
            )
          );
        });
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(
          'div',
          { className: 'index' },
          _react2.default.createElement(
            'a',
            { className: 'banner', href: 'https://github.com/orgsync/react-list' },
            _react2.default.createElement('img', {
              src: 'https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67',
              alt: 'Fork me on GitHub'
            })
          ),
          _react2.default.createElement(
            'div',
            { className: 'header' },
            'ReactList'
          ),
          _react2.default.createElement(
            'div',
            { className: 'examples' },
            this.renderExamples()
          )
        );
      }
    }]);

    return _class;
  }(_react2.default.Component);

  exports.default = _class;
});
