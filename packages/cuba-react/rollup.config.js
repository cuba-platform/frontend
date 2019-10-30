import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

export default {
  input: 'dist-transpiled/index.js',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'es'
    },
    {
      file: 'dist/index.js',
      format: 'commonjs'
    }
  ],
  external: [
    '@cuba-platform/rest',
    'antd',
    'mobx',
    'mobx-react',
    'moment',
    'react',
    'react-intl',
    'react-dom',
    'react-router',
    'react-router-dom',
    'react-testing-library',
  ],
  plugins: [
    postcss({
      extensions: ['.css']
    }),
    resolve(),
    commonjs({
      namedExports: {
        'invariant': ['default'],
      }
    }),
    json(),
  ]
};
