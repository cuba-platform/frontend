/* This script generates navigation panel for the documentation site.
 *
 * Level 1 and 2 sections will be included if they have an id:
 *
 * [[section-id]]
 * == Section Title
 *
 * [[sub-section-id]]
 * === Subsection Title
 */

const fs = require('fs');

const linkPattern = /^\[\[([a-zA-Z0-9-]*)\]\]/;
const namePattern = /^={2,3} (.*)/;

const doc = fs.readFileSync('./docs-src/doc-component-repo/modules/ROOT/pages/index.adoc', 'utf8');

let id;
let idIndex;

let nav = doc.split('\n').reduce((accumulator, line, index) => {
  if (line.match(linkPattern)) {
    id = line.match(linkPattern)[1];
    idIndex = index;
    return accumulator;
  }

  if (line.match(namePattern)) {
    const name = line.match(namePattern)[1];
    if (index === idIndex + 1) {
      const isSubsection = line.startsWith('===');
      const navItem = `${isSubsection ? '**' : '*'} link:#${id}[${name}]\n`;
      id = null;
      idIndex = null;
      return accumulator + navItem;
    } else {
      console.log('Skipping (sub)section name not preceded by an id: ' + name);
    }
  }

  return accumulator;
}, '');

if (id) {
  console.log('Skipping id not followed by (sub)section name: ' + id);
}

// Add API reference links to side menu as header won't be visible on mobile
nav += (
  '\n' +
  '* _Libraries API Reference_\n' +
  '** link:api-reference/cuba-rest-js/index.html[CUBA REST JS^]\n' +
  '** link:api-reference/cuba-react-core/index.html[CUBA React Core^]\n' +
  '** link:api-reference/cuba-react-ui/index.html[CUBA React UI^]'
);

fs.writeFileSync('./docs-src/doc-component-repo/modules/ROOT/nav.adoc', nav);

console.log(`Navigation panel for documentation site has been successfully generated`);
