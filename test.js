(function (root) {
  'use strict';

  var React = root.React;
  var ReactList = root.ReactList;

  var items = [];
  for (var i = 1; i <= 100000; ++i) items.push(i);

  document.addEventListener('DOMContentLoaded', function () {
    React.renderComponent(ReactList({
      items: items,
      renderItem: function (item, i) {
        return React.DOM.div({key: i}, 'This is item #' + item + '.');
      },
      uniform: true
    }), document.getElementById('items-list'));
  });
})(this);
