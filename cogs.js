module.exports = {
  in: {
    es6: {
      out: 'js',
      transformers: [
        {
          name: 'babel',
          options: {modules: 'umd', optional: ['es7.classProperties']}
        },
        {name: 'transformers/rename-global', only: 'react-list.es6'}
      ]
    }
  },
  builds: {
    'react-list.es6': '.',
    'index.es6': '.'
  }
};
