import React from 'react';
import ReactList from 'react-list';

const renderItem = (index, key) =>
  <div key={key} className={'item' + (index % 2 ? '' : ' even')}>
    {index}
  </div>;
renderItem.toJSON = () => renderItem.toString();

const renderSquareItem = (index, key) =>
  <div key={key} className={'square-item' + (index % 2 ? '' : ' even')}>
    {index}
  </div>;
renderSquareItem.toJSON = () => renderSquareItem.toString();

const getHeight = index => 30 + (10 * (index % 10));
getHeight.toJSON = () => getHeight.toString();

const getWidth = index => 100 + (10 * (index % 10));
getWidth.toJSON = () => getWidth.toString();

const renderVariableHeightItem = (index, key) =>
  <div
    key={key}
    className={'item' + (index % 2 ? '' : ' even')}
    style={{lineHeight: `${getHeight(index)}px`}}
  >
    {index}
  </div>;
renderVariableHeightItem.toJSON = () => renderVariableHeightItem.toString();

const renderVariableWidthItem = (index, key) =>
  <div
    key={key}
    className={'item' + (index % 2 ? '' : ' even')}
    style={{width: `${getWidth(index)}px`}}
  >
    {index}
  </div>;
renderVariableWidthItem.toJSON = () => renderVariableWidthItem.toString();

const renderGridLine = (row, key) =>
  <ReactList
    axis='x'
    key={key}
    length={10000}
    itemRenderer={
      (column, key) => renderSquareItem(column + (10000 * row), key)
    }
    type='uniform'
  />;
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
    type: 'uniform'
  }
];

export default class extends React.Component {
  renderExamples() {
    return examples.map((props, key) =>
      <div key={key} className={`example axis-${props.axis}`}>
        <strong>Props</strong>
        <pre className='props'>{JSON.stringify(props, null, 2)}</pre>
        <strong>Component</strong>
        <div className='component'><ReactList {...props} /></div>
      </div>
    );
  }

  render() {
    return (
      <div className='index'>
        <div className='header'>
          <h1>ReactList</h1>
          <a href='https://github.com/orgsync/react-list'>on GitHub</a>
          <h2>Examples</h2>
        </div>
        {this.renderExamples()}
      </div>
    );
  }
}
