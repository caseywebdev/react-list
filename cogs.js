module.exports = {
  transformers: [
    'eslint',
    {
      name: 'babel',
      options: {
        presets: ['es2015', 'stage-1', 'react'],
        plugins: [['transform-es2015-modules-umd', {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react-list': 'ReactList'
          },
          moduleId: 'react-list',
          exactGlobals: true
        }]]
      }
    }
  ],
  builds: {
    'react-list.es6': 'react-list.js',
    'examples/index.es6': 'examples/index.js'
  }
};
