import resolve from 'rollup-plugin-node-resolve';
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
    'mobx',
    'mobx-react',
    'moment',
    'react',
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
    json()
  ]
};
