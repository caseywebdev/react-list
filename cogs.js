module.exports = {
  in: {
    es6: {
      out: 'js',
      transformers: [
        {
          name: 'babel',
          options: {modules: 'umd', stage: 0}
        },
        {
          name: 'replace',
          only: 'react-list.es6',
          options: {patterns: {reactList: 'ReactList'}}}
      ]
    }
  },
  builds: {
    'react-list.es6': '.',
    'examples/index.es6': 'examples'
  }
};
