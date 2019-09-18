module.exports = {
  main: {
    transformers: [
      'eslint',
      {
        name: 'babel',
        only: 'react-list.es6',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            '@babel/plugin-proposal-class-properties', ['@babel/plugin-transform-modules-umd', {
            globals: {
              react: 'React',
              'prop-types': 'PropTypes',
              'react-dom': 'ReactDOM',
              'react-list': 'ReactList'
            },
            moduleId: 'react-list',
            exactGlobals: true
          }]]
        }
      }
    ],
    builds: {'react-list.es6': {ext: {'.es6': '.js'}}}
  },
  docs: {
    transformers: [
      {
        name: 'replace',
        options: {
          flags: 'g',
          patterns: {'process.env.NODE_ENV': "'development'"}
        }
      },
      {
        name: 'babel',
        only: 'docs/index.es6',
        options: {presets: ['@babel/preset-env', '@babel/preset-react']}
      },
      {
        name: 'concat-commonjs',
        options: {entry: 'docs/index.es6', extensions: ['.es6', '.js']}
      }
    ],
    builds: {'docs/index.es6': {ext: {'.es6': '.js'}}}
  }
};
