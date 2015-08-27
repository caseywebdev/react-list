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

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  var _React = _interopRequire(_react);

  var _ReactList = _interopRequire(_reactList);

  var renderItem = function renderItem(index, key) {
    return _React.createElement(
      'div',
      { key: key, className: 'item' + (index % 2 ? '' : ' even') },
      index
    );
  };
  renderItem.toJSON = function () {
    return renderItem.toString();
  };

  var renderSquareItem = function renderSquareItem(index, key) {
    return _React.createElement(
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
    return _React.createElement(
      'div',
      {
        key: key,
        className: 'item' + (index % 2 ? '' : ' even'),
        style: { lineHeight: '' + getHeight(index) + 'px' }
      },
      index
    );
  };
  renderVariableHeightItem.toJSON = function () {
    return renderVariableHeightItem.toString();
  };

  var renderVariableWidthItem = function renderVariableWidthItem(index, key) {
    return _React.createElement(
      'div',
      {
        key: key,
        className: 'item' + (index % 2 ? '' : ' even'),
        style: { width: '' + getWidth(index) + 'px' }
      },
      index
    );
  };
  renderVariableWidthItem.toJSON = function () {
    return renderVariableWidthItem.toString();
  };

  var renderGridLine = function renderGridLine(row, key) {
    return _React.createElement(_ReactList, {
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
    var _class = function _default() {
      _classCallCheck(this, _class);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    };

    _inherits(_class, _React$Component);

    _createClass(_class, [{
      key: 'renderExamples',
      value: function renderExamples() {
        return examples.map(function (props, key) {
          return _React.createElement(
            'div',
            { key: key, className: 'example axis-' + props.axis },
            _React.createElement(
              'strong',
              null,
              'Props'
            ),
            _React.createElement(
              'pre',
              { className: 'props' },
              JSON.stringify(props, null, 2)
            ),
            _React.createElement(
              'strong',
              null,
              'Component'
            ),
            _React.createElement(
              'div',
              { className: 'component' },
              _React.createElement(_ReactList, props)
            )
          );
        });
      }
    }, {
      key: 'render',
      value: function render() {
        return _React.createElement(
          'div',
          { className: 'index' },
          _React.createElement(
            'div',
            { className: 'header' },
            _React.createElement(
              'h1',
              null,
              'ReactList'
            ),
            _React.createElement(
              'a',
              { href: 'https://github.com/orgsync/react-list' },
              'on GitHub'
            ),
            _React.createElement(
              'h2',
              null,
              'Examples'
            )
          ),
          this.renderExamples()
        );
      }
    }]);

    return _class;
  })(_React.Component);

  module.exports = _default;
});
