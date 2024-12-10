module.exports = {
  main: {
    transformers: [
      {
        name: 'babel',
        only: 'src/react-list.js',
        options: {
          presets: [
            '@babel/preset-env',
            ['@babel/preset-react', { runtime: 'automatic' }]
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
            [
              '@babel/plugin-transform-modules-umd',
              {
                globals: {
                  react: 'React',
                  'react-list': 'ReactList',
                  'react/jsx-runtime': 'ReactJsxRuntime'
                },
                moduleId: 'react-list',
                exactGlobals: true
              }
            ]
          ]
        }
      }
    ],
    builds: { 'src/react-list.js': { base: 'src' } }
  },
  docs: {
    transformers: [
      {
        name: 'replace',
        options: {
          flags: 'g',
          patterns: { 'process.env.NODE_ENV': "'development'" }
        }
      },
      {
        name: 'babel',
        only: 'src/docs/index.js',
        options: {
          presets: [
            '@babel/preset-env',
            ['@babel/preset-react', { runtime: 'automatic' }]
          ]
        }
      },
      {
        name: 'concat-commonjs',
        options: { entry: 'src/docs/index.js' }
      }
    ],
    builds: { 'src/docs/index.js': { base: 'src' } }
  }
};
