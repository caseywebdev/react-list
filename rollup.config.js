import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';

// eslint-disable-next-line no-process-env
const environment = process.env.NODE_ENV || 'development';
const production = environment === 'production';
const formats = ['esm', 'cjs', 'umd'];
const ext = production ? 'min.js' : 'js';

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes'
};

export default {
  input: './react-list.es6',
  external: Object.keys(globals),
  output: formats.map(format => ({
    globals,
    file: `${format}/react-list.${ext}`,
    format,
    name: format === 'umd' ? 'ReactList' : undefined
  })),
  plugins: [
    replace({'process.env.NODE_ENV': JSON.stringify(environment)}),
    resolve(),
    commonjs({
      include: ['node_modules/**'],
      namedExports: {
        react: ['Component']
      }
    }),
    babel({
      babelrc: false,
      exclude: ['node_modules/**'],
      presets: ['@babel/preset-react'],
      plugins: [
        production && ['babel-plugin-transform-react-remove-prop-types', {
          removeImport: true
        }],
        '@babel/plugin-proposal-class-properties'
      ].filter(Boolean)
    }),
    production && terser()
  ].filter(Boolean)
};
