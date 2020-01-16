import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import postcss from 'rollup-plugin-postcss';
import resolveNodeImportsInLess from './resolve-node-imports-in-less';
import * as autoprefixer from "autoprefixer";

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
    resolve(),
    commonjs({
      namedExports: {
        'invariant': ['default'],
      }
    }),
    json(),
    postcss({
      extensions: ['.less'],
      extract: 'dist/index.min.css',
      minimize: true,
      use: [
        ['less', {javascriptEnabled: true}],
        'resolveNodeImportsInLess',
      ],
      loaders: [
        resolveNodeImportsInLess
      ],
      plugins: [
        autoprefixer
      ]
    }),
  ]
};
