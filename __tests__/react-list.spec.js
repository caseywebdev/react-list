import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import ReactTestRenderer from 'react-test-renderer';
import ReactList from './../react-list';

describe('react-list', function () {

  const createNodeMock = function createNodeMock(element) {
    if (element.type === 'div') {
      // div container of react-list
      return document.createElement('div');
    }
    if (element.type === 'ul') {
      // element of the <UniformList>
      return document.createElement('ul');
    }
    // You can return any object from this method for any type of DOM component.
    // React will use it as a ref instead of a DOM node when snapshot testing.
    return null;
  };

  const render = function render(component) {
    const options = {
      createNodeMock
    };
    return ReactTestRenderer.create(component, options);
  };

  class MyList extends React.Component {
    constructor(props) {
      super(props);
      this.listRenderer = this.listRenderer.bind(this);
      this.listItemRenderer = this.listItemRenderer.bind(this);
    }

    listItemRenderer(index, key) {
      return (
        <li key={key}>
          list item: {this.props.items[index]}
        </li>
      );
    }

    listRenderer(items, ref) {
      return (
        <ul ref={ref}>
            {items}
        </ul>
      );
    }

    render() {
      return (
        <ReactList
            length={this.props.items.length}
            type={this.props.type}
            itemRenderer={this.listItemRenderer}
            itemsRenderer={this.listRenderer}
        />
      );
    }
  }

  describe('uniform react-list', () => {

    it('renders with react-test-renderer', function () {
      const tree = render(
        <MyList type={'uniform'} items={[1, 2, 3, 4, 5]} />
      );
      expect(tree).toMatchSnapshot();
    });

    it('renders into DOM', function () {
      const tree = ReactTestUtils.renderIntoDocument(
        <MyList type={'uniform'} items={[1, 2, 3, 4, 5]} />
      );
      const domNode = ReactDOM.findDOMNode(tree);
      expect(domNode).toMatchSnapshot();
    });
  });
});
