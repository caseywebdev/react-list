import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';

import ReactList from '../..';

const renderItem = (index, key) => (
  <div key={key} className={'item' + (index % 2 ? '' : ' even')}>
    {index}
  </div>
);
renderItem.toJSON = () => renderItem.toString();

const renderSquareItem = (index, key) => (
  <div key={key} className={'square-item' + (index % 2 ? '' : ' even')}>
    {index}
  </div>
);
renderSquareItem.toJSON = () => renderSquareItem.toString();

const getHeight = index => 30 + 10 * (index % 10);
getHeight.toJSON = () => getHeight.toString();

const getWidth = index => 100 + 10 * (index % 10);
getWidth.toJSON = () => getWidth.toString();

const renderVariableHeightItem = (index, key) => (
  <div
    key={key}
    className={'item' + (index % 2 ? '' : ' even')}
    style={{ lineHeight: `${getHeight(index)}px` }}
  >
    {index}
  </div>
);
renderVariableHeightItem.toJSON = () => renderVariableHeightItem.toString();

const renderVariableWidthItem = (index, key) => (
  <div
    key={key}
    className={'item' + (index % 2 ? '' : ' even')}
    style={{ width: `${getWidth(index)}px` }}
  >
    {index}
  </div>
);
renderVariableWidthItem.toJSON = () => renderVariableWidthItem.toString();

const renderGridLine = (row, key) => (
  <ReactList
    axis='x'
    key={key}
    length={10000}
    itemRenderer={(column, key) => renderSquareItem(column + 10000 * row, key)}
    type='uniform'
  />
);
renderGridLine.toJSON = () => renderGridLine.toString();

const examples = [
  {
    length: 10000,
    itemRenderer: renderVariableHeightItem
  },
  {
    axis: 'x',
    length: 10000,
    itemRenderer: renderVariableWidthItem
  },
  {
    length: 10000,
    itemRenderer: renderVariableHeightItem,
    type: 'variable'
  },
  {
    axis: 'x',
    length: 10000,
    itemRenderer: renderVariableWidthItem,
    type: 'variable'
  },
  {
    length: 10000,
    itemRenderer: renderVariableHeightItem,
    itemSizeGetter: getHeight,
    type: 'variable'
  },
  {
    axis: 'x',
    length: 10000,
    itemRenderer: renderVariableWidthItem,
    itemSizeGetter: getWidth,
    threshold: 0,
    type: 'variable'
  },
  {
    length: 10000,
    initialIndex: 5000,
    itemRenderer: renderVariableHeightItem,
    itemSizeGetter: getHeight,
    type: 'variable'
  },
  {
    length: 10000,
    itemRenderer: renderItem,
    type: 'uniform'
  },
  {
    axis: 'x',
    length: 10000,
    itemRenderer: renderItem,
    type: 'uniform'
  },
  {
    length: 10000,
    itemRenderer: renderSquareItem,
    type: 'uniform'
  },
  {
    length: 10000,
    initialIndex: 5000,
    itemRenderer: renderItem,
    type: 'uniform'
  },
  {
    length: 10000,
    itemRenderer: renderGridLine,
    type: 'uniform',
    useTranslate3d: true
  }
];

class Examples extends Component {
  renderExamples() {
    return examples.map((props, key) => (
      <div key={key} className={`example axis-${props.axis}`}>
        <strong>Props</strong>
        <pre className='props'>{JSON.stringify(props, null, 2)}</pre>
        <strong>Component</strong>
        <div className='component'>
          <ReactList {...props} />
        </div>
      </div>
    ));
  }

  render() {
    return (
      <div className='index'>
        <a className='banner' href='https://github.com/caseywebdev/react-list'>
          <img
            src='https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149'
            alt='Fork me on GitHub'
          />
        </a>
        <div className='header'>ReactList</div>
        <div className='examples'>{this.renderExamples()}</div>
      </div>
    );
  }
}

createRoot(document.getElementById('main')).render(<Examples />);
