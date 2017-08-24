module.exports = [
  {
    transformers: [
      'eslint',
      {
        name: 'babel',
        options: {
          presets: ['es2015', 'stage-0', 'react'],
          plugins: [['transform-es2015-modules-umd', {
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
    builds: {'react-list.es6': 'react-list.js'}
  },
  {
    transformers: [
      {
        name: 'replace',
        options: {
          flags: 'g',
          patterns: {'process.env.NODE_ENV': "'development'"}
        }
      },
      {name: 'babel', options: {presets: ['es2015', 'stage-0', 'react']}},
      {
        name: 'concat-commonjs',
        options: {entry: 'docs/index.es6', extensions: ['.es6', '.js']}
      }
    ],
    builds: {'docs/index.es6': 'docs/index.js'}
  }
];
