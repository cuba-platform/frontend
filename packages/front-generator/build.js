const vfs = require('vinyl-fs');

vfs.src(['src/**/template/**']).pipe(vfs.dest('lib'));