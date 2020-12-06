const vfs = require('vinyl-fs');

vfs.src([
  'src/**/template/**',
  'src/**/template/.**',
  'src/**/info.json']
).pipe(vfs.dest('lib'));