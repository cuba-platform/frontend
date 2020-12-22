import path from 'path';

/**
 * A custom rollup-plugin-postcss loader that resolves node_modules imports in Less files
 * and replaces them with relative path imports.
 */
export default {
  name: 'resolveNodeImportsInLess',
  test: /\.less$/,
  async process({code}) {
    const lessFilePath = this.id;
    const from = path.dirname(lessFilePath);
    const to = './node_modules/';
    const relativePath = path.relative(from, to);

    const modifiedInput = code.replace(/(@import ['"])(~)([a-zA-Z0-9\/]*['"];\n)/g, `$1${relativePath}/$3`);

    return {
      code: modifiedInput,
    };
  }
}
