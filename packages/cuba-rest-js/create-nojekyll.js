const fs = require('fs');

fs.writeFileSync('docs/.nojekyll', '');
console.log('Created .nojekyll file');
