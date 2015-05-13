import React from 'react';
import ReactList from 'react-list';

const renderItem = (index, key) =>
  <div key={key} className={'item' + (index % 2 ? '' : ' even')}>
    {index}
  </div>;

renderItem.toJSON = () => renderItem.toString();

const renderSquareItem = (index, key) =>
  <div key={key} className={'square-item' + (index % 2 ? '': ' even')}>
    {index}
  </div>;

renderSquareItem.toJSON = () => renderSquareItem.toString();

const getHeight = index => 30 + (10 * (index % 10));

getHeight.toJSON = () => getHeight.toString();

const renderVariableItem = (index, key) =>
  <div
    key={key}
    className={'item' + (index % 2 ? '' : ' even')}
    style={{lineHeight: `${getHeight(index)}px`}}
  >
    {index}
  </div>;

renderVariableItem.toJSON = () => renderVariableItem.toString();

const examples = [
  {
    length: 10000,
    itemRenderer: renderVariableItem
  },
  {
    length: 10000,
    itemRenderer: renderVariableItem,
    type: 'variable'
  },
  {
    length: 10000,
    itemHeightGetter: getHeight,
    itemRenderer: renderVariableItem,
    type: 'variable'
  },
  {
    length: 10000,
    initialIndex: 5000,
    itemHeightGetter: getHeight,
    itemRenderer: renderVariableItem,
    type: 'variable'
  },
  {
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
  }
];

export default class extends React.Component {
  renderExamples() {
    return examples.map((props, key) =>
      <div key={key} className='example'>
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
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body {
                margin: 0;
                font-family: 'Helvetica Neue', sans-serif;
              }

              a {
                color: #38afd4;
                text-decoration: none;
              }

              a:hover {
                text-decoration: underline;
              }

              .header {
                text-align: center;
              }

              .example {
                padding: 25px;
              }

              .props {
                overflow: auto;
              }

              .component {
                border: 10px solid #38afd4;
                border-radius: 5px;
                height: 300px;
                overflow: auto;
                -webkit-overflow-scrolling: touch;
              }

              .item {
                background: linear-gradient(#fff, #eee);
                line-height: 30px;
                padding: 0 10px;
              }

              .square-item {
                background: linear-gradient(#fff, #eee);
                display: inline-block;
                line-height: 100px;
                text-align: center;
                width: 100px;
              }

              .even {
                background: linear-gradient(#ddd, #ccc);
              }
            `
          }}
        />
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
