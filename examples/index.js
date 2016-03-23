(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'react', 'react-list'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('react'), require('react-list'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.React, global.ReactList);
    global.index = mod.exports;
  }
})(this, function (exports, module, _react, _reactList) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var _React = _interopRequireDefault(_react);

  var _ReactList = _interopRequireDefault(_reactList);

  var renderItem = function renderItem(index, key) {
    return _React['default'].createElement(
      'div',
      { key: key, className: 'item' + (index % 2 ? '' : ' even') },
      index
    );
  };
  renderItem.toJSON = function () {
    return renderItem.toString();
  };

  var renderSquareItem = function renderSquareItem(index, key) {
    return _React['default'].createElement(
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
    return _React['default'].createElement(
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
    return _React['default'].createElement(
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
    return _React['default'].createElement(_ReactList['default'], {
      axis: 'x',
      key: key,
      length: 10000,
      itemRenderer: function (column, key) {
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

  var _default = (function (_React$Component) {
    _inherits(_default, _React$Component);

    function _default() {
      _classCallCheck(this, _default);

      _get(Object.getPrototypeOf(_default.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(_default, [{
      key: 'renderExamples',
      value: function renderExamples() {
        return examples.map(function (props, key) {
          return _React['default'].createElement(
            'div',
            { key: key, className: 'example axis-' + props.axis },
            _React['default'].createElement(
              'strong',
              null,
              'Props'
            ),
            _React['default'].createElement(
              'pre',
              { className: 'props' },
              JSON.stringify(props, null, 2)
            ),
            _React['default'].createElement(
              'strong',
              null,
              'Component'
            ),
            _React['default'].createElement(
              'div',
              { className: 'component' },
              _React['default'].createElement(_ReactList['default'], props)
            )
          );
        });
      }
    }, {
      key: 'render',
      value: function render() {
        return _React['default'].createElement(
          'div',
          { className: 'index' },
          _React['default'].createElement(
            'a',
            { className: 'banner', href: 'https://github.com/orgsync/react-list' },
            _React['default'].createElement('img', {
              src: 'https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67',
              alt: 'Fork me on GitHub'
            })
          ),
          _React['default'].createElement(
            'div',
            { className: 'header' },
            'ReactList'
          ),
          _React['default'].createElement(
            'div',
            { className: 'examples' },
            this.renderExamples()
          )
        );
      }
    }]);

    return _default;
  })(_React['default'].Component);

  module.exports = _default;
});
